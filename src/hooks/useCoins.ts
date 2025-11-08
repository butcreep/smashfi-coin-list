'use client'

import { useQuery } from '@tanstack/react-query'
import { CoinData } from '@/lib/types'

async function fetchCoins(): Promise<CoinData[]> {
  const response = await fetch('/api/coins')
  if (!response.ok) {
    throw new Error('Failed to fetch coins')
  }
  return response.json()
}

export function useCoins() {
  return useQuery({
    queryKey: ['coins'],
    queryFn: fetchCoins,
    staleTime: 2000,
    refetchInterval: 2000,
  })
}
