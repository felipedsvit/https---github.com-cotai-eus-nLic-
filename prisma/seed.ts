import { PrismaClient } from '@prisma/client'
import { MODALIDADES_CONTRATACAO, MODOS_DISPUTA, SITUACOES_CONTRATACAO } from '../src/lib/constants'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Seed Modalidades de Contratação
  console.log('Seeding modalidades de contratação...')
  for (const modalidade of MODALIDADES_CONTRATACAO) {
    await prisma.modalidadeContratacao.upsert({
      where: { id: modalidade.id },
      update: { nome: modalidade.nome },
      create: {
        id: modalidade.id,
        nome: modalidade.nome,
      },
    })
  }

  // Seed Modos de Disputa
  console.log('Seeding modos de disputa...')
  for (const modo of MODOS_DISPUTA) {
    await prisma.modoDisputa.upsert({
      where: { id: modo.id },
      update: { nome: modo.nome },
      create: {
        id: modo.id,
        nome: modo.nome,
      },
    })
  }

  // Seed Situações de Contratação
  console.log('Seeding situações de contratação...')
  for (const situacao of SITUACOES_CONTRATACAO) {
    await prisma.situacaoContratacao.upsert({
      where: { id: situacao.id },
      update: { nome: situacao.nome },
      create: {
        id: situacao.id,
        nome: situacao.nome,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })