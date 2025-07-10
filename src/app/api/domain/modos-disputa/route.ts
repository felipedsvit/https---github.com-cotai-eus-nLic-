import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modos = await prisma.modoDisputa.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
    })

    return NextResponse.json(modos)
  } catch (error) {
    console.error('Error fetching modos de disputa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar modos de disputa' },
      { status: 500 }
    )
  }
}