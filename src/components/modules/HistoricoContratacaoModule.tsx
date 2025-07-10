"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateToPncp, formatDate, formatCurrency, formatCnpj } from '@/lib/utils'
import { ESTADOS_BRASIL } from '@/lib/constants'
import { ContratacaoHistorico, ModalidadeContratacao, ModoDisputa, PncpApiResponse } from '@/types/pncp'

export default function HistoricoContratacaoModule() {
  const [loading, setLoading] = useState(false)
  const [modalidades, setModalidades] = useState<ModalidadeContratacao[]>([])
  const [modosDisputa, setModosDisputa] = useState<ModoDisputa[]>([])
  const [results, setResults] = useState<PncpApiResponse<ContratacaoHistorico> | null>(null)
  
  // Set default dates to last 30 days
  const today = new Date()
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const [formData, setFormData] = useState({
    dataInicial: formatDateToPncp(thirtyDaysAgo),
    dataFinal: formatDateToPncp(today),
    codigoModalidadeContratacao: '',
    codigoModoDisputa: '',
    uf: '',
    codigoMunicipioIbge: '',
    cnpj: '',
    codigoUnidadeAdministrativa: '',
    idUsuario: '',
    pagina: 1,
    tamanhoPagina: 50,
  })

  // Load domain data on component mount
  useEffect(() => {
    const loadDomainData = async () => {
      try {
        const [modalidadesRes, modosDisputaRes] = await Promise.all([
          fetch('/api/domain/modalidades'),
          fetch('/api/domain/modos-disputa')
        ])
        
        const [modalidadesData, modosDisputaData] = await Promise.all([
          modalidadesRes.json(),
          modosDisputaRes.json()
        ])
        
        setModalidades(modalidadesData)
        setModosDisputa(modosDisputaData)
      } catch (error) {
        console.error('Error loading domain data:', error)
      }
    }
    loadDomainData()
  }, [])

  const handleSearch = async () => {
    if (!formData.codigoModalidadeContratacao) {
      alert('Por favor, selecione uma modalidade de contratação.')
      return
    }

    setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) searchParams.append(key, String(value))
      })

      const response = await fetch(`/api/contratacoes/historico?${searchParams}`)
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

            {/* Modalidade */}
            <div className="space-y-2">
              <label htmlFor="modalidade" className="text-sm font-medium">
                Modalidade de Contratação *
              </label>
              <Select
                id="modalidade"
                value={formData.codigoModalidadeContratacao}
                onChange={(e) => handleInputChange('codigoModalidadeContratacao', e.target.value)}
              >
                <option value="">Selecione...</option>
                {modalidades.map((modalidade) => (
                  <option key={modalidade.id} value={modalidade.id}>
                    {modalidade.nome}
                  </option>
                ))}
              </Select>
            </div>

            {/* Modo de Disputa */}
            <div className="space-y-2">
              <label htmlFor="modoDisputa" className="text-sm font-medium">
                Modo de Disputa
              </label>
              <Select
                id="modoDisputa"
                value={formData.codigoModoDisputa}
                onChange={(e) => handleInputChange('codigoModoDisputa', e.target.value)}
              >
                <option value="">Todos</option>
                {modosDisputa.map((modo) => (
                  <option key={modo.id} value={modo.id}>
                    {modo.nome}
                  </option>
                ))}
              </Select>
            </div>

            {/* UF */}
            <div className="space-y-2">
              <label htmlFor="uf" className="text-sm font-medium">
                UF
              </label>
              <Select
                id="uf"
                value={formData.uf}
                onChange={(e) => handleInputChange('uf', e.target.value)}
              >
                <option value="">Todas</option>
                {ESTADOS_BRASIL.map((estado) => (
                  <option key={estado.uf} value={estado.uf}>
                    {estado.uf} - {estado.nome}
                  </option>
                ))}
              </Select>
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

            {/* Código IBGE */}
            <div className="space-y-2">
              <label htmlFor="codigoMunicipioIbge" className="text-sm font-medium">
                Código IBGE do Município
              </label>
              <Input
                id="codigoMunicipioIbge"
                value={formData.codigoMunicipioIbge}
                onChange={(e) => handleInputChange('codigoMunicipioIbge', e.target.value)}
                placeholder="Ex: 5300108"
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
                codigoModalidadeContratacao: '',
                codigoModoDisputa: '',
                uf: '',
                codigoMunicipioIbge: '',
                cnpj: '',
                codigoUnidadeAdministrativa: '',
                idUsuario: '',
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
                Nenhuma contratação encontrada para os filtros informados.
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {results.data.map((contratacao) => (
                    <Card key={contratacao.numeroControlePNCP} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-lg mb-2">
                              {contratacao.numeroControlePNCP}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              <strong>Objeto:</strong> {contratacao.objetoCompra}
                            </p>
                            <p className="text-sm">
                              <strong>Modalidade:</strong> {contratacao.modalidadeNome}
                            </p>
                            <p className="text-sm">
                              <strong>Modo de Disputa:</strong> {contratacao.modoDisputaNome}
                            </p>
                            <p className="text-sm">
                              <strong>Situação:</strong> {contratacao.situacaoCompraNome}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm">
                              <strong>Órgão:</strong> {contratacao.orgaoEntidade?.razaosocial}
                            </p>
                            <p className="text-sm">
                              <strong>CNPJ:</strong> {formatCnpj(contratacao.orgaoEntidade?.cnpj || '')}
                            </p>
                            <p className="text-sm">
                              <strong>UF:</strong> {contratacao.unidadeOrgao?.ufSigla}
                            </p>
                            <p className="text-sm">
                              <strong>Valor Estimado:</strong> {formatCurrency(contratacao.valorTotalEstimado || 0)}
                            </p>
                            <p className="text-sm">
                              <strong>Valor Homologado:</strong> {formatCurrency(contratacao.valorTotalHomologado || 0)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <strong>Abertura:</strong><br />
                              {contratacao.dataAberturaProposta ? formatDate(contratacao.dataAberturaProposta) : 'N/A'}
                            </div>
                            <div>
                              <strong>Encerramento:</strong><br />
                              {contratacao.dataEncerramentoProposta ? formatDate(contratacao.dataEncerramentoProposta) : 'N/A'}
                            </div>
                            <div>
                              <strong>Publicação:</strong><br />
                              {contratacao.dataPublicacaoPncp ? formatDate(contratacao.dataPublicacaoPncp) : 'N/A'}
                            </div>
                            <div>
                              <strong>SRP:</strong><br />
                              {contratacao.srp ? 'Sim' : 'Não'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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