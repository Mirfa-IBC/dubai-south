"use client"

import * as React from "react"
import { useRef } from "react"
import { z } from "zod"
import { useForm, Controller, useController } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Upload, CheckCircle } from "lucide-react"

import { upload } from "@vercel/blob/client"
import { submitInvestorForm } from "@/app/actions/submit-investor-form"

/* -------------------- Upload helper (Vercel Blob + server route) -------------------- */
// async function uploadToVercelBlob(file: File) {
//   const put = await upload(file.name, file, {
//     access: "public",
//     handleUploadUrl: "/api/kyc/upload",
//   })
//   return { id: put.pathname, blobUrl: put.url }
// }

export async function uploadToVercelBlob(file: File) {
  // --- Light client-side checks (server still validates) ---
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
  const MAX_BYTES = 15 * 1024 * 1024 // 15MB
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`Only JPEG/PNG/WEBP/PDF allowed.`)
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`File must be ≤ 15MB.`)
  }

  // Convert to data URL (base64) for your API
  const toBase64DataUrl = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(f) // e.g. "data:image/jpeg;base64,AAA..."
    })

  const fileData = await toBase64DataUrl(file)

  const res = await fetch("/api/kyc/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileData,          // data URL with base64
      fileType: file.type,
      fileSize: file.size,
    }),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(json?.error || json?.message || "Upload failed")
  }

  // Normalize your API's shape
  // success: true, data: { path, publicUrl?, signedUrl? ... }
  const id = json?.data?.path || json?.data?.fullPath || json?.data?.id
  const blobUrl = json?.data?.signedUrl || json?.data?.publicUrl

  if (!blobUrl) throw new Error("Upload failed: no URL returned")
  return { id, blobUrl }
}
/* -------------------- Validation -------------------- */
const phoneRegex = /^\+?\d[\d\s\-()]{6,18}\d$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emiratesIdRegex = /^(784-\d{4}-\d{7}-\d{1}|784\d{12})$/
const passportRegex = /^[A-Za-z0-9]{6,12}$/

// Investment rule: minimum 50k; after that, increments of 25k.
// Valid values: 50,000; 75,000; 100,000; 125,000; ...
const investmentRule = (n: number) => n >= 50000 && ((n === 50000) || ((n - 50000) % 25000 === 0))

const baseSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().regex(emailRegex, "Enter a valid email"),
  whatsapp: z.string().trim().regex(phoneRegex, "Enter a valid phone with country code"),
  address_line: z.string().trim().min(5, "Address is required"),

  investment_amount: z
    .number({ invalid_type_error: "Investment amount is required" })
    .refine(investmentRule, "Minimum is AED 50,000; then add in AED 25,000 steps (50k, 75k, 100k, ...)"),

  residency_status: z.enum(["resident", "non_resident"], { required_error: "Residency status is required" }),

  // Resident
  eid_number: z.string().trim().optional(),
  eid_upload_url: z.string().url().optional(),
  passport_upload_resident_url: z.string().url().optional(),

  // Non-resident
  nationality: z.string().trim().optional(),
  passport_number: z.string().trim().optional(),
  passport_issue_date: z.string().optional(),   // yyyy-mm-dd
  passport_expiry_date: z.string().optional(),  // yyyy-mm-dd
  passport_upload_nonresident_url: z.string().url().optional(),
  nri_lrs_confirm: z.enum(["yes", "no"]).optional(),

  // Step 4
  source_of_funds: z.string().trim().min(1, "Source of funds is required"),
  notes: z.string().trim().optional(),
  consent_contact: z.coerce.boolean().refine((v) => v, "Contact consent is required"),
  consent_risk: z.coerce.boolean().refine((v) => v, "Risk acknowledgment is required"),

  // UTM / referral
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  referral_code: z.string().optional(),
})

