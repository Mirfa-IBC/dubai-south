"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const baseCashFlows = [
  {
    date: "2025-09-01",
    monthsFromStart: 0,
    amountFor50k: -50000,
    note: "Initial Investment Deposit",
    status: "completed",
  },
  { 
    date: "2026-12-01", 
    monthsFromStart: 15, // Fixed: Sep 2025 to Dec 2026 is 15 months
    amountFor50k: 6656.52, 
    note: "First Payout", 
    status: "upcoming" 
  },
  {
    date: "2027-10-01",
    monthsFromStart: 25, // Fixed: Sep 2025 to Oct 2027 is 25 months
    amountFor50k: 43343.48,
    note: "Project Handover Principal Amount Back", // Fixed typo: Principle -> Principal
    status: "upcoming",
  },
  { 
    date: "2028-01-01", 
    monthsFromStart: 28, // Fixed: Sep 2025 to Jan 2028 is 28 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2028-04-01", 
    monthsFromStart: 31, // Fixed: Sep 2025 to Apr 2028 is 31 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2028-07-01", 
    monthsFromStart: 34, // Fixed: Sep 2025 to Jul 2028 is 34 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2028-10-01", 
    monthsFromStart: 37, // Fixed: Sep 2025 to Oct 2028 is 37 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2029-01-01", 
    monthsFromStart: 40, // Fixed: Sep 2025 to Jan 2029 is 40 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2029-04-01", 
    monthsFromStart: 43, // Fixed: Sep 2025 to Apr 2029 is 43 months
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2029-07-01", 
    monthsFromStart: 46, // Added missing payment
    amountFor50k: 3527.22, 
    note: "Quarterly Payout", 
    status: "upcoming" 
  },
  { 
    date: "2029-10-01", 
    monthsFromStart: 49, // Added final payment to match your original data
    amountFor50k: 3527.22, 
    note: "Final Payment", 
    status: "upcoming" 
  },
];

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

