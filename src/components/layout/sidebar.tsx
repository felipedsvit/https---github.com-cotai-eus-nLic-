"use client"

import { useState } from 'react'
// Temporary simple icons until heroicons is properly loaded
const HomeIcon = () => <span>🏠</span>
const ClipboardDocumentListIcon = () => <span>📋</span>
const ChartBarIcon = () => <span>📊</span>
const DocumentTextIcon = () => <span>📑</span>
const Bars3Icon = () => <span>☰</span>
const XMarkIcon = () => <span>✕</span>
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  {
    name: 'Início',
    id: 'home',
    icon: HomeIcon,
    description: 'Visão geral e estatísticas'
  },
  {
    name: 'Oportunidades Abertas',
    id: 'oportunidades',
    icon: ClipboardDocumentListIcon,
    description: 'Contratações com propostas em aberto'
  },
  {
    name: 'Histórico de Contratações',
    id: 'historico',
    icon: ChartBarIcon,
    description: 'Contratações já publicadas'
  },
  {
    name: 'Atas de Preço',
    id: 'atas',
    icon: DocumentTextIcon,
    description: 'Registros de preços vigentes'
  },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        {!isCollapsed && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsCollapsed(true)}
          />
        )}
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
        isCollapsed ? "-translate-x-full lg:w-16" : "w-64 translate-x-0"
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-sm">nL</span>
              </div>
              <div>
                <h1 className="font-semibold text-sidebar-foreground">nLic</h1>
                <p className="text-xs text-sidebar-foreground/60">Portal PNCP</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground lg:hidden"
          >
            {isCollapsed ? (
              <Bars3Icon className="h-5 w-5" />
            ) : (
              <XMarkIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                )} />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className={cn(
                      "text-xs truncate",
                      isActive ? "text-sidebar-primary-foreground/80" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground/70"
                    )}>
                      {item.description}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/50 text-center">
              <p>© 2024 nLic</p>
              <p>Portal do Fornecedor PNCP</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse/Expand button for desktop */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed top-20 left-0 z-50 p-2 bg-sidebar border border-sidebar-border rounded-r-lg shadow-lg hover:bg-sidebar-accent transition-colors"
        style={{ 
          left: isCollapsed ? '16px' : '256px',
          transition: 'left 0.3s ease-in-out'
        }}
      >
        <Bars3Icon className="h-4 w-4 text-sidebar-foreground" />
      </button>
    </>
  )
}