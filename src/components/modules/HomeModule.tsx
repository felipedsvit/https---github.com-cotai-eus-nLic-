"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// Temporary simple icons until heroicons is properly loaded
const ClipboardDocumentListIcon = () => <span>📋</span>
const ChartBarIcon = () => <span>📊</span>
const DocumentTextIcon = () => <span>📑</span>
const ArrowUpRightIcon = () => <span>↗</span>

interface HomeModuleProps {
  onTabChange: (tab: string) => void
}

const moduleCards = [
  {
    id: 'oportunidades',
    title: 'Oportunidades Abertas',
    description: 'Consulte contratações com período de recebimento de propostas em aberto',
    icon: ClipboardDocumentListIcon,
    stats: 'API 6.4',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'historico',
    title: 'Histórico de Contratações',
    description: 'Consulte contratações publicadas no PNCP por período informado',
    icon: ChartBarIcon,
    stats: 'API 6.3',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'atas',
    title: 'Atas de Registro de Preço',
    description: 'Consulte atas de registro de preços por período de vigência',
    icon: DocumentTextIcon,
    stats: 'API 6.5',
    color: 'text-purple-600 dark:text-purple-400'
  }
]

export default function HomeModule({ onTabChange }: HomeModuleProps) {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight slide-in">
            Portal do Fornecedor PNCP
          </h1>
          <p className="text-xl text-muted-foreground slide-in">
            Consulte dados do Portal Nacional de Contratações Públicas de forma centralizada e eficiente
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="card-hover scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">APIs Integradas</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">API</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover scale-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status do Sistema</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">Operacional</p>
                </div>
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover scale-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Atualização</p>
                  <p className="text-lg font-semibold">Agora</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">LIVE</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Módulos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCards.map((module, index) => {
            const Icon = module.icon
            
            return (
              <Card 
                key={module.id} 
                className="card-hover cursor-pointer group scale-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onTabChange(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-background border ${module.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                        {module.stats}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-8 border-t">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold">Portal Nacional de Contratações Públicas</h3>
                <p className="text-sm text-muted-foreground">
                  Dados obtidos em tempo real através das APIs oficiais do PNCP
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Documentação: <span className="text-primary">pncp.gov.br/api</span></p>
                <p>Versão do Portal: <span className="font-medium">2024.1</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}