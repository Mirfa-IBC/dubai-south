"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/* -------------------- Types -------------------- */
type ScenarioKey = "conservative" | "realistic" | "optimistic"
type ScenarioOrAll = ScenarioKey | "all"
type CashFlow = { date: string; amountFor50k: number; note?: string }
type ScenarioJSON = { label: string; cashFlows: CashFlow[] }
type ScenariosJSON = { scenarios: Record<ScenarioKey, ScenarioJSON> }

type Row = {
  date: Date
  dateISO: string
  monthsFromStart: number
  amount: number
  note?: string
  cumulative: number
}
type ScenarioComputed = {
  key: ScenarioKey
  label: string
  rows: Row[]
  totalIn: number
  totalOut: number
  net: number
  moic: number
  rate: number
  payback: string
}

/* -------------------- XIRR -------------------- */
function xirr(cashflows: { date: Date; amount: number }[], guess = 0.15): number {
  const tol = 1e-7, maxIter = 100
  if (cashflows.length < 2) return Number.NaN
  const flows = [...cashflows].sort((a, b) => a.date.getTime() - b.date.getTime())
  const hasPos = flows.some((f) => f.amount > 0)
  const hasNeg = flows.some((f) => f.amount < 0)
  if (!hasPos || !hasNeg) return Number.NaN
  const t0 = flows[0].date
  let r = guess
  for (let i = 0; i < maxIter; i++) {
    let f = 0, df = 0
    for (const { date, amount } of flows) {
      const years = (date.getTime() - t0.getTime()) / 86_400_000 / 365
      const d = Math.pow(1 + r, years)
      f += amount / d
      df += (-years * amount) / (d * (1 + r))
    }
    if (Math.abs(f) < tol || Math.abs(df) < tol) return r
    const r2 = r - f / df
    if (!isFinite(r2)) return Number.NaN
    if (Math.abs(r2 - r) < tol) return r2
    r = r2
  }
  return r
}

