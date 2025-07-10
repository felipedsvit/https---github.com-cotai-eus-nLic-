"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateToPncp, formatDate, formatCnpj } from '@/lib/utils'
import { AtaRegistroPreco, PncpApiResponse } from '@/types/pncp'

export default function AtasRegistroPrecoModule() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<PncpApiResponse<AtaRegistroPreco> | null>(null)
  
  // Set default dates to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const [formData, setFormData] = useState({
    dataInicial: formatDateToPncp(thirtyDaysAgo),
    dataFinal: formatDateToPncp(today),
    idUsuario: '',
    cnpj: '',
    codigoUnidadeAdministrativa: '',
    pagina: 1,
    tamanhoPagina: 50,
  })

  const handleSearch = async () => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) searchParams.append(key, String(value))
      })

      const response = await fetch(`/api/contratacoes/atas?${searchParams}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na consulta')
      }

      setResults(data)
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Erro na consulta')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePageChange = (newPage: number) => {
    setFormData(prev => ({ ...prev, pagina: newPage }))
    // Automatically trigger search when page changes
    setTimeout(handleSearch, 100)
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Data Inicial */}
            <div className="space-y-2">
              <label htmlFor="dataInicial" className="text-sm font-medium">
                Data Inicial * (AAAAMMDD)
              </label>
              <Input
                id="dataInicial"
                value={formData.dataInicial}
                onChange={(e) => handleInputChange('dataInicial', e.target.value)}
                placeholder="Ex: 20241201"
                maxLength={8}
              />
            </div>

            {/* Data Final */}
            <div className="space-y-2">
              <label htmlFor="dataFinal" className="text-sm font-medium">
                Data Final * (AAAAMMDD)
              </label>
              <Input
                id="dataFinal"
                value={formData.dataFinal}
                onChange={(e) => handleInputChange('dataFinal', e.target.value)}
                placeholder="Ex: 20241231"
                maxLength={8}
              />
            </div>

            {/* ID Usuário */}
            <div className="space-y-2">
              <label htmlFor="idUsuario" className="text-sm font-medium">
                ID do Sistema Usuário
              </label>
              <Input
                id="idUsuario"
                type="number"
                value={formData.idUsuario}
                onChange={(e) => handleInputChange('idUsuario', e.target.value)}
                placeholder="Ex: 3"
              />
            </div>

            {/* CNPJ */}
            <div className="space-y-2">
              <label htmlFor="cnpj" className="text-sm font-medium">
                CNPJ do Órgão
              </label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
                placeholder="XX.XXX.XXX/XXXX-XX"
              />
            </div>

            {/* Código Unidade Administrativa */}
            <div className="space-y-2">
              <label htmlFor="codigoUnidadeAdministrativa" className="text-sm font-medium">
                Código da Unidade Administrativa
              </label>
              <Input
                id="codigoUnidadeAdministrativa"
                value={formData.codigoUnidadeAdministrativa}
                onChange={(e) => handleInputChange('codigoUnidadeAdministrativa', e.target.value)}
                placeholder="Ex: 194035"
              />
            </div>

            {/* Página */}
            <div className="space-y-2">
              <label htmlFor="pagina" className="text-sm font-medium">
                Página
              </label>
              <Input
                id="pagina"
                type="number"
                min="1"
                value={formData.pagina}
                onChange={(e) => handleInputChange('pagina', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setFormData({
                dataInicial: formatDateToPncp(thirtyDaysAgo),
                dataFinal: formatDateToPncp(today),
                idUsuario: '',
                cnpj: '',
                codigoUnidadeAdministrativa: '',
                pagina: 1,
                tamanhoPagina: 50,
              })}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Consulta</CardTitle>
            <div className="text-sm text-muted-foreground">
              {results.totalRegistros} registros encontrados | 
              Página {results.numeroPagina} de {results.totalPaginas}
            </div>
          </CardHeader>
          <CardContent>
            {results.data.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma ata de registro de preço encontrada para os filtros informados.
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {results.data.map((ataData, index) => {
                    // Handle the nested structure of API 6.5
                    if (ataData.Atas && Array.isArray(ataData.Atas)) {
                      return ataData.Atas.map((ata, ataIndex) => (
                        <Card key={`${index}-${ataIndex}-${ata.numeroControlePNCPAta}`} className="border-l-4 border-l-purple-500">
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-lg mb-2">
                                  {ata.numeroControlePNCPAta}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Número da Ata:</strong> {ata.numeroAtaRegistroPreco}
                                </p>
                                <p className="text-sm">
                                  <strong>Ano:</strong> {ata.anoAta}
                                </p>
                                <p className="text-sm">
                                  <strong>Objeto:</strong> {ata.objetoContratacao}
                                </p>
                                <p className="text-sm">
                                  <strong>Status:</strong> {ata.cancelado ? 'Cancelada' : 'Ativa'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm">
                                  <strong>Órgão:</strong> {ata.nomeOrgao}
                                </p>
                                <p className="text-sm">
                                  <strong>CNPJ:</strong> {formatCnpj(ata.cnpjOrgao || '')}
                                </p>
                                <p className="text-sm">
                                  <strong>Unidade:</strong> {ata.nomeUnidadeOrgao}
                                </p>
                                <p className="text-sm">
                                  <strong>Sistema:</strong> {ata.usuario}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <strong>Assinatura:</strong><br />
                                  {ata.dataAssinatura ? formatDate(ata.dataAssinatura) : 'N/A'}
                                </div>
                                <div>
                                  <strong>Início Vigência:</strong><br />
                                  {ata.vigenciaInicio ? formatDate(ata.vigenciaInicio) : 'N/A'}
                                </div>
                                <div>
                                  <strong>Fim Vigência:</strong><br />
                                  {ata.vigenciaFim ? formatDate(ata.vigenciaFim) : 'N/A'}
                                </div>
                                <div>
                                  <strong>Publicação PNCP:</strong><br />
                                  {ata.dataPublicacaoPncp ? formatDate(ata.dataPublicacaoPncp) : 'N/A'}
                                </div>
                              </div>
                              {ata.dataCancelamento && (
                                <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                                  <strong>Data de Cancelamento:</strong> {formatDate(ata.dataCancelamento)}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    }
                    return null
                  })}
                </div>

                {/* Pagination */}
                {results.totalPaginas > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(results.numeroPagina - 1)}
                      disabled={results.numeroPagina <= 1}
                    >
                      Anterior
                    </Button>
                    <span className="px-4 py-2 text-sm">
                      Página {results.numeroPagina} de {results.totalPaginas}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(results.numeroPagina + 1)}
                      disabled={results.numeroPagina >= results.totalPaginas}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}