import { 
  PncpApiResponse, 
  ContratacaoHistorico, 
  OportunidadeAberta,
  AtaRegistroPreco,
  ContratacaoHistoricoParams,
  OportunidadeAbertaParams,
  AtaRegistroPrecoParams
} from '@/types/pncp'
import { PNCP_API_ENDPOINTS } from './constants'

export class PncpApiClient {
  private baseUrl: string

  constructor(baseUrl: string = process.env.PNCP_API_BASE_URL || 'https://pncp.gov.br/api/consulta') {
    this.baseUrl = baseUrl
  }

  private async makeRequest<T>(endpoint: string, params: any): Promise<PncpApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl)
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new PncpApiError(
          response.status,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.details
        )
      }

      const data = await response.json()
      return data as PncpApiResponse<T>
    } catch (error) {
      if (error instanceof PncpApiError) {
        throw error
      }
      
      // Handle network errors
      throw new PncpApiError(
        500,
        'Erro de conexão com a API do PNCP',
        error instanceof Error ? error.message : 'Erro desconhecido'
      )
    }
  }

  async getContratacaoHistorico(params: ContratacaoHistoricoParams): Promise<PncpApiResponse<ContratacaoHistorico>> {
    return this.makeRequest<ContratacaoHistorico>(PNCP_API_ENDPOINTS.CONTRATACOES_PUBLICACAO, params)
  }

  async getOportunidadesAbertas(params: OportunidadeAbertaParams): Promise<PncpApiResponse<OportunidadeAberta>> {
    return this.makeRequest<OportunidadeAberta>(PNCP_API_ENDPOINTS.CONTRATACOES_PROPOSTAS, params)
  }

  async getAtasRegistroPreco(params: AtaRegistroPrecoParams): Promise<PncpApiResponse<AtaRegistroPreco>> {
    return this.makeRequest<AtaRegistroPreco>(PNCP_API_ENDPOINTS.ATAS_REGISTRO_PRECO, params)
  }
}

export class PncpApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'PncpApiError'
  }
}

export const pncpApiClient = new PncpApiClient()