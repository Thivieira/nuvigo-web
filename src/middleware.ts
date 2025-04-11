import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be accessible without authentication
const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  // Add common public assets
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware processing request for path: ${pathname}`);

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => {
    // Special case for root path
    if (path === '/' && pathname === '/') {
      return true;
    }

    // For other paths, check for exact match or if pathname starts with path + '/'
    // This ensures that /dashboard doesn't match when checking for /
    return pathname === path || pathname.startsWith(path + '/');
  });

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const tokenCookie = request.cookies.get('auth_tokens');
  const tokenValue = tokenCookie?.value;

  if (!tokenValue) {
    console.log('No auth_tokens cookie found, redirecting to login');
    // Redirect to login if no token is present
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token is valid JSON and has the expected structure
    console.log('Found auth_tokens cookie, attempting to parse');
    const tokenData = JSON.parse(tokenValue);

    // Check if the token has the required properties
    if (!tokenData || !tokenData.accessToken) {
      console.log('Token missing accessToken property');
      throw new Error('Invalid token structure');
    }

    console.log('Token validation successful, allowing access to:', pathname);

    // Allow the request to proceed
    const response = NextResponse.next();

    // Don't modify the cookie here, as it might interfere with the client-side auth state
    // Just let the client handle the auth state

    return response;
  } catch (error) {
    console.log('Error validating token:', error);
    // If token is invalid, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 