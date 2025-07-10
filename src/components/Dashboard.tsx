"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OportunidadesAbertasModule from './modules/OportunidadesAbertasModule'
import HistoricoContratacaoModule from './modules/HistoricoContratacaoModule'
import AtasRegistroPrecoModule from './modules/AtasRegistroPrecoModule'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('oportunidades')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">nLic</h1>
            <span className="text-sm text-muted-foreground">
              Portal do Fornecedor PNCP
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Portal do Fornecedor PNCP</h1>
            <p className="text-muted-foreground">
              Consulte dados do Portal Nacional de Contratações Públicas de forma centralizada e eficiente.
            </p>
          </div>

          {/* Modules Tabs */}
          <Tabs className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="oportunidades" 
                active={activeTab === 'oportunidades'}
                onValueChange={setActiveTab}
              >
                Oportunidades Abertas
              </TabsTrigger>
              <TabsTrigger 
                value="historico" 
                active={activeTab === 'historico'}
                onValueChange={setActiveTab}
              >
                Histórico de Contratações
              </TabsTrigger>
              <TabsTrigger 
                value="atas" 
                active={activeTab === 'atas'}
                onValueChange={setActiveTab}
              >
                Atas de Preço
              </TabsTrigger>
            </TabsList>

            <TabsContent value="oportunidades" active={activeTab === 'oportunidades'}>
              <Card>
                <CardHeader>
                  <CardTitle>Oportunidades Abertas</CardTitle>
                  <CardDescription>
                    Consulte contratações com período de recebimento de propostas em aberto.
                    Utilize os filtros para refinar sua busca.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OportunidadesAbertasModule />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" active={activeTab === 'historico'}>
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Contratações</CardTitle>
                  <CardDescription>
                    Consulte contratações publicadas no PNCP por período informado.
                    Dados incluem detalhes completos das contratações realizadas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HistoricoContratacaoModule />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="atas" active={activeTab === 'atas'}>
              <Card>
                <CardHeader>
                  <CardTitle>Atas de Registro de Preço</CardTitle>
                  <CardDescription>
                    Consulte atas de registro de preços por período de vigência.
                    Acesse informações sobre preços registrados e vigências.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AtasRegistroPrecoModule />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-8">
        <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 nLic - Portal do Fornecedor PNCP</p>
          <p>Dados obtidos via API oficial do PNCP</p>
        </div>
      </footer>
    </div>
  )
}