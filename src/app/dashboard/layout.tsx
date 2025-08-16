import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily bypass authentication for testing web scraping
  // const session = await auth();
  // if (!session) {
  //   redirect('/auth/signin');
  // }

  return <DashboardSidebar>{children}</DashboardSidebar>;
}