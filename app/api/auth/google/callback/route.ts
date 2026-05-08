import { NextResponse } from 'next/server';
import api from '@/lib/axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/login?error=oauth_denied', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    // Forward code to backend
    const response = await fetch(`${apiUrl}/auth/oauth/google/callback?code=${code}`);
    const data = await response.json();

    if (!response.ok || !data.token) {
      return NextResponse.redirect(new URL('/login?error=oauth_failed', request.url));
    }

    // Store token and redirect to profile
    const redirectUrl = new URL('/profile', request.url);
    redirectUrl.searchParams.set('token', data.token);
    if (data.isNewUser) {
      redirectUrl.searchParams.set('welcome', 'true');
    }

    const nextResponse = NextResponse.redirect(redirectUrl);
    nextResponse.cookies.set('token', data.token, {
      httpOnly: false, // Allow JS access for localStorage fallback
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return nextResponse;

  } catch (e) {
    console.error('OAuth callback error:', e);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}