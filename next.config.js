/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PNCP_API_BASE_URL: process.env.PNCP_API_BASE_URL || 'https://pncp.gov.br/api/consulta',
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig