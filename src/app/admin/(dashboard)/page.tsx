import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ADMIN_ROLE_COOKIE } from '@/lib/admin-auth';

export default async function AdminDashboardRedirect() {
  const cookieStore = await cookies();
  const role = cookieStore.get(ADMIN_ROLE_COOKIE)?.value;
  if (role === 'hr') {
    redirect('/admin/careers');
  }
  redirect('/admin/news');
}
