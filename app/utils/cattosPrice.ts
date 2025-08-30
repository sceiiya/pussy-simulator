import axios from 'axios';

// Real CATTOS token information from Aptoscan
const CATTOS_TOKEN_INFO = {
  address: '0xeeb5ba9616292d315edc8ce36a25b921bab879b2a7088d479d12b0c182bd28c8',
  name: 'Defi Cattos',
  symbol: 'CATTOS',
  decimals: 8,
  aptoscanEndpoint: 'https://api.aptoscan.com/public/v1.0/fungible_assets/0xeeb5ba9616292d315edc8ce36a25b921bab879b2a7088d479d12b0c182bd28c8',
};

export async function fetchCattosPriceFromDEX(): Promise<number | null> {
  try {
    // Check if we're in a build environment (static generation phase)
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       (typeof window === 'undefined' && !process.env.VERCEL_URL);
    
    if (isBuildTime) {
      console.log('🏗️ Build environment detected, skipping external API calls');
      return null;
    }

    // Primary source: Aptoscan API for real CATTOS token data
    const price = await fetchFromAptoscan();
    if (price !== null) {
      return price;
    }

    // If primary source fails, return null
    console.log('CATTOS price not available from Aptoscan API');
    return null;
  } catch (error) {
    console.error('Error fetching CATTOS price:', error);
    return null;
  }
}

// Primary source: Aptoscan API for real CATTOS token data with retries
async function fetchFromAptoscan(): Promise<number | null> {
  const maxRetries = 3;
  const timeouts = [10000, 15000, 25000]; // Progressive timeout increase for Vercel builds
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Fetching CATTOS price from Aptoscan API (attempt ${attempt + 1}/${maxRetries})...`);
      
      // Rotate user agents to avoid blocking
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ];
      
      const response = await axios.get(CATTOS_TOKEN_INFO.aptoscanEndpoint, {
        timeout: timeouts[attempt],
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': userAgents[attempt % userAgents.length],
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'DNT': '1',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
        },
      });

      if (response.data && response.data.success && response.data.data) {
        const cattosData = response.data.data;
        
        console.log('✅ CATTOS token data received:', {
          name: cattosData.name,
          symbol: cattosData.symbol,
          currentPrice: cattosData.current_price,
          change24h: cattosData.change24h_price,
          holders: cattosData.current_num_holder,
          totalSupply: cattosData.total_supply,
        });

        // The API returns current_price in USDT per 1 CATTOS
        if (cattosData.current_price && cattosData.current_price > 0) {
          console.log(`✅ CATTOS current price: $${cattosData.current_price} USDT per 1 CATTOS`);
          return cattosData.current_price; // Return USDT price per CATTOS
        }
      }
      
      console.warn(`⚠️ Invalid response structure on attempt ${attempt + 1}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = error && typeof error === 'object' && 'code' in error ? (error as { code: string }).code : undefined;
      console.warn(`❌ Aptoscan attempt ${attempt + 1} failed:`, errorCode || errorMsg);
      
      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        const waitTime = (attempt + 1) * 1000; // 1s, 2s, 3s
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error('❌ All Aptoscan attempts failed');
  return null;
}

// Calculate APT to CATTOS ratio using CATTOS USDT price and APT USDT price
export async function calculateAptToCattosRatio(): Promise<number | null> {
  try {
    console.log('Calculating APT to CATTOS ratio...');
    
    // Fetch APT price from CoinGecko
    const aptResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'aptos',
        vs_currencies: 'usd',
      },
      timeout: 10000,
    });

    if (!aptResponse.data || !aptResponse.data.aptos || !aptResponse.data.aptos.usd) {
      console.warn('Failed to fetch APT price from CoinGecko');
      return null;
    }

    const aptPriceUSD = aptResponse.data.aptos.usd;
    console.log(`APT price: $${aptPriceUSD} USDT per 1 APT`);

    // Fetch CATTOS price from Aptoscan (USDT per 1 CATTOS)
    const cattosResponse = await axios.get(CATTOS_TOKEN_INFO.aptoscanEndpoint, {
      timeout: 20000, // Increased timeout for Vercel builds
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'DNT': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    });

    if (!cattosResponse.data || !cattosResponse.data.success || !cattosResponse.data.data) {
      console.warn('Failed to fetch CATTOS data from Aptoscan');
      return null;
    }

    const cattosData = cattosResponse.data.data;
    const cattosPriceUSDT = cattosData.current_price; // USDT per 1 CATTOS

    if (!cattosPriceUSDT || cattosPriceUSDT <= 0) {
      console.warn('Invalid CATTOS price from Aptoscan');
      return null;
    }

    console.log(`CATTOS price: $${cattosPriceUSDT} USDT per 1 CATTOS`);

    // Calculate how many CATTOS you get for 1 APT
    // Formula: (APT_USDT_Price) / (CATTOS_USDT_Price) = CATTOS_per_APT
    const cattosPerApt = aptPriceUSD / cattosPriceUSDT;
    console.log(`Calculation: $${aptPriceUSD} ÷ $${cattosPriceUSDT} = ${cattosPerApt.toFixed(2)} CATTOS per 1 APT`);

    return cattosPerApt;

  } catch (error) {
    console.error('Error calculating APT to CATTOS ratio:', error);
    return null;
  }
}

// Get CATTOS token information
export function getCattosTokenInfo() {
  return CATTOS_TOKEN_INFO;
}
