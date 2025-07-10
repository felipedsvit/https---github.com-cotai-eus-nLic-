import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const situacoes = await prisma.situacaoContratacao.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(situacoes)
  } catch (error) {
    console.error('Error fetching situações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar situações de contratação' },
      { status: 500 }
    )
  }
}