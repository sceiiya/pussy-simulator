// Token configuration for the Aptos ecosystem
export const TOKEN_CONFIG = {
  // APT (Aptos) - Native token
  APT: {
    symbol: 'APT',
    name: 'Aptos',
    decimals: 8,
    address: '0x1::aptos_coin::AptosCoin',
    coingeckoId: 'aptos',
  },
  
  // USDT (Tether)
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    decimals: 6,
    coingeckoId: 'tether',
  },
  
  // CATTOS - Aptos ecosystem token (Real address from Aptoscan API)
  CATTOS: {
    symbol: 'CATTOS',
    name: 'Defi Cattos',
    decimals: 8,
    // Real CATTOS token address from Aptoscan API
    address: '0xeeb5ba9616292d315edc8ce36a25b921bab879b2a7088d479d12b0c182bd28c8',
    description: 'Defi Cattos token in the Aptos ecosystem - Real data from Aptoscan API',
    aptoscanEndpoint: 'https://api.aptoscan.com/public/v1.0/fungible_assets/0xeeb5ba9616292d315edc8ce36a25b921bab879b2a7088d479d12b0c182bd28c8',
    projectUrl: 'https://cattos.io',
    logoUrl: 'https://assets.panora.exchange/tokens/aptos/CATTOS.png',
  },
  
  // PHP (Philippine Peso)
  PHP: {
    symbol: 'PHP',
    name: 'Philippine Peso',
    decimals: 2,
    isFiat: true,
  },
};

// API rate limits and timeouts
export const API_CONFIG = {
  coinGecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
    rateLimit: '50 calls per minute (free tier)',
  },
  aptoscan: {
    baseUrl: 'https://api.aptoscan.com/public/v1.0',
    timeout: 10000,
    rateLimit: '100 calls per minute (free tier)',
    isPrimary: true,
  },
  aptos: {
    baseUrl: 'https://fullnode.mainnet.aptoslabs.com/v1',
    timeout: 5000,
  },
  updateInterval: 60 * 1000, // 1 minute in milliseconds
};
