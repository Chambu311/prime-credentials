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

  // Make sure the redirect URL is absolute and uses the correct domain
  let finalRedirectUrl = redirectUrl;
  
  // If the redirect URL contains localhost but we're in production, replace it
  if (process.env.NODE_ENV === 'production' && finalRedirectUrl.includes('localhost')) {
    // Replace localhost with the production domain
    const productionDomain = process.env.NEXT_PUBLIC_SITE_URL || request.headers.get('host') || '';
    finalRedirectUrl = finalRedirectUrl.replace(
      /https?:\/\/localhost(:\d+)?/g, 
      `https://${productionDomain}`
    );
  }

  // Redirect back to the original URL or to the home page if no redirect URL is provided
  return NextResponse.redirect(finalRedirectUrl)
}