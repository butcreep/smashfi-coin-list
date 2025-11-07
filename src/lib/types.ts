export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  total_volume: number
  market_cap: number
}

export type SortField = 'current_price' | 'price_change_percentage_24h' | 'total_volume' | 'market_cap'
export type SortOrder = 'asc' | 'desc'
export type TabType = 'all' | 'favorite'
