import { PrismaClient } from '@prisma/client'
import { pncpApiClient } from '../lib/pncp-client'
import { formatDateToPncp } from '../lib/utils'

const prisma = new PrismaClient()

class PncpWorker {
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  async start() {
    if (this.isRunning) {
      console.log('Worker is already running')
      return
    }

    this.isRunning = true
    console.log('Starting PNCP Worker...')

    // Run immediately on start
    await this.runSyncJob()

    // Schedule to run every hour
    this.intervalId = setInterval(async () => {
      await this.runSyncJob()
    }, 60 * 60 * 1000) // 1 hour

    console.log('PNCP Worker started successfully')
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('PNCP Worker stopped')
  }

  private async runSyncJob() {
    console.log('Running PNCP sync job...')
    
    try {
      // Example: Sync open opportunities for the most common modalities
      const today = new Date()
      const dataFinal = formatDateToPncp(today)
      
      // Get active modalities
      const modalidades = await prisma.modalidadeContratacao.findMany({
        where: { ativo: true },
        take: 5 // Limit to first 5 to avoid rate limiting
      })

      for (const modalidade of modalidades) {
        try {
          console.log(`Syncing opportunities for modalidade: ${modalidade.nome}`)
          
          const response = await pncpApiClient.getOportunidadesAbertas({
            dataFinal,
            codigoModalidadeContratacao: modalidade.id,
            pagina: 1,
            tamanhoPagina: 50
          })

          // Store metadata
          await prisma.apiResponseMetadata.create({
            data: {
              endpoint: '6.4-worker',
              requestParams: {
                dataFinal,
                codigoModalidadeContratacao: modalidade.id,
                pagina: 1,
                tamanhoPagina: 50
              },
              totalRegistros: response.totalRegistros,
              totalPaginas: response.totalPaginas,
              numeroPagina: response.numeroPagina,
              paginasRestantes: response.paginasRestantes,
              empty: response.empty,
              responseTime: new Date(),
            },
          })

          console.log(`Synced ${response.data.length} opportunities for ${modalidade.nome}`)
          
          // Add delay between requests to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error syncing modalidade ${modalidade.nome}:`, error)
        }
      }

      console.log('PNCP sync job completed')
    } catch (error) {
      console.error('Error in sync job:', error)
    }
  }
}

// Start the worker
const worker = new PncpWorker()

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, stopping worker...')
  await worker.stop()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, stopping worker...')
  await worker.stop()
  await prisma.$disconnect()
  process.exit(0)
})

// Start the worker
worker.start().catch((error) => {
  console.error('Failed to start worker:', error)
  process.exit(1)
})