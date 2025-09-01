// app/privacy/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy – MIRFA",
  description: "How MIRFA collects, uses, and protects personal data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-gray max-w-3xl mt-8">
          <p>Replace with your privacy policy content.</p>
          <h2>Data We Collect</h2>
          <p>…</p>
          <h2>How We Use Data</h2>
          <p>…</p>
        </div>
      </section>
    </main>
  )
}
