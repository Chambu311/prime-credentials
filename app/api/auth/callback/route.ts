import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  // Use NEXT_PUBLIC_SITE_URL in production, or fallback to request headers
  const redirectUrl = process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_SITE_URL || `https://${request.headers.get('host')}`)
    : requestUrl.origin;
    
  return NextResponse.redirect(redirectUrl)
}