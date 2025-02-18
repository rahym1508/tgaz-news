import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

export function isApiError(error: unknown): error is { 
  status: number 
  message: string 
} {
  return (
    typeof error === 'object' && 
    error !== null && 
    'status' in error && 
    'message' in error
  )
}

export function formatDate(date: string | Date | null | undefined, locale = 'ru-RU'): string {
  if (!date) return 'No date'
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
