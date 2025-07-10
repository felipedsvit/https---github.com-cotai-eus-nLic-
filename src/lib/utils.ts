import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToPncp(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export function parsePncpDate(dateString: string): Date {
  if (!dateString) return new Date()
  
  // Handle AAAAMMDD format
  if (dateString.length === 8) {
    const year = parseInt(dateString.substring(0, 4))
    const month = parseInt(dateString.substring(4, 6)) - 1
    const day = parseInt(dateString.substring(6, 8))
    return new Date(year, month, day)
  }
  
  // Handle ISO format
  return new Date(dateString)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatCnpj(cnpj: string): string {
  if (!cnpj) return ''
  
  // Remove any non-digit characters
  const digits = cnpj.replace(/\D/g, '')
  
  // Format as XX.XXX.XXX/XXXX-XX
  if (digits.length === 14) {
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12, 14)}`
  }
  
  return cnpj
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('pt-BR')
}

export function validateCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  
  if (digits.length !== 14) return false
  
  // Check for known invalid CNPJs
  if (/^(\d)\1{13}$/.test(digits)) return false
  
  // Validate check digits
  let sum = 0
  let weight = 2
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(digits[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const remainder = sum % 11
  const checkDigit1 = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(digits[12]) !== checkDigit1) return false
  
  sum = 0
  weight = 2
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(digits[i]) * weight
    weight = weight === 9 ? 2 : weight + 1
  }
  
  const remainder2 = sum % 11
  const checkDigit2 = remainder2 < 2 ? 0 : 11 - remainder2
  
  return parseInt(digits[13]) === checkDigit2
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}