"use server"

export async function submitInvestorForm(formData: FormData) {
  try {
    // Submit to webhook with server-side API secret
    const eidUrl = formData.get('eid_upload_url') as string | null
    const residentPassportUrl = formData.get('passport_upload_resident_url') as string | null
    const nonResidentPassportUrl = formData.get('passport_upload_nonresident_url') as string | null

    const response = await fetch("https://api.mirfa.com/api/formsubmission", {
      method: "POST",
      headers: {
        "X-Webhook-Secret": process.env.API_SECRET || "API_SECRET",
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Form submission error:", error)
    return { success: false, error: "Submission failed. Please try again." }
  }
}
