"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const isValidPhone = (v: string) => {
  // Remove all spaces, dashes, and parentheses for validation
  const cleaned = v.replace(/[\s\-()]/g, "")
  // Allow any international format: optional +, country code (1-4 digits), then 7-15 digits total
  return /^\+?[1-9]\d{6,14}$/.test(cleaned)
}

interface InviteOnlyScreenProps {
  reason?: string
}

export default function InviteOnlyScreen({ reason }: InviteOnlyScreenProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim().length >= 2 && isValidPhone(phone)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/invite/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setDone(true)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background image matching main page */}
      <div className="absolute inset-0">
        <img
          src="/dubai-south-skyline-with-modern-architecture-and-a.png"
          alt="Dubai South Development"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <img src="/images/logo.png" alt="Mirfa" className="h-8 mx-auto mb-8" />
          <h1 className="text-2xl sm:text-3xl font-light text-white mb-3">Invitation Required</h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed font-light">
            This opportunity is currently invite-only. Ask someone to refer you or request an invite below.
          </p>
        </div>

        {reason && (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-3">
            <p className="text-sm text-red-200" role="alert">
              {reason}
            </p>
          </div>
        )}

        <Card className="bg-black/30 backdrop-blur-md border border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-white">Request an Invite</CardTitle>
            <CardDescription className="text-white/70 text-sm font-light">
              Share your details and we will get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {done ? (
              <div className="space-y-3">
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4">
                  <p className="text-green-200 font-light">
                    Thanks, {name.split(" ")[0]}! Your invite request has been received.
                  </p>
                  <p className="text-green-300/80 text-sm mt-1 font-light">
                    We will contact you on WhatsApp/phone shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-white/90 mb-2">Full Name</label>
                  <input
                    className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 text-white placeholder-white/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-white/90 mb-2">Phone (WhatsApp)</label>
                  <input
                    className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 text-white placeholder-white/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    placeholder="e.g. +1 555 123 4567 or +971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  {!isValidPhone(phone) && phone && (
                    <p className="text-xs text-red-300 mt-1">
                      Enter a valid international phone number (supports +, spaces, and dashes).
                    </p>
                  )}
                </div>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full border-white/30 text-white hover:bg-white hover:text-black transition-all bg-transparent font-light py-2.5"
                  variant="outline"
                >
                  {submitting ? "SUBMITTING…" : "REQUEST INVITE"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-white/60 text-xs text-center leading-relaxed font-light">
          Already have a code? Ask your referrer for a fresh link with{" "}
          <code className="bg-white/10 backdrop-blur-sm px-1 py-0.5 rounded text-white/80">invite_code=YOURCODE</code>.
        </p>
      </div>
    </div>
  )
}
