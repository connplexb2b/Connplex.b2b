import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_VALUE,
  ADMIN_ROLE_COOKIE,
  authenticateCredentials,
  isAdminAuthenticated,
  getAdminRole,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const authResult = authenticateCredentials(username, password);
  if (!authResult.valid || !authResult.role || !authResult.user) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }

  const role = authResult.role;
  const redirectTo = role === 'hr' ? '/admin/careers' : (body.from || '/admin/news');

  const response = NextResponse.json({
    success: true,
    role,
    user: authResult.user,
    redirectTo,
  });

  // Admin session cookie (read by server proxy/middleware)
  response.cookies.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  // Role cookie (read by client components and proxy)
  response.cookies.set(ADMIN_ROLE_COOKIE, role, {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const role = (await getAdminRole()) || 'admin';
  return NextResponse.json({
    authenticated: true,
    role,
    user: {
      username: role,
      name: role === 'hr' ? 'HR Manager' : 'Administrator',
      email: role === 'hr' ? 'hr@theconnplex.com' : 'connplexadmin@yopmail.com',
      role,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  response.cookies.delete(ADMIN_ROLE_COOKIE);
  return response;
}
