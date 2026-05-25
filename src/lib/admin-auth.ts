import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_COOKIE_VALUE = 'authenticated';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'connplex-admin';
}

export function isValidAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin';
}

export function isValidAdminCredentials(username: string, password: string): boolean {
  return username === getAdminUsername() && isValidAdminPassword(password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
