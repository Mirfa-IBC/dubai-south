// app/api/invite/request/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const isValidPhone = (v: string) => {
  const cleaned = v.replace(/\s|-/g, '')
  return /^(?:\+?\d{7,15})$/.test(cleaned) // lenient E.164
}

export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing name or phone' }, { status: 400 })
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: 'Invalid phone format' }, { status: 400 })
    }

    const { error } = await supabase
      .from('invite_requests')
      .insert({ name: String(name).trim(), phone: String(phone).trim() })

    if (error) {
      console.error('invite_requests insert error:', error)
      return NextResponse.json({ error: 'Could not save invite request' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('invite/request error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

export function GET() {
  return new Response('Method Not Allowed', { status: 405 })
}
