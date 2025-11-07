import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { CoinData, SortField, SortOrder } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sortCoins(
  coins: CoinData[],
  field: SortField,
  order: SortOrder
): CoinData[] {
  return [...coins].sort((a, b) => {
    const aValue = a[field]
    const bValue = b[field]

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })
}

export function filterCoins(coins: CoinData[], searchTerm: string): CoinData[] {
  if (!searchTerm) return coins

  const lowerSearch = searchTerm.toLowerCase()
  return coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(lowerSearch) ||
      coin.symbol.toLowerCase().includes(lowerSearch)
  )
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  return formatCurrency(value)
}

export function formatPercentage(value: number): string {
  const formatted = Math.abs(value).toFixed(2)
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}
