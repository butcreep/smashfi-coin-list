'use client';

import { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Info, Star } from 'lucide-react';
import { useCoins } from '@/hooks/useCoins';
import { useFavorites } from '@/hooks/useFavorites';
import { SortField, SortOrder, TabType } from '@/lib/types';
import {
  filterCoins,
  formatCurrency,
  formatLargeNumber,
  formatPercentage,
  sortCoins,
} from '@/lib/utils';
import Toast from './Toast';

const COLUMN_TEMPLATE =
  'grid grid-cols-[minmax(260px,_1.6fr)_repeat(4,_minmax(140px,_1fr))] gap-6';

const TABS: Array<{ key: TabType; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'favorite', label: 'My favorite' },
];

const formatPriceParts = (value: number) => {
  const formatted = formatCurrency(value);
  return {
    pretty: formatted.replace('$', ''),
    full: formatted,
  };
};

export default function CoinList() {
  const { data: coins, isLoading, error } = useCoins();
  const { favorites, toggleFavorite, isFavorite, isLoaded } = useFavorites();

  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('current_price');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [toast, setToast] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortField(field);
    setSortOrder('desc');
  };

  const handleFavoriteToggle = (coinId: string) => {
    const isAdding = toggleFavorite(coinId);
    setToast(isAdding ? 'Successfully added!' : 'Successfully deleted!');
  };

  const processedCoins = useMemo(() => {
    if (!coins) return [];

    let result = coins;
    if (activeTab === 'favorite') {
      result = result.filter((coin) => favorites.has(coin.id));
    }

    result = filterCoins(result, searchTerm);
    result = sortCoins(result, sortField, sortOrder);

    return result;
  }, [coins, activeTab, favorites, searchTerm, sortField, sortOrder]);

  const HeaderCell = ({
    label,
    field,
    withInfo = false,
  }: {
    label: string;
    field: SortField;
    withInfo?: boolean;
  }) => {
    const isActive = sortField === field;

    return (
      <button
        type="button"
        onClick={() => handleSort(field)}
        aria-pressed={isActive}
        className="group inline-flex w-full items-center justify-end gap-2 text-[11px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="text-left">{label}</span>
        {withInfo && (
          <Info
            size={14}
            className="transition-colors"
            style={{ color: 'var(--text-muted)' }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 items-center justify-center"
          aria-hidden
        >
          <span
            className="h-2 w-2 rounded-full border transition-all duration-200"
            style={{
              borderColor: isActive
                ? 'rgba(96,165,250,0)'
                : 'rgba(148,163,184,0.5)',
              background: isActive ? 'var(--info)' : 'transparent',
              boxShadow: isActive ? '0 0 12px rgba(96,165,250,0.75)' : 'none',
            }}
          />
        </span>
      </button>
    );
  };

  const renderRow = (index: number) => {
    const coin = processedCoins[index];
    if (!coin) return null;

    const favorite = isFavorite(coin.id);
    const { pretty, full } = formatPriceParts(coin.current_price);
    const isPositive = coin.price_change_percentage_24h >= 0;

    return (
      <div className="px-3 md:px-6">
        <div
          className={`${COLUMN_TEMPLATE} items-center py-4 text-sm transition-colors hover:bg-white/5`}
          style={{
            borderBottom:
              index === processedCoins.length - 1
                ? 'none'
                : '1px solid rgba(148,163,184,0.12)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleFavoriteToggle(coin.id)}
              aria-label={
                favorite ? 'Remove from favorites' : 'Add to favorites'
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-left transition-all hover:border-white/40"
            >
              <Star
                className="h-4 w-4 transition-all"
                fill={favorite ? 'var(--star-active)' : 'transparent'}
                stroke={
                  favorite ? 'var(--star-active)' : 'var(--star-inactive)'
                }
                strokeWidth={1.8}
              />
            </button>

            <img src={coin.image} alt={coin.name} className="coin-avatar" />

            <div className="min-w-0">
              <p
                className="truncate text-sm font-semibold uppercase tracking-wide"
                style={{ color: 'var(--text)' }}
              >
                {coin.symbol}
              </p>
              <p
                className="truncate text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                {coin.name}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div
              className="text-base font-semibold leading-6"
              style={{
                color: 'var(--text)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pretty}
            </div>
            <div
              className="text-xs"
              style={{
                color: 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {full}
            </div>
          </div>

          <div className="text-right">
            <span
              className="text-sm font-semibold"
              style={{
                color: isPositive ? 'var(--success)' : 'var(--danger)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>

          <div
            className="text-right text-sm font-semibold"
            style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}
          >
            {formatLargeNumber(coin.total_volume)}
          </div>

          <div
            className="text-right text-sm font-semibold"
            style={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}
          >
            {formatLargeNumber(coin.market_cap)}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || !isLoaded) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div
          className="rounded-2xl border px-6 py-4 text-sm font-medium"
          style={{
            borderColor: 'rgba(148,163,184,0.2)',
            background: 'rgba(5,11,24,0.9)',
            color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          Loading market data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'var(--bg)' }}
      >
        <div
          className="rounded-2xl border px-6 py-4 text-sm font-medium"
          style={{
            borderColor: 'rgba(248,113,113,0.4)',
            background: 'rgba(51,11,16,0.85)',
            color: 'var(--danger)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          Error loading coins data
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h1
              className="text-3xl font-bold tracking-tight md:text-[40px]"
              style={{ color: 'var(--text)' }}
            >
              Coin List
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-[28px] border border-white/10 bg-white/5 px-4 py-4">
          <div className="inline-flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 p-1">
              {TABS.map(({ key, label }) => {
                const isActiveTab = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className="rounded-full px-5 py-2 text-sm font-semibold transition-all"
                    style={{
                      background: isActiveTab
                        ? 'linear-gradient(135deg,#1f2a44,#10192b)'
                        : 'transparent',
                      color: isActiveTab ? '#fff' : 'var(--text-muted)',
                      boxShadow: isActiveTab
                        ? '0 12px 30px rgba(0,0,0,0.35)'
                        : 'none',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full flex-1 min-w-[240px] max-w-[520px] md:ml-auto md:w-auto">
            <div className="relative h-[46px] w-full">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <svg
                  className="h-[18px] w-[18px]"
                  style={{ color: 'var(--text-muted)' }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search coins"
                placeholder="Search something...(BTC, Bitcoin, B...)"
                className="h-full w-full rounded-full border bg-transparent pl-12 pr-4 text-sm font-medium focus:outline-none"
                style={{
                  borderColor: 'rgba(148,163,184,0.2)',
                  background:
                    'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(2,6,23,0.85))',
                  color: 'var(--text)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 35px rgba(2,6,23,0.65)',
                  caretColor: 'var(--text)',
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="overflow-x-auto rounded-[32px] border"
          style={{
            borderColor: 'rgba(148,163,184,0.15)',
            background:
              'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(2,6,23,0.96))',
            boxShadow: 'var(--shadow-strong)',
          }}
        >
          <div className="min-w-[960px]">
            <div
              className={`${COLUMN_TEMPLATE} px-6 pt-6 text-[11px] font-semibold uppercase tracking-[0.35em]`}
              style={{ color: 'var(--text-muted)' }}
            >
              <div className="text-left">Name</div>
              <HeaderCell label="Price" field="current_price" withInfo />
              <HeaderCell
                label="24h Change"
                field="price_change_percentage_24h"
                withInfo
              />
              <HeaderCell label="24h Volume" field="total_volume" withInfo />
              <HeaderCell label="Market Cap" field="market_cap" />
            </div>

            <div className="px-3 pb-4">
              <div
                className="mt-4 rounded-[24px]"
                style={{
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(4,7,16,0.35)',
                }}
              >
                {processedCoins.length === 0 ? (
                  <div
                    className="flex h-[320px] items-center justify-center text-sm font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    No coins found
                  </div>
                ) : (
                  <Virtuoso
                    style={{ height: 'calc(100vh - 360px)' }}
                    totalCount={processedCoins.length}
                    itemContent={renderRow}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
