// app/regulation/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DIFC Regulation – MIRFA",
  description: "Regulatory information related to DIFC structure.",
}

export default function RegulationPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">DIFC Regulation</h1>
        <div className="prose prose-gray max-w-3xl mt-8">
          <a href="https://www.difc.com/">Webite-Link</a>
        </div>
      </section>
    </main>
  )
}
