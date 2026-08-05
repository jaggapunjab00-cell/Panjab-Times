import { NextResponse } from 'next/server';

const SESSION_SECRET = 'pt_admin_auth_2024';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin (dashboard) — redirect to login if no valid session
  if (pathname === '/admin' || pathname === '/admin/') {
    const session = request.cookies.get('pt_admin_session')?.value;
    if (session !== SESSION_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Redirect logged-in admin away from login page
  if (pathname === '/admin/login') {
    const session = request.cookies.get('pt_admin_session')?.value;
    if (session === SESSION_SECRET) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/', '/admin/login'],
};
