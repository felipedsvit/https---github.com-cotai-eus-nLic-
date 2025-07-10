// Domain tables data from manual.md

export const MODALIDADES_CONTRATACAO = [
  { id: 1, nome: 'Leilão - Eletrônico' },
  { id: 2, nome: 'Diálogo Competitivo' },
  { id: 3, nome: 'Concurso' },
  { id: 4, nome: 'Concorrência - Eletrônica' },
  { id: 5, nome: 'Concorrência - Presencial' },
  { id: 6, nome: 'Pregão - Eletrônico' },
  { id: 7, nome: 'Pregão - Presencial' },
  { id: 8, nome: 'Dispensa de Licitação' },
  { id: 9, nome: 'Inexigibilidade' },
  { id: 10, nome: 'Manifestação de Interesse' },
  { id: 11, nome: 'Pré-qualificação' },
  { id: 12, nome: 'Credenciamento' },
  { id: 13, nome: 'Leilão - Presencial' },
] as const

export const MODOS_DISPUTA = [
  { id: 1, nome: 'Aberto' },
  { id: 2, nome: 'Fechado' },
  { id: 3, nome: 'Aberto-Fechado' },
  { id: 4, nome: 'Dispensa Com Disputa' },
  { id: 5, nome: 'Não se aplica' },
  { id: 6, nome: 'Fechado-Aberto' },
] as const

export const SITUACOES_CONTRATACAO = [
  { id: 1, nome: 'Divulgada no PNCP' },
  { id: 2, nome: 'Revogada' },
  { id: 3, nome: 'Anulada' },
  { id: 4, nome: 'Suspensa' },
] as const

export const ESTADOS_BRASIL = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' },
] as const

export const PNCP_API_ENDPOINTS = {
  CONTRATACOES_PUBLICACAO: '/v1/contratacoes/publicacao',
  CONTRATACOES_PROPOSTAS: '/v1/contratacoes/proposta',
  ATAS_REGISTRO_PRECO: '/v1/atas',
} as const

export const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 500