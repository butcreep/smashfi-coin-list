import { NextResponse } from 'next/server'

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

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false',
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch coin data')
    }

    const data: CoinData[] = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching coins:', error)

    // Fallback to mock data if API fails
    const mockData: CoinData[] = [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 50000,
        price_change_percentage_24h: 2.5,
        total_volume: 30000000000,
        market_cap: 950000000000,
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3000,
        price_change_percentage_24h: -1.2,
        total_volume: 15000000000,
        market_cap: 360000000000,
      },
      {
        id: 'binancecoin',
        symbol: 'bnb',
        name: 'BNB',
        image: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
        current_price: 400,
        price_change_percentage_24h: 0.8,
        total_volume: 1500000000,
        market_cap: 60000000000,
      },
    ]

    return NextResponse.json(mockData)
  }
}