const AED = (n: number) =>
  n.toLocaleString("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 })

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

/* -------------------- VIEW -------------------- */
export default function RoiCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState(50000)

  const calc = useMemo(() => {
    const scale = investmentAmount / 50000
    const flows = baseCashFlows
      .map((cf) => ({
        date: new Date(cf.date + "T00:00:00Z"),
        dateISO: cf.date,
        monthsFromStart: cf.monthsFromStart,
        amount: cf.amountFor50k * scale,
        note: cf.note,
        status: cf.status,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    let cumulative = 0
    const rows = flows.map((cf) => ({ ...cf, cumulative: (cumulative += cf.amount) }))

    const totalIn  = Math.abs(rows.filter((r) => r.amount < 0).reduce((s, r) => s + r.amount, 0))
    const totalOut = rows.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0)
    const net  = totalOut - totalIn
    const moic = totalIn ? totalOut / totalIn : Number.NaN
    const rate = xirr(rows.filter((r) => r.amount !== 0).map((r) => ({ date: r.date, amount: r.amount })))
    const payback = rows.find((r) => r.cumulative >= 0)?.dateISO ?? "—"

    return { rows, totalIn, totalOut, net, moic, rate, payback }
  }, [investmentAmount])

  const onDownload = () => {
    downloadCSV(
      toCSV(calc.rows.map((r) => ({ date: r.dateISO, amount: r.amount, cumulative: r.cumulative, note: r.note ?? "" }))),
      "mirfa-roi-schedule.csv",
    )
  }

  /* ---- Chart config ---- */
  const W = 900, H = 320, PAD = 56, AXIS_PAD = 40
  const maxMonths = Math.max(...calc.rows.map((r) => r.monthsFromStart ?? 0), 1)
  const denom = Math.max(1e-9, calc.totalOut)
  const points = calc.rows.map((r) => {
    const x = PAD + (r.monthsFromStart / maxMonths) * (W - 2 * PAD)
    const y = H - AXIS_PAD - PAD - ((r.cumulative + calc.totalIn) / denom) * (H - 2 * PAD - AXIS_PAD)
    return { ...r, x, y }
  })
  const d = points.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ")
  const approxLabelW = 70
  const maxLabels = Math.max(3, Math.floor((W - 2 * PAD) / approxLabelW))
  const dateStep = Math.max(1, Math.ceil(points.length / maxLabels))
  const minAmountLabelGap = 60
  const largestAmountsIdx = (() => {
    const arr = points
      .map((p, i) => ({ i, v: Math.abs(p.amount) }))
      .filter((x) => x.v > 1e-9)
      .sort((a, b) => b.v - a.v)
      .slice(0, 3)
      .map((x) => x.i)
    const firstNZ = points.findIndex((p) => Math.abs(p.amount) > 1e-9)
    const lastNZ = [...points].reverse().findIndex((p) => Math.abs(p.amount) > 1e-9)
    const lastIdx = lastNZ === -1 ? -1 : points.length - 1 - lastNZ
    const set = new Set<number>(arr)
    if (firstNZ >= 0) set.add(firstNZ)
    if (lastIdx >= 0) set.add(lastIdx)
    return set
  })()
  const amountLabelSet = (() => {
    const keep = new Set<number>()
    let lastX = Number.NEGATIVE_INFINITY
    points.forEach((p, i) => {
      if (Math.abs(p.amount) < 1e-9) return
      if (p.x - lastX >= minAmountLabelGap || largestAmountsIdx.has(i)) {
        keep.add(i)
        lastX = p.x
      }
    })
    return keep
  })()
  const clampY = (y: number) => Math.max(PAD + 15, Math.min(H - AXIS_PAD - 15, y))
  const zeroY = H - AXIS_PAD - PAD - ((0 + calc.totalIn) / denom) * (H - 2 * PAD - AXIS_PAD)
  const primaryColor = "hsl(var(--primary))"
  const mutedColor   = "hsl(var(--muted))"

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
        <div className="flex flex-col items-end gap-2">
          <p className="text-xs text-muted-foreground">Annual target (info): ~20.8%</p>
          <Button onClick={onDownload} variant="outline" size="sm" className="text-xs bg-transparent">
            Download CSV
          </Button>
        </div>
      </div>

      {/* KPIs (numbers flow out of tile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
        <Kpi label="XIRR"  value={isFinite(calc.rate) ? `${(calc.rate * 100).toFixed(2)}%` : "—"} accent="text-primary" />
        <Kpi label="MOIC"  value={isFinite(calc.moic) ? `${calc.moic.toFixed(2)}×` : "—"} accent="text-primary" />
        <Kpi label="Total Invested" value={AED(calc.totalIn)} />
        <Kpi label="Total Returned" value={AED(calc.totalOut)} />
        <Kpi label="Net Profit" value={AED(calc.net)} accent={calc.net >= 0 ? "text-green-600" : "text-red-600"} />
        <Kpi label="Payback" value={calc.payback} />
      </div>

      {/* Chart */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-sm font-medium mb-3 sm:mb-4">Investment Journey & Cash Flow Timeline</h3>
        <div className="w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            role="img"
            aria-label="Cumulative cash flow chart"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="grid" width="90" height="40" patternUnits="userSpaceOnUse">
                <path d="M 90 0 L 0 0 0 40" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.1" />
              </pattern>
              <linearGradient id="fillArea" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={primaryColor} stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            <line x1={PAD} y1={H - AXIS_PAD} x2={W - PAD} y2={H - AXIS_PAD} stroke="hsl(var(--border))" strokeWidth={2} />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - AXIS_PAD} stroke="hsl(var(--border))" strokeWidth={1} opacity={0.5} />

            <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} opacity={0.6} strokeDasharray="4,4" />

            {points.length > 1 && (
              <>
                <path d={`${d} L ${points[points.length - 1].x} ${H - AXIS_PAD} L ${points[0].x} ${H - AXIS_PAD} Z`} fill="url(#fillArea)" />
                <path d={d} fill="none" stroke={primaryColor} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}

            {points.map((p, i) => (
              <g key={i}>
                <line x1={p.x} y1={H - AXIS_PAD - 6} x2={p.x} y2={H - AXIS_PAD + 6} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} opacity={0.6} />
                <circle cx={p.x} cy={p.y} r={5} fill={primaryColor} stroke="white" strokeWidth={2.5} />
                {(i % dateStep === 0 || i === 0 || i === points.length - 1) && (
                  <text x={p.x} y={H - AXIS_PAD + 18} textAnchor="middle" className="text-[11px] font-medium fill-muted-foreground">
                    {new Date(p.dateISO + "T00:00:00Z").toLocaleDateString("en-GB", { month: "short", year: "2-digit" })}
                  </text>
                )}
                {/* amount labels */}
                {(() => {
                  const show = amountLabelSet.has(i)
                  if (!show) return null
                  const dy = p.amount > 0 ? -15 : 18
                  const jitter = i % 3 === 0 ? -6 : i % 3 === 1 ? 0 : 6
                  const yy = clampY(p.y + dy + jitter)
                  return (
                    <text
                      x={p.x}
                      y={yy}
                      textAnchor="middle"
                      className="text-[11px] font-semibold"
                      fill={p.amount > 0 ? "hsl(var(--chart-2))" : "hsl(var(--destructive))"}
                      pointerEvents="none"
                    >
                      {AED(p.amount)}
                    </text>
                  )
                })()}
              </g>
            ))}

            <rect x={PAD} y={H - AXIS_PAD - 2} width={(W - 2 * PAD) * 0.4} height={4} fill={primaryColor} opacity={0.3} rx={2} />
            <text x={PAD + 10} y={H - AXIS_PAD - 8} className="text-[10px] font-medium fill-primary">Investment Period Progress</text>
          </svg>
        </div>
      </div>

      {/* Schedule — responsive: table on md+, stacked cards on mobile */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-sm font-medium mb-3 sm:mb-4">Investment Milestones &amp; Cash Flow Schedule</h3>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-3">
          {calc.rows.map((r, i) => (
            <div key={i} className="rounded-xl border p-3 flex items-start justify-between gap-3">
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
              {calc.rows.map((r, i) => (
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
/** Numbers visually “flow out” using absolute positioning + overflow-visible */
function Kpi({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border p-3 sm:p-4 bg-background">
      <div className="text-xs uppercase tracking-wide opacity-70">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>

      {/* background number, now clipped to box */}
      {/* <div
        className={[
          "pointer-events-none select-none",
          "absolute -top-2 right-2",
          "text-4xl sm:text-5xl font-extrabold opacity-10 leading-none",
          accent ?? "text-foreground",
        ].join(" ")}
        aria-hidden
      >
        {value}
      </div> */}
    </div>
  )
}