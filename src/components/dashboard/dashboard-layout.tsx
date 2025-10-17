import * as React from 'react';
import Link from 'next/link';
import { Save, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Logo } from '@/components/icons';
import { Header } from '@/components/dashboard/header';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { menuItems } from '@/lib/data';
import { Toaster } from '@/components/ui/toaster';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="p-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="size-7 shrink-0" />
              <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">
                TradeAlchemist
              </span>
            </Link>
          </SidebarHeader>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip={{children: "Save version"}}>
                        <Save />
                        <span>Save</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
           <div className="flex items-center justify-center p-2 group-data-[collapsible=icon]:hidden">
                <span className="text-xs text-muted-foreground">Version {process.env.APP_VERSION}</span>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 pt-6 md:space-y-8 md:p-8">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}