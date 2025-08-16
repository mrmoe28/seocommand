'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Globe,
  FileText,
  Settings,
  Search,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const navigation = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
      },
      {
        title: 'Websites',
        href: '/dashboard/websites',
        icon: Globe,
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        title: 'Reports',
        href: '/dashboard/reports',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Account',
        href: '/dashboard/settings',
        icon: Settings,
      },
    ],
  },
];

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Search className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">SEO SiteWatcher</span>
                    <span className="truncate text-xs">Monitor & Optimize</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                <span>Toggle theme</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => signOut()}>
                <LogOut className="size-4" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}