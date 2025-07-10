// PNCP API Response Types

export interface PaginationMetadata {
  totalRegistros: number
  totalPaginas: number
  numeroPagina: number
  paginasRestantes: number
  empty: boolean
}

export interface PncpApiResponse<T> {
  data: T[]
  totalRegistros: number
  totalPaginas: number
  numeroPagina: number
  paginasRestantes: number
  empty: boolean
}

// API 6.3 - Histórico de Contratações
export interface ContratacaoHistorico {
  numeroControlePNCP: string
  numeroCompra: string
  anoCompra: number
  processo: string
  tipoInstrumentoConvocatorioCodigo: number
  tipoInstrumentoConvocatorioNome: string
  modalidadeId: number
  modalidadeNome: string
  modoDisputaId: number
  modoDisputaNome: string
  situacaoCompraId: number
  situacaoCompraNome: string
  objetoCompra: string
  informacaoComplementar: string
  srp: boolean
  amparoLegal: {
    codigo: number
    nome: string
    descricao: string
  }
  valorTotalEstimado: number
  valorTotalHomologado: number
  dataAberturaProposta: string
  dataEncerramentoProposta: string
  dataPublicacaoPncp: string
  dataInclusao: string
  dataAtualizacao: string
  sequencialCompra: number
  orgaoEntidade: {
    cnpj: string
    razaosocial: string
    poderId: string
    esferaId: string
  }
  unidadeOrgao: {
    codigoUnidade: string
    nomeUnidade: string
    codigoIbge: number
    municipioNome: string
    ufSigla: string
    ufNome: string
  }
  orgaoSubRogado?: {
    cnpj: string
    razaosocial: string
    poderId: string
    esferaId: string
  }
  unidadeSubRogada?: {
    codigoUnidade: string
    nomeUnidade: string
    codigoIbge: number
    municipioNome: string
    ufSigla: string
    ufNome: string
  }
  usuarioNome: string
  linkSistemaOrigem: string
  justificativaPresencial: string
}

// API 6.4 - Oportunidades Abertas
export interface OportunidadeAberta {
  numeroControlePNCP: string
  numeroCompra: string
  anoCompra: number
  processo: string
  tipoInstrumentoConvocatorioCodigo: number
  tipoInstrumentoConvocatorioNome: string
  modalidadeId: number
  modalidadeNome: string
  modoDisputaId: number
  modoDisputaNome: string
  situacaoCompraId: number
  situacaoCompraNome: string
  objetoCompra: string
  informacaoComplementar: string | null
  srp: boolean
  amparoLegal: {
    codigo: number
    nome: string
    descricao: string
  }
  valorTotalEstimado: number
  valorTotalHomologado: number | null
  dataAberturaProposta: string
  dataEncerramentoProposta: string
  dataPublicacaoPncp: string
  dataInclusao: string
  dataAtualizacao: string
  dataAtualizacaoGlobal: string
  sequencialCompra: number
  linkProcessoEletronico?: string | null
  fontesOrcamentarias: any[]
  orgaoEntidade: {
    cnpj: string
    razaosocial: string
    poderId: string
    esferaId: string
  }
  unidadeOrgao: {
    codigoUnidade: string
    nomeUnidade: string
    codigoIbge: number
    municipioNome: string
    ufSigla: string
    ufNome: string
  }
  orgaoSubRogado?: {
    cnpj: string
    razaosocial: string
    poderId: string
    esferaId: string
  } | null
  unidadeSubRogada?: {
    codigoUnidade: string
    nomeUnidade: string
    codigoIbge: number
    municipioNome: string
    ufSigla: string
    ufNome: string
  } | null
  usuarioNome: string
  linkSistemaOrigem: string | null
  justificativaPresencial: string | null
}

// API 6.5 - Atas de Registro de Preço
export interface AtaRegistroPreco {
  Atas: {
    numeroControlePNCPAta: string
    numeroControlePNCPCompra: string
    numeroAtaRegistroPreco: string
    anoAta: number
    dataAssinatura: string
    vigenciaInicio: string
    vigenciaFim: string
    dataCancelamento: string
    cancelado: boolean
    dataPublicacaoPncp: string
    dataInclusao: string
    dataAtualizacao: string
    objetoContratacao: string
    cnpjOrgao: string
    nomeOrgao: string
    codigoUnidadeOrgao: string
    nomeUnidadeOrgao: string
    cnpjOrgaoSubrogado: string
    nomeOrgaoSubrogado: string
    codigoUnidadeOrgaoSubrogado: string
    nomeUnidadeOrgaoSubrogado: string
    usuario: string
  }[]
}

// Search Parameters
export interface ContratacaoHistoricoParams {
  dataInicial: string // AAAAMMDD
  dataFinal: string // AAAAMMDD
  codigoModalidadeContratacao: number
  codigoModoDisputa?: number
  uf?: string
  codigoMunicipioIbge?: string
  cnpj?: string
  codigoUnidadeAdministrativa?: string
  idUsuario?: number
  pagina: number
  tamanhoPagina?: number
}

export interface OportunidadeAbertaParams {
  dataFinal: string // AAAAMMDD
  codigoModalidadeContratacao: number
  uf?: string
  codigoMunicipioIbge?: string
  cnpj?: string
  codigoUnidadeAdministrativa?: string
  idUsuario?: number
  pagina: number
  tamanhoPagina?: number
}

export interface AtaRegistroPrecoParams {
  dataInicial: string // AAAAMMDD
  dataFinal: string // AAAAMMDD
  idUsuario?: number
  cnpj?: string
  codigoUnidadeAdministrativa?: string
  pagina: number
  tamanhoPagina?: number
}

// Domain Types
export interface ModalidadeContratacao {
  id: number
  nome: string
}

export interface ModoDisputa {
  id: number
  nome: string
}

export interface SituacaoContratacao {
  id: number
  nome: string
}

// API Error Response
export interface PncpApiError {
  status: number
  message: string
  details?: string
}