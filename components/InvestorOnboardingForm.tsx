"use client"
import { upload } from '@vercel/blob/client'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Upload, CheckCircle, Loader2 } from "lucide-react"
import { submitInvestorForm } from "@/app/actions/submit-investor-form"




export async function uploadToVercelBlob(file: File) {
    const put = await upload(file.name, file, {
      access: 'private',
      handleUploadUrl: '/api/kyc/upload', // calls the server route above
      // multipart: true, // optional
      // onUploadProgress: ({ uploaded, total }) => console.log(uploaded, total),
    })
    return { id: put.pathname, blobUrl: put.url }
  }
// Avoid name collision with global FormData
interface InvestorFormData {
  // Basic Info
  full_name: string
  email: string
  whatsapp: string
  address_line: string

  // Investment
  investment_amount: number
  residency_status: string

  // UAE Resident Branch
  eid_number: string
  eid_upload: File | null
  passport_upload_resident: File | null
  eid_upload_url: string
  passport_upload_resident_url: string

  // Non-Resident Branch
  nationality: string
  passport_number: string
  passport_issue_date: string
  passport_expiry_date: string
  passport_upload_nonresident: File | null
  passport_upload_nonresident_url: string
  nri_lrs_confirm: string

  // KYC & Source
  source_of_funds: string
  notes: string

  // Consents
  consent_contact: boolean
  consent_risk: boolean

  // Hidden UTM fields
  utm_source: string
  utm_medium: string
  utm_campaign: string
  referral_code: string
}

interface InvestorOnboardingFormProps {
  onClose: () => void
}