/* -------------------- Utils -------------------- */
const AED = (n: number) =>
  n.toLocaleString("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 })

function toCSV(rows: { date: string; amount: number; cumulative: number; note: string }[]) {
  const header = "Date,Amount (AED),Cumulative (AED),Note"
  const body = rows.map(
    (r) => `${r.date},${r.amount.toFixed(2)},${r.cumulative.toFixed(2)},"${(r.note ?? "").replace(/"/g, '""')}"`,
  )
  return [header, ...body].join("\n")
}
function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
function monthsBetween(a: Date, b: Date) {
  const msPerMonth = (365.2425 / 12) * 24 * 60 * 60 * 1000
  return (b.getTime() - a.getTime()) / msPerMonth
}

const COLORS: Record<ScenarioKey, string> = {
  conservative: "hsl(var(--chart-3))",
  realistic:    "hsl(var(--chart-1))",
  optimistic:   "hsl(var(--chart-2))",
}

/* -------------------- Component -------------------- */
export default function RoiCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(50000)
  const [view, setView] = useState<ScenarioOrAll>("realistic")
  const [data, setData] = useState<ScenariosJSON | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load scenarios from JSON (ALL values come from JSON)
  useEffect(() => {
    let cancelled = false
    fetch("/roi-scenarios.json", { cache: "no-store" })
      .then(r => r.json())
      .then((j: ScenariosJSON) => { if (!cancelled) setData(j) })
      .catch(err => { if (!cancelled) setError("Failed to load ROI scenarios.") })
    return () => { cancelled = true }
  }, [])

  const scenarios = useMemo(() => {
    if (!data) return null
    const scale = investmentAmount / 50000

    const compute = (key: ScenarioKey): ScenarioComputed => {
      const { label, cashFlows } = data.scenarios[key]

      // Normalize + scale
      const rows0 = cashFlows.map(cf => ({
        date: new Date(cf.date + "T00:00:00Z"),
        dateISO: cf.date,
        amount: cf.amountFor50k * scale,
        note: cf.note,
      })).sort((a,b)=>a.date.getTime()-b.date.getTime())

      const t0 = rows0[0]?.date ?? new Date()
      let cumulative = 0
      const rows: Row[] = rows0.map(r => {
        const cum = (cumulative += r.amount)
        return {
          date: r.date,
          dateISO: r.dateISO,
          monthsFromStart: Math.max(0, monthsBetween(t0, r.date)),
          amount: r.amount,
          note: r.note,
          cumulative: cum,
        }
      })

      const totalIn  = Math.abs(rows.filter(r => r.amount < 0).reduce((s, r) => s + r.amount, 0))
      const totalOut = rows.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0)
      const net  = totalOut - totalIn
      const moic = totalIn ? totalOut / totalIn : Number.NaN
      const rate = xirr(rows.map(r => ({ date: r.date, amount: r.amount })))
      const payback = rows.find(r => r.cumulative >= 0)?.dateISO ?? "—"

      return { key, label, rows, totalIn, totalOut, net, moic, rate, payback }
    }

    return {
      conservative: compute("conservative"),
      realistic:    compute("realistic"),
      optimistic:   compute("optimistic"),
    }
  }, [data, investmentAmount])

  if (error) return <div className="p-6 text-center text-destructive">{error}</div>
  if (!scenarios) return <div className="p-6 text-center text-muted-foreground">Loading ROI scenarios…</div>

  // Chart geometry
  const W = 900, H = 320, PAD = 56, AXIS_PAD = 40
  const primaryColor = "hsl(var(--primary))"
  const mutedColor   = "hsl(var(--muted))"

  const selectedKeys = (view === "all") ? (["conservative","realistic","optimistic"] as const) : ([view] as const)
  const selectedScenarios = selectedKeys.map(k => scenarios[k])

  const maxMonths = Math.max(1, ...selectedScenarios.flatMap(s => s.rows.map(r => r.monthsFromStart ?? 0)))
  const allCum = selectedScenarios.flatMap(s => s.rows.map(r => r.cumulative))
  const minCum = Math.min(...allCum, 0)
  const maxCum = Math.max(...allCum, 0)
  const ySpan = Math.max(1e-9, maxCum - minCum)

  const xFor = (m: number) => PAD + (m / maxMonths) * (W - 2 * PAD)
  const yFor = (v: number) => {
    const t = (v - minCum) / ySpan
    return PAD + (1 - t) * (H - 2 * PAD - AXIS_PAD)
  }
  const zeroY = yFor(0)

  function buildPath(rows: Row[]) {
    const pts = rows.map(r => ({...r, x: xFor(r.monthsFromStart), y: yFor(r.cumulative)}))
    const d = pts.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ")
    return { pts, d }
  }

  const chartSeries = selectedScenarios.map(s => {
    const { pts, d } = buildPath(s.rows)
    return { key: s.key, label: s.label, color: COLORS[s.key], pts, d, s }
  })

  const active = view === "all" ? scenarios.realistic : scenarios[view as ScenarioKey]

  const onDownload = () => {
    const rows = active.rows.map(r => ({ date: r.dateISO, amount: r.amount, cumulative: r.cumulative, note: r.note ?? "" }))
    downloadCSV(toCSV(rows), `mirfa-roi-schedule-${active.key}.csv`)
  }

  return (
    <Card className="rounded-2xl border shadow-sm p-4 sm:p-6 md:p-8 overflow-visible">
      <style jsx>{`
        .brand-range { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 9999px; background: ${mutedColor}; outline: none; }
        .brand-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 9999px; background: ${primaryColor}; border: 2px solid white; box-shadow: 0 2px 4px rgba(198, 161, 91, 0.3); cursor: pointer; margin-top: -6px; }
        .brand-range::-moz-range-thumb { width: 18px; height: 18px; border-radius: 9999px; background: ${primaryColor}; border: 2px solid white; box-shadow: 0 2px 4px rgba(198, 161, 91, 0.3); cursor: pointer; }
        .brand-range::-moz-range-track { height: 6px; background: ${mutedColor}; border-radius: 9999px; }
      `}</style>

      {/* Controls */}
      <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 space-y-3">
          <label htmlFor="investment-slider" className="block text-sm font-medium">Investment Amount (AED)</label>
          <input
            id="investment-slider"
            type="range"
            min={50000}
            max={1000000}
            step={25000}
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
            className="brand-range"
          />
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min={50000}
              max={1000000}
              step={25000}
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full max-w-xs px-3 py-2 border rounded-md bg-background text-foreground"
            />
            <span className="text-xs text-muted-foreground">Step: AED 25,000 • Range: AED 50,000 – 1,000,000</span>
          </div>
        </div>

        {/* Scenario segmented control */}
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex rounded-full border p-1 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
            {(["conservative","realistic","optimistic","all"] as ScenarioOrAll[]).map(k => (
              <button
                key={k}
                onClick={()=>setView(k)}
                className={[
                  "px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition",
                  view===k ? "bg-primary text-primary-foreground shadow" : "hover:bg-muted"
                ].join(" ")}
                aria-pressed={view===k}
              >
                {k==="all" ? "Compare" : scenarios[k].label}
              </button>
            ))}
          </div>
          <Button onClick={onDownload} variant="outline" size="sm" className="text-xs bg-transparent">
            Download CSV ({view==="all" ? scenarios.realistic.label : scenarios[view as ScenarioKey].label})
          </Button>
        </div>
      </div>

      {/* KPIs */}
      {view === "all" ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6">
          {(["conservative","realistic","optimistic"] as const).map(k => {
            const s = scenarios[k]
            return (
              <div key={k} className="rounded-2xl border p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium opacity-70">{s.label}</span>
                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[k] }} />
                </div>
                <div className="text-lg sm:text-xl font-semibold leading-tight mt-1">
                  {isFinite(s.rate) ? `${(s.rate * 100).toFixed(1)}%` : "—"}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground mt-1">XIRR • Payback {s.payback}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <Kpi label={`XIRR — ${active.label}`} value={isFinite(active.rate) ? `${(active.rate * 100).toFixed(2)}%` : "—"} />
          <Kpi label="Multiple on Invested Capital" value={isFinite(active.moic) ? `${active.moic.toFixed(2)}×` : "—"} />
          <Kpi label="Total Invested" value={AED(active.totalIn)} />
          <Kpi label="Total Returned" value={AED(active.totalOut)} />
          <Kpi label="Net Profit" value={AED(active.net)} />
          <Kpi label="Payback" value={active.payback} />
        </div>
      )}

      {/* Chart */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-sm font-medium mb-3 sm:mb-4">
          {view==="all" ? "Scenario Comparison — Cumulative Cash Flow" : `${active.label} — Investment Journey`}
        </h3>
        <div className="w-full">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Cumulative cash flow chart" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="grid" width="90" height="40" patternUnits="userSpaceOnUse">
                <path d="M 90 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.1" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />
            <line x1={PAD} y1={H - AXIS_PAD} x2={W - PAD} y2={H - AXIS_PAD} stroke="hsl(var(--border))" strokeWidth={2} />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - AXIS_PAD} stroke="hsl(var(--border))" strokeWidth={1} opacity={0.5} />
            <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} opacity={0.6} strokeDasharray="4,4" />

            {/* Series */}
            {(["conservative","realistic","optimistic"] as const)
              .filter(k => view === "all" || k === view)
              .map(k => {
                const s = scenarios[k]
                const pts = s.rows.map(r => ({...r, x: PAD + (r.monthsFromStart / maxMonths) * (W - 2*PAD), y: PAD + (1 - (r.cumulative - minCum) / ySpan) * (H - 2*PAD - AXIS_PAD) }))
                const d = pts.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(" ")
                return (
                  <g key={k}>
                    <path d={d} fill="none" stroke={COLORS[k]} strokeWidth={view==="all" ? 2.25 : 3} strokeLinecap="round" strokeLinejoin="round" />
                    {pts.map((p,i)=>(
                      <circle key={i} cx={p.x} cy={p.y} r={view==="all" ? 3.5 : 5} fill={COLORS[k]} stroke="white" strokeWidth={view==="all" ? 1.5 : 2.5} />
                    ))}
                  </g>
                )
              })
            }

            {/* X ticks (use Realistic as anchor) */}
            {(() => {
              const anchor = scenarios.realistic.rows
              const approxLabelW = 70
              const maxLabels = Math.max(3, Math.floor((W - 2 * PAD) / approxLabelW))
              const dateStep = Math.max(1, Math.ceil(anchor.length / maxLabels))
              return anchor.map((r, i) => (
                <g key={i}>
                  <line x1={PAD + (r.monthsFromStart / maxMonths) * (W - 2*PAD)} y1={H - AXIS_PAD - 6} x2={PAD + (r.monthsFromStart / maxMonths) * (W - 2*PAD)} y2={H - AXIS_PAD + 6} stroke="hsl(var(--muted-foreground))" strokeWidth={1.25} opacity={0.6} />
                  {(i % dateStep === 0 || i === 0 || i === anchor.length - 1) && (
                    <text x={PAD + (r.monthsFromStart / maxMonths) * (W - 2*PAD)} y={H - AXIS_PAD + 18} textAnchor="middle" className="text-[11px] font-medium fill-muted-foreground">
                      {new Date(r.dateISO + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                    </text>
                  )}
                </g>
              ))
            })()}
          </svg>

          {/* Legend — tappable chips */}
          <div className="flex flex-wrap gap-3 mt-3">
            {(["conservative","realistic","optimistic"] as const).map(k => (
              <button
                key={k}
                onClick={()=> setView(v => v==="all" ? (k as ScenarioOrAll) : "all")}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs hover:bg-muted transition"
                aria-label={`Toggle ${scenarios[k].label}`}
                title={view==="all" ? `Focus on ${scenarios[k].label}` : "Compare all scenarios"}
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: COLORS[k] }} />
                {scenarios[k].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule — bound to current focus (Realistic in Compare) */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm font-medium">Investment Milestones &amp; Cash Flow Schedule</h3>
          {view === "all" && (
            <div className="text-xs text-muted-foreground">Showing: <span className="font-medium">{scenarios.realistic.label}</span></div>
          )}
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-3">
          {active.rows.map((r, i) => (
            <div key={i} className={["rounded-xl border p-3 flex items-start justify-between gap-3", i % 2 === 0 ? "bg-muted/20" : ""].join(" ")}>
              <div className="space-y-1">
                <div className="font-medium">
                  {new Date(r.dateISO + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
                <div className="text-xs text-muted-foreground">{r.note}</div>
              </div>
              <div className="text-right">
                <div className={`font-mono text-sm ${r.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(r.amount) < 1e-9 ? "—" : AED(r.amount)}
                </div>
                <div className={`font-mono text-xs ${r.cumulative >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {AED(r.cumulative)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-fixed text-sm min-w-[720px]">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">Date</th>
                <th className="text-right py-2 px-3 font-medium">Cash Flow (AED)</th>
                <th className="text-right py-2 px-3 font-medium">Cumulative (AED)</th>
                <th className="text-left py-2 px-3 font-medium">Milestone</th>
              </tr>
            </thead>
            <tbody>
              {active.rows.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                  <td className="py-2 px-3 font-mono text-xs whitespace-nowrap">
                    {new Date(r.dateISO + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {Math.abs(r.amount) < 1e-9 ? "—" : <span className={r.amount > 0 ? "text-green-600" : "text-red-600"}>{AED(r.amount)}</span>}
                  </td>
                  <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                    <span className={r.cumulative >= 0 ? "text-green-600" : "text-red-600"}>{AED(r.cumulative)}</span>
                  </td>
                  <td className="py-2 px-3 text-muted-foreground break-words">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

/* -------------------- KPI TILE -------------------- */
function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative overflow-visible rounded-2xl border p-3 sm:p-4 bg-background">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-xl sm:text-2xl font-semibold mt-1 leading-tight break-words">
        {value}
      </div>
    </div>
  )
}
