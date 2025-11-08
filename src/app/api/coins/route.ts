import { NextResponse } from 'next/server';
import { CoinData } from '@/lib/types';
import { MOCK_COINS } from '@/lib/mocks/coins';

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false',
      {
        next: { revalidate: 2 },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch coin data');
    }

    const data: CoinData[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching coins:', error);

    return NextResponse.json(MOCK_COINS);
  }
}
