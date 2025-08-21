'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Package,
  Image,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { Button } from '../ui/Button'

const sidebarNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Products', href: '/product', icon: Package },
  { title: 'Banners', href: '/banners', icon: Image },
  { title: 'Orders', href: '/orders', icon: ShoppingCart },
  { title: 'Categories', href: '/categories', icon: Users },
  { title: 'Sales Analytics', href: '/sales', icon: BarChart3 },
  { title: 'Settings', href: '/statistics', icon: Settings },
]

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full border-r bg-background transition-all duration-300 z-50 flex flex-col',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex-1 space-y-4 py-4">
          <div className="px-3 py-2 flex items-center justify-between">
            <h2
              className={cn(
                'text-lg font-semibold tracking-tight transition-all',
                collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              )}
            >
              Admin Dashboard
            </h2>
            <div className="flex gap-1">
              {/* Collapse button (desktop only) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className="h-8 w-8 hidden lg:flex"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>

              {/* Close button (mobile only) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8 lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Nav */}
          <ScrollArea>
            <div className="space-y-1 px-3">
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground',
                    collapsed && 'justify-center'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 transition-all',
                      collapsed ? 'mr-0' : 'mr-2'
                    )}
                  />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="p-3 border-t">
          <Button
            variant="ghost"
            className={cn(
              'w-full flex items-center justify-start',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  )
}

