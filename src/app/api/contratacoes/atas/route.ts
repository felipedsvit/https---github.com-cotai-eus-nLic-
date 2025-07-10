import { NextRequest, NextResponse } from 'next/server'
import { pncpApiClient } from '@/lib/pncp-client'
import { prisma } from '@/lib/prisma'
import { AtaRegistroPrecoParams } from '@/types/pncp'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract and validate parameters
    const params: AtaRegistroPrecoParams = {
      dataInicial: searchParams.get('dataInicial') || '',
      dataFinal: searchParams.get('dataFinal') || '',
      idUsuario: searchParams.get('idUsuario') ? Number(searchParams.get('idUsuario')) : undefined,
      cnpj: searchParams.get('cnpj') || undefined,
      codigoUnidadeAdministrativa: searchParams.get('codigoUnidadeAdministrativa') || undefined,
      pagina: Number(searchParams.get('pagina')) || 1,
      tamanhoPagina: Number(searchParams.get('tamanhoPagina')) || 50,
    }

    // Validate required parameters
    if (!params.dataInicial || !params.dataFinal) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: dataInicial, dataFinal' },
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
    const response = await pncpApiClient.getAtasRegistroPreco(params)
    
    // Store API response metadata
    await prisma.apiResponseMetadata.create({
      data: {
        endpoint: '6.5',
        requestParams: params as any,
        totalRegistros: response.totalRegistros,
        totalPaginas: response.totalPaginas,
        numeroPagina: response.numeroPagina,
        paginasRestantes: response.paginasRestantes,
        empty: response.empty,
        responseTime: new Date(),
      },
    })

    // Store individual atas
    for (const ataData of response.data) {
      // Handle the different structure of API 6.5
      if (ataData.Atas && Array.isArray(ataData.Atas)) {
        for (const ata of ataData.Atas) {
          await prisma.ataRegistroPreco.upsert({
            where: { numeroControlePNCPAta: ata.numeroControlePNCPAta },
            update: {
              numeroControlePNCPCompra: ata.numeroControlePNCPCompra,
              numeroAtaRegistroPreco: ata.numeroAtaRegistroPreco,
              anoAta: ata.anoAta,
              dataAssinatura: ata.dataAssinatura ? new Date(ata.dataAssinatura) : null,
              vigenciaInicio: ata.vigenciaInicio ? new Date(ata.vigenciaInicio) : null,
              vigenciaFim: ata.vigenciaFim ? new Date(ata.vigenciaFim) : null,
              dataCancelamento: ata.dataCancelamento ? new Date(ata.dataCancelamento) : null,
              cancelado: ata.cancelado,
              dataPublicacaoPncp: ata.dataPublicacaoPncp ? new Date(ata.dataPublicacaoPncp) : null,
              dataInclusao: ata.dataInclusao ? new Date(ata.dataInclusao) : null,
              dataAtualizacao: ata.dataAtualizacao ? new Date(ata.dataAtualizacao) : null,
              objetoContratacao: ata.objetoContratacao,
              cnpjOrgao: ata.cnpjOrgao,
              nomeOrgao: ata.nomeOrgao,
              codigoUnidadeOrgao: ata.codigoUnidadeOrgao,
              nomeUnidadeOrgao: ata.nomeUnidadeOrgao,
              cnpjOrgaoSubrogado: ata.cnpjOrgaoSubrogado,
              nomeOrgaoSubrogado: ata.nomeOrgaoSubrogado,
              codigoUnidadeOrgaoSubrogado: ata.codigoUnidadeOrgaoSubrogado,
              nomeUnidadeOrgaoSubrogado: ata.nomeUnidadeOrgaoSubrogado,
              usuario: ata.usuario,
              rawData: ata as any,
            },
            create: {
              numeroControlePNCPAta: ata.numeroControlePNCPAta,
              numeroControlePNCPCompra: ata.numeroControlePNCPCompra,
              numeroAtaRegistroPreco: ata.numeroAtaRegistroPreco,
              anoAta: ata.anoAta,
              dataAssinatura: ata.dataAssinatura ? new Date(ata.dataAssinatura) : null,
              vigenciaInicio: ata.vigenciaInicio ? new Date(ata.vigenciaInicio) : null,
              vigenciaFim: ata.vigenciaFim ? new Date(ata.vigenciaFim) : null,
              dataCancelamento: ata.dataCancelamento ? new Date(ata.dataCancelamento) : null,
              cancelado: ata.cancelado,
              dataPublicacaoPncp: ata.dataPublicacaoPncp ? new Date(ata.dataPublicacaoPncp) : null,
              dataInclusao: ata.dataInclusao ? new Date(ata.dataInclusao) : null,
              dataAtualizacao: ata.dataAtualizacao ? new Date(ata.dataAtualizacao) : null,
              objetoContratacao: ata.objetoContratacao,
              cnpjOrgao: ata.cnpjOrgao,
              nomeOrgao: ata.nomeOrgao,
              codigoUnidadeOrgao: ata.codigoUnidadeOrgao,
              nomeUnidadeOrgao: ata.nomeUnidadeOrgao,
              cnpjOrgaoSubrogado: ata.cnpjOrgaoSubrogado,
              nomeOrgaoSubrogado: ata.nomeOrgaoSubrogado,
              codigoUnidadeOrgaoSubrogado: ata.codigoUnidadeOrgaoSubrogado,
              nomeUnidadeOrgaoSubrogado: ata.nomeUnidadeOrgaoSubrogado,
              usuario: ata.usuario,
              rawData: ata as any,
            },
          })
        }
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in atas route:', error)
    
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