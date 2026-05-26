import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi =
    pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  if (session === ADMIN_COOKIE_VALUE) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
