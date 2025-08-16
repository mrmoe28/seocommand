import { DashboardSidebar } from '@/components/dashboard/sidebar';

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