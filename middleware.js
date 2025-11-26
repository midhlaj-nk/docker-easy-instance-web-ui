import { NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/deploy',
  '/metrics',
  '/profile',
  '/subscriptions',
  '/backup',
  '/logs',
  '/git-manager',
  '/domain-management',
  '/help-tickets',
  '/settings',
  '/shell',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Check for token in cookies or localStorage (we'll check in client-side)
    // Since middleware runs on server, we'll handle auth check in the page components
    // But we can still redirect based on cookies if available
    const token = request.cookies.get('auth-token')?.value;
    
    // If no token in cookies, let the client-side handle the redirect
    // The page components will check localStorage and redirect if needed
    if (!token) {
      // Don't block here - let client-side handle it for better UX
      // Client-side will check localStorage and redirect
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

