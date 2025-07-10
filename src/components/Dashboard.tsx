"use client"

import { useState } from 'react'
import { MainLayout } from './layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import HomeModule from './modules/HomeModule'
import OportunidadesAbertasModule from './modules/OportunidadesAbertasModule'
import HistoricoContratacaoModule from './modules/HistoricoContratacaoModule'
import AtasRegistroPrecoModule from './modules/AtasRegistroPrecoModule'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeModule onTabChange={setActiveTab} />
      
      case 'oportunidades':
        return (
          <div className="container mx-auto p-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Oportunidades Abertas
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                    API 6.4
                  </span>
                </CardTitle>
                <CardDescription>
                  Consulte contratações com período de recebimento de propostas em aberto.
                  Utilize os filtros para refinar sua busca.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OportunidadesAbertasModule />
              </CardContent>
            </Card>
          </div>
        )
      
      case 'historico':
        return (
          <div className="container mx-auto p-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Histórico de Contratações
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full">
                    API 6.3
                  </span>
                </CardTitle>
                <CardDescription>
                  Consulte contratações publicadas no PNCP por período informado.
                  Dados incluem detalhes completos das contratações realizadas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HistoricoContratacaoModule />
              </CardContent>
            </Card>
          </div>
        )
      
      case 'atas':
        return (
          <div className="container mx-auto p-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Atas de Registro de Preço
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                    API 6.5
                  </span>
                </CardTitle>
                <CardDescription>
                  Consulte atas de registro de preços por período de vigência.
                  Acesse informações sobre preços registrados e vigências.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AtasRegistroPrecoModule />
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return <HomeModule onTabChange={setActiveTab} />
    }
  }

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MainLayout>
  )
}