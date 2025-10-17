'use client';

import * as React from 'react';
import {
  DollarSign,
  GanttChartSquare,
  LayoutDashboard,
  Newspaper,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { Header } from '@/components/dashboard/header';
import { MainChart } from '@/components/dashboard/main-chart';
import { PerformanceCards } from '@/components/dashboard/performance-cards';
import { StrategyAdvisor } from '@/components/dashboard/strategy-advisor';
import { NewsSentiment } from '@/components/dashboard/news-sentiment';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { PositionManager } from '@/components/dashboard/position-manager';
import { RiskAssessment } from '@/components/dashboard/risk-assessment';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { id: 'trends', label: 'Trend Analysis', icon: TrendingUp, href: '#' },
  { id: 'positions', label: 'Positions', icon: GanttChartSquare, href: '#' },
  { id: 'risk', label: 'Risk', icon: ShieldCheck, href: '#' },
  { id: 'news', label: 'News Feed', icon: Newspaper, href: '#' },
];

export default function DashboardPage() {
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
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 pt-6 md:space-y-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <PerformanceCards />
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MainChart />
            </div>
            <div className="space-y-4 md:space-y-8">
              <StrategyAdvisor />
              <NewsSentiment />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TradeHistory />
            </div>
            <div className="space-y-4 md:space-y-8">
              <PositionManager />
              <RiskAssessment />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
