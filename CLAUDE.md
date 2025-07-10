# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js web application that serves as a supplier portal for Brazil's PNCP (Portal Nacional de Contratações Públicas). The application integrates with PNCP APIs to provide three main modules:

1. **Oportunidades Abertas** (Open Opportunities) - API 6.4
2. **Histórico de Contratações** (Contract History) - API 6.3  
3. **Consulta de Atas de Preço** (Price Record Consultation) - API 6.5

## Project Initialization

To create this project from scratch:

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest nlic --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Or with yarn
yarn create next-app nlic --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
npm install @prisma/client prisma
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

## Architecture

### Application Stack
- **Frontend**: Next.js 14+ with React and TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes (BFF pattern)
- **Database**: PostgreSQL with Prisma ORM
- **Background Worker**: Synchronization service for periodic API polling

### Docker Architecture
The application uses a multi-container Docker setup:

- **app-container**: Next.js application (frontend + API routes)
- **postgres-container**: PostgreSQL database
- **worker-container**: Background sync service for PNCP APIs
- **nginx-container**: Reverse proxy (production only)

### Container Structure
```
├── Dockerfile (main app)
├── docker-compose.yml (development)
├── docker-compose.prod.yml (production)
├── worker/
│   └── Dockerfile (background worker)
└── nginx/
    └── nginx.conf (reverse proxy)
```

## Key Technical Requirements

### Data Persistence Strategy
- **Complete Data Storage**: All API responses must be stored in full, including metadata and pagination info
- **Code Translation**: Background worker translates codes to human-readable text using domain tables
- **Traceability**: All received data must be preserved for audit and advanced queries

### API Integration Points
- **API 6.3**: Contract history with date ranges, modality filters
- **API 6.4**: Open opportunities with final date and modality requirements  
- **API 6.5**: Price record consultation with date ranges

### Date Format Requirements
- All dates must be in AAAAMMDD format when communicating with PNCP APIs
- Frontend should handle date conversion for user-friendly display

### Domain Tables (from manual.md)
- Modalidade de Contratação (5.2)
- Modo de Disputa (5.3) 
- Situação da Contratação (5.5)
- Other domain tables as specified in sections 5.1-5.17

### Pagination Handling
- Support up to 500 records per page
- Store pagination metadata: totalRegistros, totalPaginas, numeroPagina, paginasRestantes, empty

## Development Commands

### Essential Commands
```bash
# Development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or  
yarn build

# Run linting
npm run lint
# or
yarn lint

# Run tests (when implemented)
npm run test
# or
yarn test

# Database operations
npx prisma generate          # Generate Prisma client
npx prisma db push          # Push schema to database
npx prisma studio           # Open database browser
```

### Docker Commands
```bash
# Start all services (development)
docker-compose up -d

# Build and start services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Setup
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `PNCP_API_BASE_URL`: PNCP API base URL
- `NEXT_PUBLIC_APP_URL`: Application URL for frontend

## Development Notes

- Reference `manual.md` for complete API specifications and domain tables
- Reference `plano.md` for detailed module requirements and field mappings
- Error handling must address HTTP codes 400, 422, 500 with clear user messages
- All API responses include specific field IDs that must be preserved in database schema
- Use Prisma for database operations and migrations
- Follow the BFF pattern: frontend calls Next.js API routes, which then call PNCP APIs
- Implement proper error boundaries and loading states for all API calls