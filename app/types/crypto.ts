export interface CryptoPrices {
  aptToUsdt: number | null;
  usdtToPhp: number | null; // Keep for backward compatibility
  aptToCattos: number | null;
  selectedCurrency: string;
  selectedCurrencyToUsdt: number | null;
  aptToSelectedCurrency: number | null; // APT price in the selected currency
  lastUpdated: string;
}

export interface CoinGeckoResponse {
  aptos: {
    usd: number;
    [currency: string]: number;
  };
  tether: {
    [currency: string]: number;
  };
}

export interface CattosPriceResponse {
  price: number;
  timestamp: number;
}

export interface AptosTokenInfo {
  symbol: string;
  decimals: number;
  address: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
  isPopular?: boolean;
}

export interface CurrencySearchResult {
  currencies: CurrencyOption[];
  total: number;
}