export default function InvestorOnboardingForm({ onClose }: InvestorOnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<InvestorFormData>({
    full_name: "",
    email: "",
    whatsapp: "",
    address_line: "",
    investment_amount: 50000,
    residency_status: "",

    eid_number: "",
    eid_upload: null,
    passport_upload_resident: null,
    eid_upload_url: "",
    passport_upload_resident_url: "",

    nationality: "",
    passport_number: "",
    passport_issue_date: "",
    passport_expiry_date: "",
    passport_upload_nonresident: null,
    passport_upload_nonresident_url: "",
    nri_lrs_confirm: "",

    source_of_funds: "",
    notes: "",

    consent_contact: false,
    consent_risk: false,

    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referral_code: "",
  })

  // Capture UTM parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setFormData((prev) => ({
      ...prev,
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      referral_code: urlParams.get("ref") || "",
    }))
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = "Full name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required"
      if (!formData.address_line.trim()) newErrors.address_line = "Address is required"
    }

    if (step === 2) {
      if (formData.investment_amount < 50000) newErrors.investment_amount = "Minimum investment is AED 50,000"
      if (formData.investment_amount % 50000 !== 0)
        newErrors.investment_amount = "Investment must be a multiple of AED 50,000"
      if (!formData.residency_status) newErrors.residency_status = "Residency status is required"
    }

    if (step === 3) {
      if (formData.residency_status === "UAE Resident") {
        if (!formData.eid_number.trim()) newErrors.eid_number = "Emirates ID number is required"
        if (!formData.eid_upload_url) newErrors.eid_upload = "Emirates ID upload is required"
        if (!formData.passport_upload_resident_url) newErrors.passport_upload_resident = "Passport upload is required"
      } else if (formData.residency_status === "Non-Resident") {
        if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required"
        if (!formData.passport_number.trim()) newErrors.passport_number = "Passport number is required"
        if (!formData.passport_issue_date) newErrors.passport_issue_date = "Passport issue date is required"
        if (!formData.passport_expiry_date) newErrors.passport_expiry_date = "Passport expiry date is required"
        if (!formData.passport_upload_nonresident_url)
          newErrors.passport_upload_nonresident = "Passport upload is required"
      }
    }

    if (step === 4) {
      if (!formData.source_of_funds) newErrors.source_of_funds = "Source of funds is required"
      if (!formData.consent_contact) newErrors.consent_contact = "Contact consent is required"
      if (!formData.consent_risk) newErrors.consent_risk = "Risk acknowledgment is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleInputChange = (field: keyof InvestorFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as string]) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n[field as string]
        return n
      })
    }
  }

  // --- specialized file-onChange handlers: upload immediately to Blob and store URL ---
  const handleBlobUpload = async (
    targetFieldUrl: keyof InvestorFormData,
    targetFileField: keyof InvestorFormData,
    file: File | null,
    errorKey: string
  ) => {
    if (!file) return
    try {
      const { blobUrl } = await uploadToVercelBlob(file)
      setFormData((prev) => ({
        ...prev,
        [targetFieldUrl]: blobUrl as any,
        [targetFileField]: null as any,
      }))
      if (errors[errorKey]) {
        setErrors((prev) => {
          const n = { ...prev }
          delete n[errorKey]
          return n
        })
      }
    } catch {
      setErrors((prev) => ({ ...prev, [errorKey]: "Upload failed. Please try again." }))
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    setIsSubmitting(true)

    try {
      const fd = new FormData()

      // Add all scalar fields and URLs (File fields are null by design)
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) return // skip raw files
        if (typeof value === "boolean") fd.append(key, value.toString())
        else if (value !== null && value !== undefined) fd.append(key, String(value))
      })

      const result = await submitInvestorForm(fd)
      if (result.success) {
        setIsSubmitted(true)
      } else {
        throw new Error(result.error || "Submission failed")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "Submission failed. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl my-8 bg-white dark:bg-neutral-900 border shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Application Received</CardTitle>
            <CardDescription>
              We'll review KYC and contact you on WhatsApp/Email with next steps. If approved, you'll receive DocuSign
              and escrow instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = "https://invest.mirfa.com/dubai-south")}>
              Return to Site
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl my-8 bg-white dark:bg-neutral-900 border shadow-2xl">
        <CardHeader className="bg-muted/30 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">G6 Dubai South Investor Application</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-muted">
              ✕
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="text-sm text-muted-foreground">Step {currentStep} of 4</div>
            <div className="flex-1 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-background">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>

              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  className={errors.full_name ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.full_name && <p className="text-sm text-red-500 mt-1">{errors.full_name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="whatsapp">WhatsApp Number (with country code) *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                  className={errors.whatsapp ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.whatsapp && <p className="text-sm text-red-500 mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <Label htmlFor="address_line">Address (Line, City, Country) *</Label>
                <Textarea
                  id="address_line"
                  value={formData.address_line}
                  onChange={(e) => handleInputChange("address_line", e.target.value)}
                  className={errors.address_line ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.address_line && <p className="text-sm text-red-500 mt-1">{errors.address_line}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Investment Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Investment Details</h3>

              <div>
                <Label htmlFor="investment_amount">Investment Amount (AED) *</Label>
                <Input
                  id="investment_amount"
                  type="number"
                  min="50000"
                  step="50000"
                  value={formData.investment_amount}
                  onChange={(e) => handleInputChange("investment_amount", Number.parseInt(e.target.value) || 0)}
                  className={errors.investment_amount ? "border-red-500 focus:border-red-500" : ""}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Fixed ticket is AED 50,000. If you wish to invest more, enter a multiple of 50,000.
                </p>
                {errors.investment_amount && <p className="text-sm text-red-500 mt-1">{errors.investment_amount}</p>}
              </div>

              <div>
                <Label>Residency Status *</Label>
                <RadioGroup
                  value={formData.residency_status}
                  onValueChange={(value) => handleInputChange("residency_status", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="UAE Resident" id="uae-resident" />
                    <Label htmlFor="uae-resident">UAE Resident</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Non-Resident" id="non-resident" />
                    <Label htmlFor="non-resident">Non-Resident</Label>
                  </div>
                </RadioGroup>
                {errors.residency_status && <p className="text-sm text-red-500 mt-1">{errors.residency_status}</p>}
              </div>
            </div>
          )}

          {/* Step 3: KYC Documents */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">KYC Documents</h3>

              {formData.residency_status === "UAE Resident" && (
                <>
                  <div>
                    <Label htmlFor="eid_number">Emirates ID Number *</Label>
                    <Input
                      id="eid_number"
                      placeholder="784-1234-1234567-1"
                      value={formData.eid_number}
                      onChange={(e) => handleInputChange("eid_number", e.target.value)}
                      className={errors.eid_number ? "border-red-500 focus:border-red-500" : ""}
                    />
                    <p className="text-sm text-muted-foreground mt-1">Emirates ID number (digits and dashes).</p>
                    {errors.eid_number && <p className="text-sm text-red-500 mt-1">{errors.eid_number}</p>}
                  </div>

                  <div>
                    <Label htmlFor="eid_upload">Emirates ID Upload (Front & Back) *</Label>
                    <div className="mt-2">
                      <input
                        id="eid_upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={async (e) =>
                          handleBlobUpload("eid_upload_url", "eid_upload", e.target.files?.[0] || null, "eid_upload")
                        }
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("eid_upload")?.click()}
                        className={`w-full ${errors.eid_upload ? "border-red-500" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.eid_upload_url ? "Uploaded ✓" : "Upload Emirates ID"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Emirates ID (front & back).</p>
                    {errors.eid_upload && <p className="text-sm text-red-500 mt-1">{errors.eid_upload}</p>}
                  </div>

                  <div>
                    <Label htmlFor="passport_upload_resident">Passport Upload *</Label>
                    <div className="mt-2">
                      <input
                        id="passport_upload_resident"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={async (e) =>
                          handleBlobUpload(
                            "passport_upload_resident_url",
                            "passport_upload_resident",
                            e.target.files?.[0] || null,
                            "passport_upload_resident"
                          )
                        }
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("passport_upload_resident")?.click()}
                        className={`w-full ${errors.passport_upload_resident ? "border-red-500" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.passport_upload_resident_url ? "Uploaded ✓" : "Upload Passport"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Passport photo page.</p>
                    {errors.passport_upload_resident && (
                      <p className="text-sm text-red-500 mt-1">{errors.passport_upload_resident}</p>
                    )}
                  </div>
                </>
              )}

              {formData.residency_status === "Non-Resident" && (
                <>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className={errors.nationality ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {errors.nationality && <p className="text-sm text-red-500 mt-1">{errors.nationality}</p>}
                  </div>

                  <div>
                    <Label htmlFor="passport_number">Passport Number *</Label>
                    <Input
                      id="passport_number"
                      value={formData.passport_number}
                      onChange={(e) => handleInputChange("passport_number", e.target.value)}
                      className={errors.passport_number ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {errors.passport_number && <p className="text-sm text-red-500 mt-1">{errors.passport_number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passport_issue_date">Passport Issue Date *</Label>
                      <Input
                        id="passport_issue_date"
                        type="date"
                        value={formData.passport_issue_date}
                        onChange={(e) => handleInputChange("passport_issue_date", e.target.value)}
                        className={errors.passport_issue_date ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {errors.passport_issue_date && (
                        <p className="text-sm text-red-500 mt-1">{errors.passport_issue_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passport_expiry_date">Passport Expiry Date *</Label>
                      <Input
                        id="passport_expiry_date"
                        type="date"
                        value={formData.passport_expiry_date}
                        onChange={(e) => handleInputChange("passport_expiry_date", e.target.value)}
                        className={errors.passport_expiry_date ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {errors.passport_expiry_date && (
                        <p className="text-sm text-red-500 mt-1">{errors.passport_expiry_date}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="passport_upload_nonresident">Passport Upload *</Label>
                    <div className="mt-2">
                      <input
                        id="passport_upload_nonresident"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={async (e) =>
                          handleBlobUpload(
                            "passport_upload_nonresident_url",
                            "passport_upload_nonresident",
                            e.target.files?.[0] || null,
                            "passport_upload_nonresident"
                          )
                        }
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("passport_upload_nonresident")?.click()}
                        className={`w-full ${errors.passport_upload_nonresident ? "border-red-500" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.passport_upload_nonresident_url ? "Uploaded ✓" : "Upload Passport"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Passport photo page.</p>
                    {errors.passport_upload_nonresident && (
                      <p className="text-sm text-red-500 mt-1">{errors.passport_upload_nonresident}</p>
                    )}
                  </div>

                  <div>
                    <Label>NRI LRS Confirmation (Optional)</Label>
                    <RadioGroup
                      value={formData.nri_lrs_confirm}
                      onValueChange={(value) => handleInputChange("nri_lrs_confirm", value)}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="lrs-yes" />
                        <Label htmlFor="lrs-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="lrs-no" />
                        <Label htmlFor="lrs-no">No</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you are an NRI investing under LRS, confirm you will comply with LRS/FEMA.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4: Final Details & Consents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Source of Funds & Consents</h3>

              <div>
                <Label htmlFor="source_of_funds">Source of Funds *</Label>
                <Select
                  value={formData.source_of_funds}
                  onValueChange={(value) => handleInputChange("source_of_funds", value)}
                >
                  <SelectTrigger className={errors.source_of_funds ? "border-red-500 focus:border-red-500" : ""}>
                    <SelectValue placeholder="Select source of funds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Business Income">Business Income</SelectItem>
                    <SelectItem value="Investment Income">Investment Income</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.source_of_funds && <p className="text-sm text-red-500 mt-1">{errors.source_of_funds}</p>}
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Anything you'd like us to know?"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent_contact"
                    checked={formData.consent_contact}
                    onCheckedChange={(checked) => handleInputChange("consent_contact", checked as boolean)}
                  />
                  <Label htmlFor="consent_contact" className="text-sm leading-relaxed">
                    I agree to be contacted via WhatsApp/Email for onboarding and updates. *
                  </Label>
                </div>
                {errors.consent_contact && <p className="text-sm text-red-500">{errors.consent_contact}</p>}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consent_risk"
                    checked={formData.consent_risk}
                    onCheckedChange={(checked) => handleInputChange("consent_risk", checked as boolean)}
                  />
                  <Label htmlFor="consent_risk" className="text-sm leading-relaxed">
                    I understand capital is at risk, returns are not guaranteed, and participation is subject to
                    eligibility, KYC/AML, and jurisdictional checks. *
                  </Label>
                </div>
                {errors.consent_risk && <p className="text-sm text-red-500">{errors.consent_risk}</p>}
              </div>

              {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t bg-muted/20 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <div className="ml-auto">
              {currentStep < 4 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
