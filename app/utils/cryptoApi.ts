import axios from 'axios';
import { CryptoPrices, CoinGeckoResponse } from '../types/crypto';
import { fetchCattosPriceFromDEX, calculateAptToCattosRatio } from './cattosPrice';
import { DEFAULT_CURRENCY } from '../config/currencies';

export async function fetchCoinGeckoPrices(selectedCurrency: string = DEFAULT_CURRENCY): Promise<{ 
  aptToUsdt: number; 
  selectedCurrencyToUsdt: number; 
  aptToSelectedCurrency: number;
}> {
  try {
    // Fetch multiple currencies at once for better performance
    const popularCurrencies = ['usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'php', 'cny', 'krw', 'inr', 'sgd', 'hkd'];
    const currenciesToFetch = Array.from(new Set([...popularCurrencies, selectedCurrency])).join(',');
    
    console.log(`🔄 CoinGecko: Fetching APT and TETHER prices for multiple currencies...`);
    
    const response = await axios.get<CoinGeckoResponse>(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'aptos,tether',
          vs_currencies: currenciesToFetch,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log(`✅ CoinGecko: Received price data for ${currenciesToFetch.split(',').length} currencies`);

    return {
      aptToUsdt: response.data.aptos.usd,
      selectedCurrencyToUsdt: response.data.tether[selectedCurrency],
      aptToSelectedCurrency: response.data.aptos[selectedCurrency],
    };
  } catch (error) {
    console.error('❌ CoinGecko: Error fetching prices:', error);
    throw error;
  }
}

export async function fetchCattosPrice(): Promise<number | null> {
  try {
    console.log('🔄 Fetching CATTOS price...');
    
    // Primary method: Calculate APT to CATTOS ratio using both prices
    console.log('📊 Method 1: Calculating APT to CATTOS ratio from USDT prices...');
    const calculatedRatio = await calculateAptToCattosRatio();
    
    if (calculatedRatio !== null) {
      console.log(`✅ Successfully calculated APT to CATTOS ratio: ${calculatedRatio.toFixed(6)} CATTOS per 1 APT`);
      return calculatedRatio;
    }
    
    console.log('⚠️  Primary calculation failed, trying fallback methods...');
    
    // Fallback: Try to fetch CATTOS price from DEX sources
    console.log('🔄 Method 2: Fetching from DEX sources...');
    const cattosPrice = await fetchCattosPriceFromDEX();
    
    if (cattosPrice !== null) {
      console.log(`✅ CATTOS price fetched from DEX: ${cattosPrice}`);
      return cattosPrice;
    }

    // If all else fails, log that CATTOS price is not available
    console.log('❌ CATTOS price not available from any source');
    return null;
  } catch (error) {
    console.error('❌ Error fetching CATTOS price:', error);
    return null;
  }
}

export async function fetchAllPrices(selectedCurrency: string = DEFAULT_CURRENCY): Promise<CryptoPrices> {
  try {
    // Check if we're in a build environment (static generation phase)
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       (typeof window === 'undefined' && !process.env.VERCEL_URL);
    
    if (isBuildTime) {
      console.log('🏗️ Build environment detected, returning mock data');
      return {
        aptToUsdt: 4.27,
        usdtToPhp: selectedCurrency === 'php' ? 57.1 : null,
        aptToCattos: 5305.67,
        selectedCurrency,
        selectedCurrencyToUsdt: selectedCurrency === 'php' ? 57.1 : 1.0,
        aptToSelectedCurrency: selectedCurrency === 'php' ? 243.87 : 4.27,
        lastUpdated: new Date().toISOString(),
      };
    }

    console.log('🚀 Fetching all cryptocurrency prices...');
    
    // Fetch CoinGecko prices (APT/USDT, APT/selectedCurrency, and selectedCurrency/USDT)
    console.log(`📈 Fetching APT and USDT prices for multiple currencies from CoinGecko...`);
    const { aptToUsdt, selectedCurrencyToUsdt, aptToSelectedCurrency } = await fetchCoinGeckoPrices(selectedCurrency);
    console.log(`✅ APT to USDT: $${aptToUsdt}`);
    console.log(`✅ APT to ${selectedCurrency.toUpperCase()}: ${aptToSelectedCurrency}`);
    console.log(`✅ USDT to ${selectedCurrency.toUpperCase()}: ${selectedCurrencyToUsdt}`);
    
    // Fetch CATTOS price from Aptos ecosystem
    console.log('🐱 Fetching CATTOS price from Aptos ecosystem...');
    const aptToCattos = await fetchCattosPrice();
    
    if (aptToCattos !== null) {
      console.log(`✅ APT to CATTOS: ${aptToCattos.toFixed(6)} CATTOS per 1 APT`);
      console.log(`   This means 1 CATTOS = ${(1 / aptToCattos).toFixed(6)} APT`);
    } else {
      console.log('❌ APT to CATTOS: Not available');
    }
    
    console.log('🎯 All prices fetched successfully!');
    
    return {
      aptToUsdt,
      usdtToPhp: selectedCurrency === 'php' ? selectedCurrencyToUsdt : null, // Keep for backward compatibility
      aptToCattos,
      selectedCurrency,
      selectedCurrencyToUsdt,
      aptToSelectedCurrency,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error fetching all prices:', error);
    throw error;
  }
}

// Health check function to verify API endpoints
export async function checkApiHealth(): Promise<{
  coinGecko: boolean;
  aptos: boolean;
  cattos: boolean;
}> {
  const health = {
    coinGecko: false,
    aptos: false,
    cattos: false,
  };

  try {
    // Check CoinGecko
    console.log('🏥 Checking CoinGecko API health...');
    await axios.get('https://api.coingecko.com/api/v3/ping', { timeout: 5000 });
    health.coinGecko = true;
    console.log('✅ CoinGecko API is healthy');
  } catch (error) {
    console.warn('❌ CoinGecko health check failed:', error);
  }

  try {
    // Check Aptos node (simplified)
    console.log('🏥 Checking Aptos node health...');
    await axios.get('https://fullnode.mainnet.aptoslabs.com/v1', { timeout: 5000 });
    health.aptos = true;
    console.log('✅ Aptos node is healthy');
  } catch (error) {
    console.warn('❌ Aptos health check failed:', error);
  }

  try {
    // Check CATTOS availability
    console.log('🏥 Checking CATTOS API health...');
    const cattosPrice = await fetchCattosPrice();
    health.cattos = cattosPrice !== null;
    if (health.cattos) {
      console.log('✅ CATTOS API is healthy');
    } else {
      console.log('⚠️  CATTOS API returned no data');
    }
  } catch (error) {
    console.warn('❌ CATTOS health check failed:', error);
  }

  return health;
}
