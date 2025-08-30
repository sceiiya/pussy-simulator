import { NextResponse } from 'next/server';
import { fetchAllPrices } from '@/app/utils/cryptoApi';
import { CryptoPrices } from '@/app/types/crypto';
import { DEFAULT_CURRENCY } from '@/app/config/currencies';

// Cache for storing prices and last fetch time
let cachedPrices: CryptoPrices | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const selectedCurrency = searchParams.get('currency') || DEFAULT_CURRENCY;
    
    const currentTime = Date.now();
    
    // Check if we have cached data for the same currency and it's still valid
    if (cachedPrices && 
        cachedPrices.selectedCurrency === selectedCurrency && 
        (currentTime - lastFetchTime) < CACHE_DURATION) {
      const remainingSeconds = Math.ceil((CACHE_DURATION - (currentTime - lastFetchTime)) / 1000);
      console.log(`💾 API: Returning cached prices for ${selectedCurrency.toUpperCase()} (valid for ${remainingSeconds}s more)`);
      console.log(`💾 API: Cached values - APT: $${cachedPrices.aptToUsdt}, ${selectedCurrency.toUpperCase()}: $${cachedPrices.selectedCurrencyToUsdt}, CATTOS: ${cachedPrices.aptToCattos}`);
      return NextResponse.json(cachedPrices);
    }
    
    // Fetch new data if cache is expired, doesn't exist, or currency changed
    console.log(`🔄 API: Cache expired/missing/currency changed, fetching fresh prices for ${selectedCurrency.toUpperCase()}...`);
    const prices = await fetchAllPrices(selectedCurrency);
    
    // Update cache
    cachedPrices = prices;
    lastFetchTime = currentTime;
    
    console.log(`✅ API: Fresh prices fetched and cached for ${selectedCurrency.toUpperCase()} at:`, new Date(lastFetchTime).toISOString());
    console.log(`✅ API: New values - APT: $${prices.aptToUsdt}, ${selectedCurrency.toUpperCase()}: $${prices.selectedCurrencyToUsdt}, CATTOS: ${prices.aptToCattos}`);
    
    return NextResponse.json(prices);
  } catch (error) {
    console.error('API Error:', error);
    
    // If we have cached data, return it even if it's expired
    if (cachedPrices) {
      console.log('Error occurred, returning expired cached data as fallback');
      return NextResponse.json(cachedPrices);
    }
    
    // If no cache exists, return error
    return NextResponse.json(
      {
        error: 'Failed to fetch prices',
        aptToUsdt: null,
        usdtToPhp: null,
        aptToCattos: null,
        selectedCurrency: DEFAULT_CURRENCY,
        selectedCurrencyToUsdt: null,
        aptToSelectedCurrency: null,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
