// app/terms/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions – MIRFA",
  description: "Terms & Conditions for MIRFA investment platform.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">Terms &amp; Conditions</h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray max-w-3xl mt-8">
          <p>
            This page outlines the Terms &amp; Conditions for using the MIRFA investment platform. Replace this
            placeholder content with your legal copy.
          </p>
          <h2>Use of the Platform</h2>
          <p>…</p>
          <h2>Eligibility</h2>
          <p>…</p>
          <h2>Contact</h2>
          <p>
            For questions, email <a href="mailto:invest@mirfa.com">invest@mirfa.com</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
