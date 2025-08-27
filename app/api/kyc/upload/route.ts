// app/api/kyc/upload/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

// (Optional) Edge is fine here
export const runtime = 'edge'

const MAX_MB = 15
const ALLOWED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export async function POST(request: NextRequest) {
  // NEW: parse JSON body for handleUpload
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request, // pass the Request object
      onBeforeGenerateToken: async (pathname /*, clientPayload */) => {
        // sanitize filename & route into a folder
        const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, '_')
        const key = `kyc-uploads/${Date.now()}-${safeName}`

        return {
          access: 'private',
          allowedContentTypes: ALLOWED,
          // NOTE: name is maximumSizeInBytes per SDK
          maximumSizeInBytes: MAX_MB * 1024 * 1024,
          pathname: key,
          // tokenPayload: JSON.stringify({ userId }) // optional
        }
      },
      onUploadCompleted: async ({ blob /*, tokenPayload */ }) => {
        // e.g., audit log, DB write, webhook, etc.
        // console.log('KYC upload saved:', blob)
      },
    })

    // NEW: return the JSON from handleUpload
    return NextResponse.json(jsonResponse)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 400 })
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