const schema = baseSchema.superRefine((data, ctx) => {
  if (data.residency_status === "resident") {
    if (!data.eid_number || !emiratesIdRegex.test(data.eid_number.replace(/\s/g, ""))) {
      ctx.addIssue({ path: ["eid_number"], code: z.ZodIssueCode.custom, message: "Enter a valid Emirates ID (e.g., 784-XXXX-XXXXXXX-X)" })
    }
    if (!data.eid_upload_url) {
      ctx.addIssue({ path: ["eid_upload_url"], code: z.ZodIssueCode.custom, message: "Emirates ID upload is required" })
    }
    if (!data.passport_upload_resident_url) {
      ctx.addIssue({ path: ["passport_upload_resident_url"], code: z.ZodIssueCode.custom, message: "Passport upload is required" })
    }
  }

  if (data.residency_status === "non_resident") {
    if (!data.nationality) {
      ctx.addIssue({ path: ["nationality"], code: z.ZodIssueCode.custom, message: "Nationality is required" })
    }
    if (!data.passport_number || !passportRegex.test(data.passport_number)) {
      ctx.addIssue({ path: ["passport_number"], code: z.ZodIssueCode.custom, message: "Enter a valid passport number" })
    }
    if (!data.passport_issue_date) {
      ctx.addIssue({ path: ["passport_issue_date"], code: z.ZodIssueCode.custom, message: "Issue date is required" })
    }
    if (!data.passport_expiry_date) {
      ctx.addIssue({ path: ["passport_expiry_date"], code: z.ZodIssueCode.custom, message: "Expiry date is required" })
    }
    if (data.passport_issue_date && data.passport_expiry_date) {
      const issue = new Date(data.passport_issue_date + "T00:00:00")
      const exp = new Date(data.passport_expiry_date + "T00:00:00")
      if (exp <= issue) {
        ctx.addIssue({ path: ["passport_expiry_date"], code: z.ZodIssueCode.custom, message: "Expiry must be after issue date" })
      }
      if (exp <= new Date()) {
        ctx.addIssue({ path: ["passport_expiry_date"], code: z.ZodIssueCode.custom, message: "Expiry must be in the future" })
      }
    }
    if (!data.passport_upload_nonresident_url) {
      ctx.addIssue({ path: ["passport_upload_nonresident_url"], code: z.ZodIssueCode.custom, message: "Passport upload is required" })
    }
  }
})

/* -------------------- Small UI utilities -------------------- */
function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={[
            "h-2 rounded-full transition-all",
            i < step ? "bg-blue-600 w-6" : "bg-gray-300 dark:bg-gray-700 w-2",
          ].join(" ")}
        />
      ))}
    </div>
  )
}

function ErrorText({ children }: React.PropsWithChildren) {
  if (!children) return null
  return <p className="text-sm text-red-500 mt-1 font-medium">{children}</p>
}

