// app/api/kyc/upload/route.ts
import { handleUpload } from '@vercel/blob/client'
import type { NextRequest } from 'next/server'

// (Optional) run on Edge for low latency
export const runtime = 'edge'

const MAX_MB = 15
const ALLOWED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export async function POST(req: NextRequest) {
  return handleUpload(req, {
    onBeforeGenerateToken: async (pathname, clientPayload) => {
      // Sanitize & organize file keys
      const safeName = pathname.replace(/[^a-zA-Z0-9._-]/g, '_')
      const key = `kyc-uploads/${Date.now()}-${safeName}`

      return {
        access: 'private',
        allowedContentTypes: ALLOWED,
        maximumSizeInBytes: MAX_MB * 1024 * 1024,
        pathname: key,
      }
    },
    onUploadCompleted: async ({ blob /*, tokenPayload */ }) => {
      // Hook for audit/logging if desired
      // console.log('KYC upload saved:', blob)
    },
  })
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
