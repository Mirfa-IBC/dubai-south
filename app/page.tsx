// app/page.tsx
import { Suspense } from "react"
import { headers } from "next/headers"
import DubaiInvestmentLanding from "@/components/DubaiInvestmentLanding"
import InviteOnlyScreen from "@/components/InviteOnlyScreen"

// Build the current origin from request headers (for server-side fetch)
function currentOrigin() {
  const h = headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000"
  return `${proto}://${host}`
}

async function validateInviteCode(code: string): Promise<{ valid: boolean; message?: string }> {
  try {
    // If we're on the server, use absolute URL. If somehow executed in the browser, let it stay relative.
    const base =
      typeof window === "undefined"
        ? currentOrigin()
        : "" // browser: relative is fine

    const url = new URL(`/api/invite/validate?code=${encodeURIComponent(code)}`, base || undefined).toString()

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      return { valid: false, message: txt || `Validation failed (${res.status})` }
    }

    const data = await res.json().catch(() => ({}))
    return { valid: !!data?.valid, message: data?.message }
  } catch (e: any) {
    return { valid: false, message: e?.message || "Network error during validation." }
  }
}

// Reading headers makes the page dynamic anyway
export const dynamic = "force-dynamic"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ invite_code?: string }>
}) {
  const { invite_code } = await searchParams
  const inviteCode = invite_code?.trim()

  if (!inviteCode) {
    return <InviteOnlyScreen reason="Missing invite code in the link." />
  }

  const validation = await validateInviteCode(inviteCode)

  if (!validation.valid) {
    return <InviteOnlyScreen reason={validation.message || "Invalid or expired invite code."} />
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DubaiInvestmentLanding inviteCode={inviteCode} />
    </Suspense>
  )
}
