// app/api/invite/validate/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')?.trim()

    if (!code) {
      return NextResponse.json({ valid: false, message: 'No code provided' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('invite_codes')
      .select('status, max_uses, uses, expires_at')
      .eq('code', code)
      .maybeSingle()

    if (error) {
      console.error('invite_codes select error:', error)
      return NextResponse.json({ valid: false, message: 'Lookup failed' }, { status: 200 })
    }

    if (!data) {
      return NextResponse.json({ valid: false, message: 'Invalid invite code' }, { status: 200 })
    }

    if (data.status !== 'active') {
      return NextResponse.json({ valid: false, message: 'Code disabled' }, { status: 200 })
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Code expired' }, { status: 200 })
    }

    if (data.uses >= data.max_uses) {
      return NextResponse.json({ valid: false, message: 'Code usage limit reached' }, { status: 200 })
    }

    return NextResponse.json({ valid: true })
  } catch (e: any) {
    console.error('invite/validate error:', e)
    return NextResponse.json({ valid: false, message: e?.message || 'Unexpected error' }, { status: 200 })
  }
}

export function POST() {
  return new Response('Method Not Allowed', { status: 405 })
}
