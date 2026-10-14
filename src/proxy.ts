import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, ADMIN_COOKIE_VALUE } from '@/lib/admin-auth';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // 1. Check for admin pages and admin API requests
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isAdminApi =
    pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth');

  if (isAdminPage || isAdminApi) {
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

  // 2. Subdomain check for GamePlex
  // Matches "gameplex.theconnplex.com", "gameplex.localhost:3000", "gameplex.local:3000" etc.
  const isGameplexSubdomain = hostname.startsWith('gameplex.');

  if (isGameplexSubdomain) {
    // Prevent infinite rewrite loops if the path already starts with /gameplex
    if (!pathname.startsWith('/gameplex')) {
      url.pathname = `/gameplex${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // 3. Subdomain check and redirect for Spectra-X
  // Matches "spectrax.theconnplex.com", "spectrax.localhost:3000", "spectrax.local:3000" etc.
  const isSpectraxSubdomain = hostname.startsWith('spectrax.');

  if (isSpectraxSubdomain) {
    // If user accesses /spectra-x on the subdomain, redirect to root /
    if (pathname === '/spectra-x' || pathname === '/spectra-x/') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    // Route root / to the internal /spectra-x page
    if (pathname === '/') {
      url.pathname = '/spectra-x';
      return NextResponse.rewrite(url);
    }
    // For other paths on the spectrax subdomain, redirect to the main domain
    const mainHost = hostname.includes('localhost')
      ? hostname.replace(/^spectrax\./, '')
      : 'www.theconnplex.com';
    const mainProtocol = hostname.includes('localhost') ? 'http' : 'https';
    const mainUrl = new URL(pathname, `${mainProtocol}://${mainHost}`);
    url.searchParams.forEach((val, key) => mainUrl.searchParams.set(key, val));
    return NextResponse.redirect(mainUrl);
  } else {
    // On main domain (or any non-spectrax domain), redirect /spectra-x to subdomain spectrax.theconnplex.com
    if (pathname === '/spectra-x' || pathname === '/spectra-x/') {
      const redirectTarget = hostname.includes('localhost')
        ? `http://spectrax.${hostname}`
        : 'https://spectrax.theconnplex.com';
      const redirectUrl = new URL('/', redirectTarget);
      url.searchParams.forEach((val, key) => redirectUrl.searchParams.set(key, val));
      return NextResponse.redirect(redirectUrl, { status: 308 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, except admin or gameplex API routes if any)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (static assets)
     * - favicon.ico (favicon file)
     * - favicon.png (favicon file)
     */
    '/((?!api/|_next/static|_next/image|assets|favicon.ico|favicon.png|.*\\..*).*)',
  ],
};

