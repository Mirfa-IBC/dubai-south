// app/compliance/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance – MIRFA",
  description: "Compliance, risk, and governance information for MIRFA.",
}

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">Compliance</h1>
        <div className="prose prose-gray max-w-3xl mt-8">
          <p>Replace with your compliance framework, disclosures, and policies.</p>
        </div>
      </section>
    </main>
  )
}
