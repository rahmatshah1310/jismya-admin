'use client'

import { useState } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'

export function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}
      >
        {/* Header (with mobile menu button) */}
        <Header onOpenMobile={() => setMobileOpen(true)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