/* -------------------- Upload field (RHF + Shadcn, with state) -------------------- */
type UploadFieldProps<T> = {
  control: any
  name: keyof T & string
  label: string
  note?: string
  accept?: string
  error?: string
}
function UploadFieldRHF<T>({
  control,
  name,
  label,
  note = "PNG/JPG/PDF up to 15 MB.",
  accept = "image/*,.pdf",
  error,
}: UploadFieldProps<T>) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { field } = useController({ name, control })
  const [uploading, setUploading] = React.useState(false)
  const [localErr, setLocalErr] = React.useState<string | null>(null)

  const currentUrl: string = (field.value as string) || ""

  const openPicker = () => inputRef.current?.click()

  const onFile = async (file?: File | null) => {
    if (!file) return
    setUploading(true)
    setLocalErr(null)
    try {
      const { blobUrl } = await uploadToVercelBlob(file)
      field.onChange(blobUrl) // keep RHF state as URL
    } catch (e: any) {
      setLocalErr(e?.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const remove = () => field.onChange("")

  const fileName = React.useMemo(() => {
    if (!currentUrl) return ""
    try {
      const clean = currentUrl.split("?")[0]
      return decodeURIComponent(clean.split("/").pop() || "")
    } catch {
      return ""
    }
  }, [currentUrl])

  return (
    <div>
      <Label className="text-sm font-semibold">{label}</Label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />

      <div className="mt-2 space-y-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={openPicker}
          className={[
            "w-full h-12",
            currentUrl
              ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:border-green-700 dark:text-green-400"
              : "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {currentUrl ? "✓ File Uploaded (Replace)" : "Upload File"}
            </>
          )}
        </Button>

        {currentUrl && (
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              onClick={() => window.open(currentUrl, "_blank")}
            >
              View / Download
            </Button>
            <div className="text-xs text-muted-foreground truncate">{fileName || "Uploaded file"}</div>
            <button
              type="button"
              onClick={remove}
              className="text-xs text-red-600 hover:underline shrink-0"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <p className="text-[12px] text-muted-foreground mt-1">{note}</p>
      {(error || localErr) && <p className="text-sm text-red-500 mt-1 font-medium">{error || localErr}</p>}
    </div>
  )
}

/* -------------------- Main Component -------------------- */
type FormValues = z.infer<typeof schema>

export default function InvestorOnboardingForm({ onClose = () => {} }: { onClose?: () => void }) {
  const [step, setStep] = React.useState(1)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      full_name: "",
      email: "",
      whatsapp: "",
      address_line: "",
      investment_amount: 50000,
      residency_status: undefined as any,
      source_of_funds: "",
      consent_contact: false,
      consent_risk: false,
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      referral_code: "",
    },
  })

  // Capture UTM + referral on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const p = new URLSearchParams(window.location.search)
    setValue("utm_source", p.get("utm_source") || "")
    setValue("utm_medium", p.get("utm_medium") || "")
    setValue("utm_campaign", p.get("utm_campaign") || "")
    setValue("referral_code", p.get("ref") || "")
  }, [setValue])

  const residency = watch("residency_status")
  const fromSession = sessionStorage.getItem("mirfa_invite_code") || ""
  if (fromSession) setValue("referral_code", fromSession)

  const goNext = async () => {
    const fieldsByStep: Record<number, (keyof FormValues)[]> = {
      1: ["full_name", "email", "whatsapp", "address_line"],
      2: ["investment_amount", "residency_status"],
      3:
        residency === "resident"
          ? ["eid_number", "eid_upload_url", "passport_upload_resident_url"]
          : ["nationality", "passport_number", "passport_issue_date", "passport_expiry_date", "passport_upload_nonresident_url"],
      4: ["source_of_funds", "consent_contact", "consent_risk"],
    }
    const ok = await trigger(fieldsByStep[step], { shouldFocus: true })
    if (!ok) return
    setStep((s) => Math.min(4, s + 1))
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1))
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Emirates ID pretty-format on blur
  const formatEID = (v: string) => {
    const digits = v.replace(/\D/g, "")
    if (digits.length !== 15 || !digits.startsWith("784")) return v
    return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7,14)}-${digits.slice(14)}`
  }

  // ---- SUBMIT (server action) ----
  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const fd = new FormData()

      // Append all scalar values (booleans -> strings). We only store blob URLs for files.
      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined) return

        // For dates, skip empty strings to allow server to coerce nulls
        if (
          (key === "passport_issue_date" || key === "passport_expiry_date") &&
          value === ""
        ) return

        if (typeof value === "boolean") fd.append(key, value ? "true" : "false")
        else fd.append(key, String(value))
      })

      const result = await submitInvestorForm(fd)
      if (result?.success) {
        setSubmitted(true)
      } else {
        throw new Error(result?.error || "Submission failed")
      }
    } catch (e) {
      console.error("Form submission error:", e)
      // Surface a generic error under the footer
      alert("Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl my-8 bg-white dark:bg-neutral-900 border shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Application Received</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              We'll review your KYC and contact you via WhatsApp/Email with next steps. If approved, you'll receive
              DocuSign and escrow instructions.
            </p>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/")}>
              Return to Site
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    // Overlay
    <div className="fixed inset-0 z-50 bg-black/70 sm:bg-black/80 backdrop-blur-sm sm:flex sm:items-center sm:justify-center p-0 sm:p-4">
      {/* Mobile sheet / desktop card */}
      <Card className="w-full sm:max-w-2xl sm:my-8 rounded-t-2xl sm:rounded-2xl h-[92vh] sm:h-auto overflow-hidden bg-white dark:bg-neutral-900 border shadow-2xl fixed bottom-0 sm:relative flex flex-col">
        {/* Header */}
        <CardHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-2xl font-bold">G6 Dubai South Investor Application</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="w-8 h-8 p-0 rounded-full">✕</Button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="text-xs sm:text-sm text-muted-foreground">Step {step} of 4</div>
            <StepDots step={step} total={4} />
          </div>
        </CardHeader>

        {/* Scrollable Content */}
        <CardContent ref={scrollRef} data-form-scroll className="flex-1 overflow-y-auto p-4 sm:p-8 bg-background">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">Basic Information</h3>

              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" {...register("full_name")} placeholder="Enter your full legal name" className="mt-2" />
                <ErrorText>{errors.full_name?.message}</ErrorText>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" inputMode="email" autoComplete="email" {...register("email")} placeholder="your.email@example.com" className="mt-2" />
                <ErrorText>{errors.email?.message}</ErrorText>
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp (with country code) *</Label>
                <Input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="+971 50 123 4567" {...register("whatsapp")} className="mt-2 text-base" />
                <ErrorText>{errors.whatsapp?.message}</ErrorText>
              </div>

              <div>
                <Label htmlFor="address_line">Address (Line, City, Country) *</Label>
                <Textarea id="address_line" rows={3} {...register("address_line")} placeholder="Full address including city and country" className="mt-2" />
                <ErrorText>{errors.address_line?.message}</ErrorText>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">Investment Details</h3>

              <div>
                <Label htmlFor="investment_amount">Investment Amount (AED) *</Label>
                <Controller
                  control={control}
                  name="investment_amount"
                  render={({ field }) => (
                    <Input
                      id="investment_amount"
                      type="number"
                      inputMode="numeric"
                      min={50000}
                      step={25000}
                      value={field.value}
                      onChange={(e) => {
                        const raw = e.target.value
                        const num = Number(raw.replace(/[^\d]/g, "")) || 0
                        field.onChange(num)
                      }}
                      className="mt-2 text-base"
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum AED 50,000. After that, add in AED 25,000 steps (e.g., 50k, 75k, 100k…).
                </p>
                <ErrorText>{errors.investment_amount?.message}</ErrorText>
              </div>

              <div>
                <Label>Residency Status *</Label>
                <Controller
                  control={control}
                  name="residency_status"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-3">
                      <div className="flex items-center gap-3 p-4 border rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <RadioGroupItem value="resident" id="uae-resident" className="border-2" />
                        <Label htmlFor="uae-resident" className="cursor-pointer flex-1">UAE Resident</Label>
                      </div>
                      <div className="flex items-center gap-3 p-4 border rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <RadioGroupItem value="non_resident" id="non-resident" className="border-2" />
                        <Label htmlFor="non-resident" className="cursor-pointer flex-1">Non-Resident</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                <ErrorText>{errors.residency_status?.message}</ErrorText>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">KYC Documents</h3>

              {residency === "resident" && (
                <>
                  <div>
                    <Label htmlFor="eid_number">Emirates ID Number *</Label>
                    <Input
                      id="eid_number"
                      placeholder="784-1234-1234567-1"
                      {...register("eid_number")}
                      onBlur={(e) => (e.target.value = formatEID(e.target.value))}
                      className="mt-2"
                    />
                    <p className="text-[12px] text-muted-foreground mt-1">Format: 784-XXXX-XXXXXXX-X or 15 digits</p>
                    <ErrorText>{errors.eid_number?.message}</ErrorText>
                  </div>

                  <UploadFieldRHF<FormValues>
                    control={control}
                    name="eid_upload_url"
                    label="Emirates ID Upload (Front & Back) *"
                    error={(errors as any)?.eid_upload_url?.message}
                  />

                  <UploadFieldRHF<FormValues>
                    control={control}
                    name="passport_upload_resident_url"
                    label="Passport Upload *"
                    error={(errors as any)?.passport_upload_resident_url?.message}
                  />
                </>
              )}

              {residency === "non_resident" && (
                <>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input id="nationality" {...register("nationality")} className="mt-2" />
                    <ErrorText>{errors.nationality?.message}</ErrorText>
                  </div>

                  <div>
                    <Label htmlFor="passport_number">Passport Number *</Label>
                    <Input id="passport_number" {...register("passport_number")} placeholder="e.g., N1234567" className="mt-2" />
                    <ErrorText>{errors.passport_number?.message}</ErrorText>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="passport_issue_date">Issue Date *</Label>
                      <Input id="passport_issue_date" type="date" {...register("passport_issue_date")} className="mt-2" />
                      <ErrorText>{errors.passport_issue_date?.message}</ErrorText>
                    </div>
                    <div>
                      <Label htmlFor="passport_expiry_date">Expiry Date *</Label>
                      <Input id="passport_expiry_date" type="date" {...register("passport_expiry_date")} className="mt-2" />
                      <ErrorText>{errors.passport_expiry_date?.message}</ErrorText>
                    </div>
                  </div>

                  <UploadFieldRHF<FormValues>
                    control={control}
                    name="passport_upload_nonresident_url"
                    label="Passport Upload *"
                    error={(errors as any)?.passport_upload_nonresident_url?.message}
                  />

                  <div>
                    <Label>NRI LRS Confirmation (Optional)</Label>
                    <Controller
                      control={control}
                      name="nri_lrs_confirm"
                      render={({ field }) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="mt-2">
                          <div className="flex items-center gap-3 p-3 border rounded-xl">
                            <RadioGroupItem value="yes" id="lrs-yes" />
                            <Label htmlFor="lrs-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center gap-3 p-3 border rounded-xl">
                            <RadioGroupItem value="no" id="lrs-no" />
                            <Label htmlFor="lrs-no" className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                Source of Funds & Consents
              </h3>

              <div>
                <Label htmlFor="source_of_funds">Source of Funds *</Label>
                <Controller
                  control={control}
                  name="source_of_funds"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select source of funds" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white dark:bg-neutral-900 border shadow-lg z-[60]"
                        position="popper"
                        sideOffset={4}
                      >
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Business Income">Business Income</SelectItem>
                        <SelectItem value="Investment Income">Investment Income</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorText>{errors.source_of_funds?.message}</ErrorText>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea id="notes" rows={3} {...register("notes")} placeholder="Anything you'd like us to know?" className="mt-2" />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name="consent_contact"
                    render={({ field }) => (
                      <Checkbox
                        id="consent_contact"
                        checked={field.value || false}
                        onCheckedChange={(val) => field.onChange(!!val)}
                      />
                    )}
                  />
                  <Label htmlFor="consent_contact" className="text-sm leading-relaxed">
                    I agree to be contacted via WhatsApp/Email for onboarding and updates. *
                  </Label>
                </div>
                <ErrorText>{errors.consent_contact?.message}</ErrorText>

                <div className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name="consent_risk"
                    render={({ field }) => (
                      <Checkbox
                        id="consent_risk"
                        checked={field.value || false}
                        onCheckedChange={(val) => field.onChange(!!val)}
                      />
                    )}
                  />
                  <Label htmlFor="consent_risk" className="text-sm leading-relaxed">
                    I understand capital is at risk, returns are not guaranteed, and participation is subject to
                    KYC/AML and jurisdictional checks. *
                  </Label>
                </div>
                <ErrorText>{errors.consent_risk?.message}</ErrorText>
              </div>
            </div>
          )}
        </CardContent>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t px-4 py-3 sm:px-6 sm:py-4 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <div className="flex justify-between">
            {step > 1 ? <Button variant="outline" onClick={goBack}>Back</Button> : <span />}
            {step < 4 ? (
              <Button onClick={goNext} variant="outline">Next</Button>
            ) : (
              <Button onClick={handleSubmit(onSubmit)} variant="outline" disabled={submitting}>
                {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>) : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
