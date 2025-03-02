import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  // Get the host from various possible sources
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = request.headers.get('host')
  
  // Determine the protocol (http vs https)
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  
  // Build the redirect URL using the most reliable source
  let redirectUrl
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // Use the environment variable if available (most reliable)
    redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
  } else if (forwardedHost) {
    // Use the forwarded host if available (for apps behind proxies)
    redirectUrl = `${protocol}://${forwardedHost}`
  } else if (host) {
    // Fallback to the host header
    redirectUrl = `${protocol}://${host}`
  } else {
    // Last resort fallback
    redirectUrl = requestUrl.origin
  }
  
  // Log the redirect URL for debugging (remove in production)
  console.log('Redirecting to:', redirectUrl)
  
  return NextResponse.redirect(redirectUrl)
}