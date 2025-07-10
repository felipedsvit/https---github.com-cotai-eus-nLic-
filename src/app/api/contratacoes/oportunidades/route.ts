import { NextRequest, NextResponse } from 'next/server'
import { pncpApiClient } from '@/lib/pncp-client'
import { prisma } from '@/lib/prisma'
import { OportunidadeAbertaParams } from '@/types/pncp'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate parameters
    const params: OportunidadeAbertaParams = {
      dataFinal: searchParams.get('dataFinal') || '',
      codigoModalidadeContratacao: Number(searchParams.get('codigoModalidadeContratacao')),
      uf: searchParams.get('uf') || undefined,
      codigoMunicipioIbge: searchParams.get('codigoMunicipioIbge') || undefined,
      cnpj: searchParams.get('cnpj') || undefined,
      codigoUnidadeAdministrativa: searchParams.get('codigoUnidadeAdministrativa') || undefined,
      idUsuario: searchParams.get('idUsuario') ? Number(searchParams.get('idUsuario')) : undefined,
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanhoPagina: Number(searchParams.get('tamanhoPagina')) || 50,
    }

    // Validate required parameters
    if (!params.dataFinal || !params.codigoModalidadeContratacao) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: dataFinal, codigoModalidadeContratacao' },
        { status: 400 }
      )
    }

    // Validate date format (AAAAMMDD)
    const dateRegex = /^\d{8}$/
    if (!dateRegex.test(params.dataFinal)) {
      return NextResponse.json(
        { error: 'Formato de data inválido. Use AAAAMMDD (ex: 20231201)' },
        { status: 400 }
      )
    }

    // Call PNCP API
    const response = await pncpApiClient.getOportunidadesAbertas(params)
    
    // Store API response metadata
    await prisma.apiResponseMetadata.create({
      data: {
        endpoint: '6.4',
        requestParams: params as any,
        totalRegistros: response.totalRegistros,
        totalPaginas: response.totalPaginas,
        numeroPagina: response.numeroPagina,
        paginasRestantes: response.paginasRestantes,
        empty: response.empty,
        responseTime: new Date(),
      },
    })

    // Store individual opportunities
    for (const oportunidade of response.data) {
      await prisma.oportunidadeAberta.upsert({
        where: { numeroControlePNCP: oportunidade.numeroControlePNCP },
        update: {
          numeroCompra: oportunidade.numeroCompra,
          anoCompra: oportunidade.anoCompra,
          processo: oportunidade.processo,
          tipoInstrumentoConvocatorioId: oportunidade.tipoInstrumentoConvocatorioCodigo,
          tipoInstrumentoConvocatorioNome: oportunidade.tipoInstrumentoConvocatorioNome,
          modalidadeId: oportunidade.modalidadeId,
          modalidadeNome: oportunidade.modalidadeNome,
          modoDisputaId: oportunidade.modoDisputaId,
          modoDisputaNome: oportunidade.modoDisputaNome,
          situacaoCompraId: oportunidade.situacaoCompraId,
          situacaoCompraNome: oportunidade.situacaoCompraNome,
          objetoCompra: oportunidade.objetoCompra,
          informacaoComplementar: oportunidade.informacaoComplementar,
          srp: oportunidade.srp,
          amparoLegalCodigo: oportunidade.amparoLegal?.codigo,
          amparoLegalNome: oportunidade.amparoLegal?.nome,
          amparoLegalDescricao: oportunidade.amparoLegal?.descricao,
          valorTotalEstimado: oportunidade.valorTotalEstimado,
          valorTotalHomologado: oportunidade.valorTotalHomologado,
          dataAberturaProposta: oportunidade.dataAberturaProposta ? new Date(oportunidade.dataAberturaProposta) : null,
          dataEncerramentoProposta: oportunidade.dataEncerramentoProposta ? new Date(oportunidade.dataEncerramentoProposta) : null,
          dataPublicacaoPncp: oportunidade.dataPublicacaoPncp ? new Date(oportunidade.dataPublicacaoPncp) : null,
          dataInclusao: oportunidade.dataInclusao ? new Date(oportunidade.dataInclusao) : null,
          dataAtualizacao: oportunidade.dataAtualizacao ? new Date(oportunidade.dataAtualizacao) : null,
          sequencialCompra: oportunidade.sequencialCompra,
          orgaoEntidadeCnpj: oportunidade.orgaoEntidade?.cnpj,
          orgaoEntidadeRazaoSocial: oportunidade.orgaoEntidade?.razaosocial,
          orgaoEntidadePoderId: oportunidade.orgaoEntidade?.poderId,
          orgaoEntidadeEsferaId: oportunidade.orgaoEntidade?.esferaId,
          unidadeOrgaoCodigoUnidade: oportunidade.unidadeOrgao?.codigoUnidade,
          unidadeOrgaoNomeUnidade: oportunidade.unidadeOrgao?.nomeUnidade,
          unidadeOrgaoCodigoIbge: oportunidade.unidadeOrgao?.codigoIbge,
          unidadeOrgaoMunicipioNome: oportunidade.unidadeOrgao?.municipioNome,
          unidadeOrgaoUfSigla: oportunidade.unidadeOrgao?.ufSigla,
          unidadeOrgaoUfNome: oportunidade.unidadeOrgao?.ufNome,
          orgaoSubRogadoCnpj: oportunidade.orgaoSubRogado?.cnpj,
          orgaoSubRogadoRazaoSocial: oportunidade.orgaoSubRogado?.razaosocial,
          orgaoSubRogadoPoderId: oportunidade.orgaoSubRogado?.poderId,
          orgaoSubRogadoEsferaId: oportunidade.orgaoSubRogado?.esferaId,
          unidadeSubRogadaCodigoUnidade: oportunidade.unidadeSubRogada?.codigoUnidade,
          unidadeSubRogadaNomeUnidade: oportunidade.unidadeSubRogada?.nomeUnidade,
          unidadeSubRogadaCodigoIbge: oportunidade.unidadeSubRogada?.codigoIbge,
          unidadeSubRogadaMunicipioNome: oportunidade.unidadeSubRogada?.municipioNome,
          unidadeSubRogadaUfSigla: oportunidade.unidadeSubRogada?.ufSigla,
          unidadeSubRogadaUfNome: oportunidade.unidadeSubRogada?.ufNome,
          usuarioNome: oportunidade.usuarioNome,
          linkSistemaOrigem: oportunidade.linkSistemaOrigem,
          justificativaPresencial: oportunidade.justificativaPresencial,
          rawData: oportunidade as any,
        },
        create: {
          numeroControlePNCP: oportunidade.numeroControlePNCP,
          numeroCompra: oportunidade.numeroCompra,
          anoCompra: oportunidade.anoCompra,
          processo: oportunidade.processo,
          tipoInstrumentoConvocatorioId: oportunidade.tipoInstrumentoConvocatorioCodigo,
          tipoInstrumentoConvocatorioNome: oportunidade.tipoInstrumentoConvocatorioNome,
          modalidadeId: oportunidade.modalidadeId,
          modalidadeNome: oportunidade.modalidadeNome,
          modoDisputaId: oportunidade.modoDisputaId,
          modoDisputaNome: oportunidade.modoDisputaNome,
          situacaoCompraId: oportunidade.situacaoCompraId,
          situacaoCompraNome: oportunidade.situacaoCompraNome,
          objetoCompra: oportunidade.objetoCompra,
          informacaoComplementar: oportunidade.informacaoComplementar,
          srp: oportunidade.srp,
          amparoLegalCodigo: oportunidade.amparoLegal?.codigo,
          amparoLegalNome: oportunidade.amparoLegal?.nome,
          amparoLegalDescricao: oportunidade.amparoLegal?.descricao,
          valorTotalEstimado: oportunidade.valorTotalEstimado,
          valorTotalHomologado: oportunidade.valorTotalHomologado,
          dataAberturaProposta: oportunidade.dataAberturaProposta ? new Date(oportunidade.dataAberturaProposta) : null,
          dataEncerramentoProposta: oportunidade.dataEncerramentoProposta ? new Date(oportunidade.dataEncerramentoProposta) : null,
          dataPublicacaoPncp: oportunidade.dataPublicacaoPncp ? new Date(oportunidade.dataPublicacaoPncp) : null,
          dataInclusao: oportunidade.dataInclusao ? new Date(oportunidade.dataInclusao) : null,
          dataAtualizacao: oportunidade.dataAtualizacao ? new Date(oportunidade.dataAtualizacao) : null,
          sequencialCompra: oportunidade.sequencialCompra,
          orgaoEntidadeCnpj: oportunidade.orgaoEntidade?.cnpj,
          orgaoEntidadeRazaoSocial: oportunidade.orgaoEntidade?.razaosocial,
          orgaoEntidadePoderId: oportunidade.orgaoEntidade?.poderId,
          orgaoEntidadeEsferaId: oportunidade.orgaoEntidade?.esferaId,
          unidadeOrgaoCodigoUnidade: oportunidade.unidadeOrgao?.codigoUnidade,
          unidadeOrgaoNomeUnidade: oportunidade.unidadeOrgao?.nomeUnidade,
          unidadeOrgaoCodigoIbge: oportunidade.unidadeOrgao?.codigoIbge,
          unidadeOrgaoMunicipioNome: oportunidade.unidadeOrgao?.municipioNome,
          unidadeOrgaoUfSigla: oportunidade.unidadeOrgao?.ufSigla,
          unidadeOrgaoUfNome: oportunidade.unidadeOrgao?.ufNome,
          orgaoSubRogadoCnpj: oportunidade.orgaoSubRogado?.cnpj,
          orgaoSubRogadoRazaoSocial: oportunidade.orgaoSubRogado?.razaosocial,
          orgaoSubRogadoPoderId: oportunidade.orgaoSubRogado?.poderId,
          orgaoSubRogadoEsferaId: oportunidade.orgaoSubRogado?.esferaId,
          unidadeSubRogadaCodigoUnidade: oportunidade.unidadeSubRogada?.codigoUnidade,
          unidadeSubRogadaNomeUnidade: oportunidade.unidadeSubRogada?.nomeUnidade,
          unidadeSubRogadaCodigoIbge: oportunidade.unidadeSubRogada?.codigoIbge,
          unidadeSubRogadaMunicipioNome: oportunidade.unidadeSubRogada?.municipioNome,
          unidadeSubRogadaUfSigla: oportunidade.unidadeSubRogada?.ufSigla,
          unidadeSubRogadaUfNome: oportunidade.unidadeSubRogada?.ufNome,
          usuarioNome: oportunidade.usuarioNome,
          linkSistemaOrigem: oportunidade.linkSistemaOrigem,
          justificativaPresencial: oportunidade.justificativaPresencial,
          rawData: oportunidade as any,
        },
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in oportunidades route:', error)
    
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