import { CoinData } from '@/lib/types';

export const MOCK_COINS: CoinData[] = [
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
];

