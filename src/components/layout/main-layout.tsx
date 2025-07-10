"use client"

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      
      {/* Main content */}
      <div className="lg:pl-64 transition-all duration-300">
        {/* Header */}
        <Header activeTab={activeTab} />
        
        {/* Page content */}
        <main className="animate-in">
          {children}
        </main>
      </div>
    </div>
  )
}