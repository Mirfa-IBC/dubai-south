"use server"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration. Please set up Supabase integration in Project Settings.")
}

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null

/* ---------- helpers ---------- */
const s = (fd: FormData, k: string): string | null => {
  const v = fd.get(k)
  if (v == null) return null
  const t = String(v).trim()
  return t === "" ? null : t
}
const n = (fd: FormData, k: string): number | null => {
  const v = s(fd, k)
  if (v == null) return null
  const num = Number(v)
  return Number.isFinite(num) ? num : null
}
const b = (fd: FormData, k: string): boolean | null => {
  const v = s(fd, k)?.toLowerCase()
  if (v == null) return null
  if (["true", "on", "1", "yes"].includes(v)) return true
  if (["false", "off", "0", "no"].includes(v)) return false
  return null
}
const d = (fd: FormData, k: string): string | null => {
  const v = s(fd, k)
  if (!v) return null
  // Expect HTML date input (YYYY-MM-DD)
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null
}

/* ---------- main action ---------- */
export async function submitInvestorForm(formData: FormData) {
  try {
    if (!supabase) {
      console.error("Supabase not configured - missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
      return {
        success: false,
        error: "Database not configured. Please contact support.",
      }
    }

    // Canonical residency
    const residency = s(formData, "residency_status")
    // if (residency === "UAE Resident") residency = "resident"
    // if (residency === "Non-Resident") residency = "non_resident"

    const row = {
      // Basic
      full_name: s(formData, "full_name"),
      email: s(formData, "email"),
      whatsapp: s(formData, "whatsapp"),
      address_line: s(formData, "address_line"),

      // Investment
      investment_amount: n(formData, "investment_amount"),
      residency_status: residency,

      // Resident branch
      eid_number: s(formData, "eid_number"),
      eid_upload_url: s(formData, "eid_upload_url"),
      passport_upload_resident_url: s(formData, "passport_upload_resident_url"),

      // Non-resident branch
      nationality: s(formData, "nationality"),
      passport_number: s(formData, "passport_number"),
      passport_issue_date: d(formData, "passport_issue_date"),
      passport_expiry_date: d(formData, "passport_expiry_date"),
      passport_upload_nonresident_url: s(formData, "passport_upload_nonresident_url"),
      nri_lrs_confirm: (s(formData, "nri_lrs_confirm") ?? "")?.toLowerCase() || null, // "yes"|"no"|null

      // KYC & Source
      source_of_funds: s(formData, "source_of_funds"),
      notes: s(formData, "notes"),

      // Consents (must be true)
      consent_contact: b(formData, "consent_contact") ?? false,
      consent_risk: b(formData, "consent_risk") ?? false,

      // UTM
      utm_source: s(formData, "utm_source"),
      utm_medium: s(formData, "utm_medium"),
      utm_campaign: s(formData, "utm_campaign"),
      referral_code: s(formData, "referral_code"),

      submitted_at: new Date().toISOString(),
    }

    /* ---------- server-side validation (defense-in-depth) ---------- */
    const errs: string[] = []

    if (!row.full_name) errs.push("full_name is required")
    if (!row.email) errs.push("email is required")
    if (row.investment_amount == null || row.investment_amount < 50000 || row.investment_amount % 50000 !== 0) {
      errs.push("investment_amount must be a multiple of 50,000 and ≥ 50,000")
    }
    if (row.residency_status !== "resident" && row.residency_status !== "non_resident") {
      errs.push("residency_status must be 'resident' or 'non_resident'")
    }
    if (!row.source_of_funds) errs.push("source_of_funds is required")
    if (row.consent_contact !== true) errs.push("consent_contact must be accepted")
    if (row.consent_risk !== true) errs.push("consent_risk must be accepted")

    if (row.residency_status === "resident") {
      if (!row.eid_number) errs.push("eid_number required for resident")
      if (!row.eid_upload_url && !row.passport_upload_resident_url) {
        errs.push("Provide eid_upload_url or passport_upload_resident_url for resident")
      }
      // null-out non-resident fields to keep data clean
      row.nationality = null
      row.passport_number = null
      row.passport_issue_date = null
      row.passport_expiry_date = null
      row.passport_upload_nonresident_url = null
      row.nri_lrs_confirm = null
    }

    if (row.residency_status === "non_resident") {
      if (!row.nationality) errs.push("nationality required for non_resident")
      if (!row.passport_number) errs.push("passport_number required for non_resident")
      if (!row.passport_issue_date) errs.push("passport_issue_date required (YYYY-MM-DD)")
      if (!row.passport_expiry_date) errs.push("passport_expiry_date required (YYYY-MM-DD)")
      if (!row.passport_upload_nonresident_url) errs.push("passport_upload_nonresident_url required for non_resident")
      // null-out resident-only doc URLs if not used
      if (!row.eid_upload_url) row.eid_upload_url = null
      if (!row.passport_upload_resident_url) row.passport_upload_resident_url = null
      row.eid_number = row.eid_number || null
    }

    if (errs.length) {
      return { success: false, error: "Validation failed", details: errs }
    }

    /* ---------- insert ---------- */
    const { data: inserted, error } = await supabase.from("investor_submissions").insert(row).select("id").single()

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: "Could not save your submission." }
    }

    return { success: true, id: inserted.id }
  } catch (error) {
    console.error("Form submission error:", error)
    return { success: false, error: "Submission failed. Please try again." }
  }
}
