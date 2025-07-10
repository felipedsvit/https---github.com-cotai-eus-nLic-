import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modalidades = await prisma.modalidadeContratacao.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(modalidades)
  } catch (error) {
    console.error('Error fetching modalidades:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar modalidades de contratação' },
      { status: 500 }
    )
  }
}