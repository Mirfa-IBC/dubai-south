"use client"
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

export async function uploadToVercelBlob(file) {
  console.log("in uploadToVercelBlob");
  
  // Convert file to base64
  const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
      })
  }
  
  const fileData = await fileToBase64(file)
  
  const response = await fetch('/api/kyc/upload', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          fileName: file.name,
          fileData: fileData, // base64 string
          fileType: file.type,
          fileSize: file.size
      })
  })
  
  const result = await response.json()
  
  if (!response.ok) {
      throw new Error(result.error || 'Upload failed')
  }
  
  return { 
      id: result.data.path, 
      blobUrl: result.data.signedUrl || result.data.publicUrl 
  }
}

export default function InvestorOnboardingForm({ onClose = () => {} }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
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
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setFormData((prev) => ({
        ...prev,
        utm_source: urlParams.get("utm_source") || "",
        utm_medium: urlParams.get("utm_medium") || "",
        utm_campaign: urlParams.get("utm_campaign") || "",
        referral_code: urlParams.get("ref") || "",
      }))
    }
  }, [])

  const validateStep = (step) => {
    const newErrors = {}

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
      if (formData.residency_status === "resident") {
        if (!formData.eid_number.trim()) newErrors.eid_number = "Emirates ID number is required"
        if (!formData.eid_upload_url) newErrors.eid_upload = "Emirates ID upload is required"
        if (!formData.passport_upload_resident_url) newErrors.passport_upload_resident = "Passport upload is required"
      } else if (formData.residency_status === "non_resident") {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const n = { ...prev }
        delete n[field]
        return n
      })
    }
  }

  const handleBlobUpload = async (
    targetFieldUrl,
    targetFileField,
    file,
    errorKey
  ) => {
    console.log("uploading");
    if (!file) return
    
    try {
      const { blobUrl } = await uploadToVercelBlob(file)
      setFormData((prev) => ({
        ...prev,
        [targetFieldUrl]: blobUrl,
        [targetFileField]: null,
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
      // Mock submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
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
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200" 
              onClick={() => window.location.href = "https://invest.mirfa.com/dubai-south"}
            >
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
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground font-bold">G6 Dubai South Investor Application</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="hover:bg-white/60 dark:hover:bg-neutral-800/60 w-8 h-8 p-0 rounded-full"
            >
              ✕
            </Button>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="text-sm text-muted-foreground font-medium">Step {currentStep} of 4</div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">{Math.round((currentStep / 4) * 100)}%</div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-background p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">Basic Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className={`mt-2 ${errors.full_name ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                    placeholder="Enter your full legal name"
                  />
                  {errors.full_name && <p className="text-sm text-red-500 mt-1 font-medium">{errors.full_name}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`mt-2 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-sm font-semibold text-gray-700 dark:text-gray-300">WhatsApp Number (with country code) *</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    className={`mt-2 ${errors.whatsapp ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                  {errors.whatsapp && <p className="text-sm text-red-500 mt-1 font-medium">{errors.whatsapp}</p>}
                </div>

                <div>
                  <Label htmlFor="address_line" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Address (Line, City, Country) *</Label>
                  <Textarea
                    id="address_line"
                    value={formData.address_line}
                    onChange={(e) => handleInputChange("address_line", e.target.value)}
                    className={`mt-2 min-h-[80px] ${errors.address_line ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                    placeholder="Full address including city and country"
                  />
                  {errors.address_line && <p className="text-sm text-red-500 mt-1 font-medium">{errors.address_line}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Investment Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">Investment Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="investment_amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Investment Amount (AED) *</Label>
                  <Input
                    id="investment_amount"
                    type="number"
                    min="50000"
                    step="50000"
                    value={formData.investment_amount}
                    onChange={(e) => handleInputChange("investment_amount", Number.parseInt(e.target.value) || 0)}
                    className={`mt-2 ${errors.investment_amount ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 font-medium">
                    Fixed ticket is AED 50,000. If you wish to invest more, enter a multiple of 50,000.
                  </p>
                  {errors.investment_amount && <p className="text-sm text-red-500 mt-1 font-medium">{errors.investment_amount}</p>}
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Residency Status *</Label>
                  <RadioGroup
                    value={formData.residency_status}
                    onValueChange={(value) => handleInputChange("residency_status", value)}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <RadioGroupItem value="resident" id="uae-resident" className="border-2" />
                      <Label htmlFor="uae-resident" className="font-medium cursor-pointer flex-1">UAE Resident</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <RadioGroupItem value="non_resident" id="non-resident" className="border-2" />
                      <Label htmlFor="non-resident" className="font-medium cursor-pointer flex-1">Non-Resident</Label>
                    </div>
                  </RadioGroup>
                  {errors.residency_status && <p className="text-sm text-red-500 mt-2 font-medium">{errors.residency_status}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: KYC Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">KYC Documents</h3>
              </div>

              {formData.residency_status === "resident" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="eid_number" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Emirates ID Number *</Label>
                    <Input
                      id="eid_number"
                      placeholder="784-1234-1234567-1"
                      value={formData.eid_number}
                      onChange={(e) => handleInputChange("eid_number", e.target.value)}
                      className={`mt-2 ${errors.eid_number ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Emirates ID number (digits and dashes).</p>
                    {errors.eid_number && <p className="text-sm text-red-500 mt-1 font-medium">{errors.eid_number}</p>}
                  </div>

                  <div>
                    <Label htmlFor="eid_upload" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Emirates ID Upload (Front & Back) *</Label>
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
                        className={`w-full h-12 ${errors.eid_upload ? "border-red-500 hover:border-red-600" : "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300"} ${formData.eid_upload_url ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:border-green-700 dark:text-green-400" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.eid_upload_url ? "✓ Emirates ID Uploaded" : "Upload Emirates ID"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Emirates ID (front & back).</p>
                    {errors.eid_upload && <p className="text-sm text-red-500 mt-1 font-medium">{errors.eid_upload}</p>}
                  </div>

                  <div>
                    <Label htmlFor="passport_upload_resident" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passport Upload *</Label>
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
                        className={`w-full h-12 ${errors.passport_upload_resident ? "border-red-500 hover:border-red-600" : "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300"} ${formData.passport_upload_resident_url ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:border-green-700 dark:text-green-400" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.passport_upload_resident_url ? "✓ Passport Uploaded" : "Upload Passport"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Passport photo page.</p>
                    {errors.passport_upload_resident && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.passport_upload_resident}</p>
                    )}
                  </div>
                </div>
              )}

              {formData.residency_status === "non_resident" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nationality" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange("nationality", e.target.value)}
                      className={`mt-2 ${errors.nationality ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                      placeholder="Enter your nationality"
                    />
                    {errors.nationality && <p className="text-sm text-red-500 mt-1 font-medium">{errors.nationality}</p>}
                  </div>

                  <div>
                    <Label htmlFor="passport_number" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passport Number *</Label>
                    <Input
                      id="passport_number"
                      value={formData.passport_number}
                      onChange={(e) => handleInputChange("passport_number", e.target.value)}
                      className={`mt-2 ${errors.passport_number ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                      placeholder="Enter passport number"
                    />
                    {errors.passport_number && <p className="text-sm text-red-500 mt-1 font-medium">{errors.passport_number}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passport_issue_date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passport Issue Date *</Label>
                      <Input
                        id="passport_issue_date"
                        type="date"
                        value={formData.passport_issue_date}
                        onChange={(e) => handleInputChange("passport_issue_date", e.target.value)}
                        className={`mt-2 ${errors.passport_issue_date ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                      />
                      {errors.passport_issue_date && (
                        <p className="text-sm text-red-500 mt-1 font-medium">{errors.passport_issue_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="passport_expiry_date" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passport Expiry Date *</Label>
                      <Input
                        id="passport_expiry_date"
                        type="date"
                        value={formData.passport_expiry_date}
                        onChange={(e) => handleInputChange("passport_expiry_date", e.target.value)}
                        className={`mt-2 ${errors.passport_expiry_date ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                      />
                      {errors.passport_expiry_date && (
                        <p className="text-sm text-red-500 mt-1 font-medium">{errors.passport_expiry_date}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="passport_upload_nonresident" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passport Upload *</Label>
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
                        className={`w-full h-12 ${errors.passport_upload_nonresident ? "border-red-500 hover:border-red-600" : "hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-300"} ${formData.passport_upload_nonresident_url ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:border-green-700 dark:text-green-400" : ""}`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {formData.passport_upload_nonresident_url ? "✓ Passport Uploaded" : "Upload Passport"}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Passport photo page.</p>
                    {errors.passport_upload_nonresident && (
                      <p className="text-sm text-red-500 mt-1 font-medium">{errors.passport_upload_nonresident}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">NRI LRS Confirmation (Optional)</Label>
                    <RadioGroup
                      value={formData.nri_lrs_confirm}
                      onValueChange={(value) => handleInputChange("nri_lrs_confirm", value)}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <RadioGroupItem value="yes" id="lrs-yes" />
                        <Label htmlFor="lrs-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                        <RadioGroupItem value="no" id="lrs-no" />
                        <Label htmlFor="lrs-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      If you are an NRI investing under LRS, confirm you will comply with LRS/FEMA.
                    </p>
                  </div>
                </div>
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
            <SelectContent 
              className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-700 shadow-lg z-[60]"
              position="popper"
              sideOffset={4}
            >
              <SelectItem 
                value="Salary"
                className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Salary
              </SelectItem>
              <SelectItem 
                value="Savings"
                className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Savings
              </SelectItem>
              <SelectItem 
                value="Business Income"
                className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Business Income
              </SelectItem>
              <SelectItem 
                value="Investment Income"
                className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Investment Income
              </SelectItem>
              <SelectItem 
                value="Other"
                className="hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Other
              </SelectItem>
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
                <Button  variant="outline" onClick={handleNext}>Next</Button>
              ) : (
                <Button variant="outline" onClick={handleSubmit} disabled={isSubmitting}>
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
