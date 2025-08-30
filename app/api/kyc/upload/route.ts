// app/api/kyc/upload/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_MB = 15
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body instead of FormData
    const body = await request.json()
    const { fileName, fileData, fileType, fileSize } = body
    
    if (!fileData || !fileName || !fileType) {
      return NextResponse.json({ 
        error: 'Missing required fields: fileName, fileData, fileType' 
      }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ 
        error: `File type ${fileType} not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
      }, { status: 400 })
    }

    // Validate file size
    if (fileSize > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ 
        error: `File size exceeds ${MAX_MB}MB limit` 
      }, { status: 400 })
    }

    // Convert base64 to buffer
    // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    const base64Data = fileData.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ 
        error: 'Invalid file data format' 
      }, { status: 400 })
    }

    const fileBuffer = Buffer.from(base64Data, 'base64')

    // Generate safe filename
    const timestamp = Date.now()
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const generatedFileName = `${timestamp}-${safeName}`
    const filePath = `kyc-uploads/${generatedFileName}`

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, fileBuffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ 
        error: 'Failed to upload file to storage' 
      }, { status: 500 })
    }

    // Get public URL (optional - only if bucket is public)
    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(filePath)

    // Get signed URL for private access (recommended for KYC documents)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('kyc-documents')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days expiry

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError)
    }

    // Optional: Log the upload or save metadata to database
    // await supabase
    //   .from('kyc_uploads')
    //   .insert({
    //     file_path: filePath,
    //     file_name: fileName,
    //     file_size: fileSize,
    //     file_type: fileType,
    //     uploaded_at: new Date().toISOString(),
    //     // user_id: userId // if you have user context
    //   })

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
        id: data.id,
        publicUrl: publicUrl,
        signedUrl: signedUrlData?.signedUrl,
        expiresAt: signedUrlData?.expiresAt,
        fileName: fileName,
        fileSize: fileSize,
        fileType: fileType
      }
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error?.message ?? 'Upload failed' 
    }, { status: 500 })
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
