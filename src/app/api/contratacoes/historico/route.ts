import { NextRequest, NextResponse } from 'next/server'
import { pncpApiClient } from '@/lib/pncp-client'
import { prisma } from '@/lib/prisma'
import { ContratacaoHistoricoParams } from '@/types/pncp'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate parameters
    const params: ContratacaoHistoricoParams = {
      dataInicial: searchParams.get('dataInicial') || '',
      dataFinal: searchParams.get('dataFinal') || '',
      codigoModalidadeContratacao: Number(searchParams.get('codigoModalidadeContratacao')),
      codigoModoDisputa: searchParams.get('codigoModoDisputa') ? Number(searchParams.get('codigoModoDisputa')) : undefined,
      uf: searchParams.get('uf') || undefined,
      codigoMunicipioIbge: searchParams.get('codigoMunicipioIbge') || undefined,
      cnpj: searchParams.get('cnpj') || undefined,
      codigoUnidadeAdministrativa: searchParams.get('codigoUnidadeAdministrativa') || undefined,
      idUsuario: searchParams.get('idUsuario') ? Number(searchParams.get('idUsuario')) : undefined,
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanhoPagina: Number(searchParams.get('tamanhoPagina')) || 50,
    }

    // Validate required parameters
    if (!params.dataInicial || !params.dataFinal || !params.codigoModalidadeContratacao) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: dataInicial, dataFinal, codigoModalidadeContratacao' },
        { status: 400 }
      )
    }

    // Validate date format (AAAAMMDD)
    const dateRegex = /^\d{8}$/
    if (!dateRegex.test(params.dataInicial) || !dateRegex.test(params.dataFinal)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use AAAAMMDD (ex: 20231201)' },
        { status: 400 }
      )
    }

    // Call PNCP API
    const response = await pncpApiClient.getContratacaoHistorico(params)
    
    // Store API response metadata
    await prisma.apiResponseMetadata.create({
      data: {
        endpoint: '6.3',
        requestParams: params as any,
        totalRegistros: response.totalRegistros,
        totalPaginas: response.totalPaginas,
        numeroPagina: response.numeroPagina,
        paginasRestantes: response.paginasRestantes,
        empty: response.empty,
        responseTime: new Date(),
      },
    })

    // Store individual contracts
    for (const contrato of response.data) {
      await prisma.contratacao.upsert({
        where: { numeroControlePNCP: contrato.numeroControlePNCP },
        update: {
          numeroCompra: contrato.numeroCompra,
          anoCompra: contrato.anoCompra,
          processo: contrato.processo,
          tipoInstrumentoConvocatorioId: contrato.tipoInstrumentoConvocatorioCodigo,
          tipoInstrumentoConvocatorioNome: contrato.tipoInstrumentoConvocatorioNome,
          modalidadeId: contrato.modalidadeId,
          modalidadeNome: contrato.modalidadeNome,
          modoDisputaId: contrato.modoDisputaId,
          modoDisputaNome: contrato.modoDisputaNome,
          situacaoCompraId: contrato.situacaoCompraId,
          situacaoCompraNome: contrato.situacaoCompraNome,
          objetoCompra: contrato.objetoCompra,
          informacaoComplementar: contrato.informacaoComplementar,
          srp: contrato.srp,
          amparoLegalCodigo: contrato.amparoLegal?.codigo,
          amparoLegalNome: contrato.amparoLegal?.nome,
          amparoLegalDescricao: contrato.amparoLegal?.descricao,
          valorTotalEstimado: contrato.valorTotalEstimado,
          valorTotalHomologado: contrato.valorTotalHomologado,
          dataAberturaProposta: contrato.dataAberturaProposta ? new Date(contrato.dataAberturaProposta) : null,
          dataEncerramentoProposta: contrato.dataEncerramentoProposta ? new Date(contrato.dataEncerramentoProposta) : null,
          dataPublicacaoPncp: contrato.dataPublicacaoPncp ? new Date(contrato.dataPublicacaoPncp) : null,
          dataInclusao: contrato.dataInclusao ? new Date(contrato.dataInclusao) : null,
          dataAtualizacao: contrato.dataAtualizacao ? new Date(contrato.dataAtualizacao) : null,
          sequencialCompra: contrato.sequencialCompra,
          orgaoEntidadeCnpj: contrato.orgaoEntidade?.cnpj,
          orgaoEntidadeRazaoSocial: contrato.orgaoEntidade?.razaosocial,
          orgaoEntidadePoderId: contrato.orgaoEntidade?.poderId,
          orgaoEntidadeEsferaId: contrato.orgaoEntidade?.esferaId,
          unidadeOrgaoCodigoUnidade: contrato.unidadeOrgao?.codigoUnidade,
          unidadeOrgaoNomeUnidade: contrato.unidadeOrgao?.nomeUnidade,
          unidadeOrgaoCodigoIbge: contrato.unidadeOrgao?.codigoIbge,
          unidadeOrgaoMunicipioNome: contrato.unidadeOrgao?.municipioNome,
          unidadeOrgaoUfSigla: contrato.unidadeOrgao?.ufSigla,
          unidadeOrgaoUfNome: contrato.unidadeOrgao?.ufNome,
          orgaoSubRogadoCnpj: contrato.orgaoSubRogado?.cnpj,
          orgaoSubRogadoRazaoSocial: contrato.orgaoSubRogado?.razaosocial,
          orgaoSubRogadoPoderId: contrato.orgaoSubRogado?.poderId,
          orgaoSubRogadoEsferaId: contrato.orgaoSubRogado?.esferaId,
          unidadeSubRogadaCodigoUnidade: contrato.unidadeSubRogada?.codigoUnidade,
          unidadeSubRogadaNomeUnidade: contrato.unidadeSubRogada?.nomeUnidade,
          unidadeSubRogadaCodigoIbge: contrato.unidadeSubRogada?.codigoIbge,
          unidadeSubRogadaMunicipioNome: contrato.unidadeSubRogada?.municipioNome,
          unidadeSubRogadaUfSigla: contrato.unidadeSubRogada?.ufSigla,
          unidadeSubRogadaUfNome: contrato.unidadeSubRogada?.ufNome,
          usuarioNome: contrato.usuarioNome,
          linkSistemaOrigem: contrato.linkSistemaOrigem,
          justificativaPresencial: contrato.justificativaPresencial,
          rawData: contrato as any,
        },
        create: {
          numeroControlePNCP: contrato.numeroControlePNCP,
          numeroCompra: contrato.numeroCompra,
          anoCompra: contrato.anoCompra,
          processo: contrato.processo,
          tipoInstrumentoConvocatorioId: contrato.tipoInstrumentoConvocatorioCodigo,
          tipoInstrumentoConvocatorioNome: contrato.tipoInstrumentoConvocatorioNome,
          modalidadeId: contrato.modalidadeId,
          modalidadeNome: contrato.modalidadeNome,
          modoDisputaId: contrato.modoDisputaId,
          modoDisputaNome: contrato.modoDisputaNome,
          situacaoCompraId: contrato.situacaoCompraId,
          situacaoCompraNome: contrato.situacaoCompraNome,
          objetoCompra: contrato.objetoCompra,
          informacaoComplementar: contrato.informacaoComplementar,
          srp: contrato.srp,
          amparoLegalCodigo: contrato.amparoLegal?.codigo,
          amparoLegalNome: contrato.amparoLegal?.nome,
          amparoLegalDescricao: contrato.amparoLegal?.descricao,
          valorTotalEstimado: contrato.valorTotalEstimado,
          valorTotalHomologado: contrato.valorTotalHomologado,
          dataAberturaProposta: contrato.dataAberturaProposta ? new Date(contrato.dataAberturaProposta) : null,
          dataEncerramentoProposta: contrato.dataEncerramentoProposta ? new Date(contrato.dataEncerramentoProposta) : null,
          dataPublicacaoPncp: contrato.dataPublicacaoPncp ? new Date(contrato.dataPublicacaoPncp) : null,
          dataInclusao: contrato.dataInclusao ? new Date(contrato.dataInclusao) : null,
          dataAtualizacao: contrato.dataAtualizacao ? new Date(contrato.dataAtualizacao) : null,
          sequencialCompra: contrato.sequencialCompra,
          orgaoEntidadeCnpj: contrato.orgaoEntidade?.cnpj,
          orgaoEntidadeRazaoSocial: contrato.orgaoEntidade?.razaosocial,
          orgaoEntidadePoderId: contrato.orgaoEntidade?.poderId,
          orgaoEntidadeEsferaId: contrato.orgaoEntidade?.esferaId,
          unidadeOrgaoCodigoUnidade: contrato.unidadeOrgao?.codigoUnidade,
          unidadeOrgaoNomeUnidade: contrato.unidadeOrgao?.nomeUnidade,
          unidadeOrgaoCodigoIbge: contrato.unidadeOrgao?.codigoIbge,
          unidadeOrgaoMunicipioNome: contrato.unidadeOrgao?.municipioNome,
          unidadeOrgaoUfSigla: contrato.unidadeOrgao?.ufSigla,
          unidadeOrgaoUfNome: contrato.unidadeOrgao?.ufNome,
          orgaoSubRogadoCnpj: contrato.orgaoSubRogado?.cnpj,
          orgaoSubRogadoRazaoSocial: contrato.orgaoSubRogado?.razaosocial,
          orgaoSubRogadoPoderId: contrato.orgaoSubRogado?.poderId,
          orgaoSubRogadoEsferaId: contrato.orgaoSubRogado?.esferaId,
          unidadeSubRogadaCodigoUnidade: contrato.unidadeSubRogada?.codigoUnidade,
          unidadeSubRogadaNomeUnidade: contrato.unidadeSubRogada?.nomeUnidade,
          unidadeSubRogadaCodigoIbge: contrato.unidadeSubRogada?.codigoIbge,
          unidadeSubRogadaMunicipioNome: contrato.unidadeSubRogada?.municipioNome,
          unidadeSubRogadaUfSigla: contrato.unidadeSubRogada?.ufSigla,
          unidadeSubRogadaUfNome: contrato.unidadeSubRogada?.ufNome,
          usuarioNome: contrato.usuarioNome,
          linkSistemaOrigem: contrato.linkSistemaOrigem,
          justificativaPresencial: contrato.justificativaPresencial,
          rawData: contrato as any,
        },
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in historico route:', error)
    
    if (error instanceof Error && error.name === 'PncpApiError') {
      return NextResponse.json(
        { error: error.message },
        { status: (error as any).status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}