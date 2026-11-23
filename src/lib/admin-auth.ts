import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_COOKIE_VALUE = 'authenticated';
export const ADMIN_ROLE_COOKIE = 'admin_role';

export type AdminRole = 'admin' | 'hr';

export interface AdminUser {
  username: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AuthResult {
  valid: boolean;
  role?: AdminRole;
  user?: AdminUser;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'connplex-admin';
}

export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin';
}

export function getHrPassword(): string {
  return process.env.HR_PASSWORD || 'connplex-hr';
}

export function getHrUsername(): string {
  return process.env.HR_USERNAME || 'hr';
}

/**
 * Validates credentials for both Administrator and HR roles.
 */
export function authenticateCredentials(username: string, password: string): AuthResult {
  const u = username.trim().toLowerCase();
  const adminUser = getAdminUsername().toLowerCase();
  const adminPass = getAdminPassword();
  const hrUser = getHrUsername().toLowerCase();
  const hrPass = getHrPassword();

  // 1. Check Administrator
  if (
    (u === adminUser ||
      u === 'admin@theconnplex.com' ||
      u === 'connplexadmin@yopmail.com') &&
    password === adminPass
  ) {
    return {
      valid: true,
      role: 'admin',
      user: {
        username: 'admin',
        name: 'Administrator',
        email: 'connplexadmin@yopmail.com',
        role: 'admin',
      },
    };
  }

  // 2. Check HR
  if (
    (u === hrUser ||
      u === 'hr@theconnplex.com' ||
      u === 'hr@connplex.com' ||
      u === 'hr.connplex') &&
    password === hrPass
  ) {
    return {
      valid: true,
      role: 'hr',
      user: {
        username: 'hr',
        name: 'HR Manager',
        email: 'hr@theconnplex.com',
        role: 'hr',
      },
    };
  }

  return { valid: false };
}

export function isValidAdminCredentials(username: string, password: string): boolean {
  return authenticateCredentials(username, password).valid;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const cookieStore = await cookies();
  const role = cookieStore.get(ADMIN_ROLE_COOKIE)?.value;
  if (role === 'hr' || role === 'admin') return role;
  return null;
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ error: message }, { status: 401 });
}
