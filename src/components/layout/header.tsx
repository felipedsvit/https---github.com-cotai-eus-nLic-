"use client"

import { ThemeToggle } from '@/components/theme/theme-toggle'

interface HeaderProps {
  activeTab: string
}

const tabTitles = {
  home: 'Início',
  oportunidades: 'Oportunidades Abertas',
  historico: 'Histórico de Contratações', 
  atas: 'Atas de Registro de Preço'
}

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Portal nLic</span>
          <span className="text-muted-foreground">›</span>
          <span className="font-medium text-foreground">
            {tabTitles[activeTab as keyof typeof tabTitles] || 'Portal do Fornecedor PNCP'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground hidden sm:block">
            Dados via API oficial do PNCP
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}