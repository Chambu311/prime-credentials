import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirectUrl = requestUrl.searchParams.get('redirectUrl') || '/'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect back to the original URL or to the home page if no redirect URL is provided
  return NextResponse.redirect(redirectUrl)
}