# CATTOS Price Implementation Guide

This guide explains how to implement real CATTOS price fetching for the APT to CATTOS conversion in the Aptos ecosystem.

## Current Status

The application currently shows "N/A" for APT to CATTOS because:
1. CATTOS token address is not yet configured
2. DEX API endpoints are placeholders
3. Real price fetching logic needs to be implemented

## Step 1: Find CATTOS Token Information

### Option A: Search Aptos Ecosystem
1. **Aptoscan Explorer**: Visit [aptoscan.com](https://aptoscan.com) and search for "CATTOS"
2. **Aptos Explorer**: Check [explorer.aptoslabs.com](https://explorer.aptoslabs.com)
3. **Community Resources**: Check Aptos Discord, Telegram, or Reddit

### Option B: Check DEX Listings
1. **Liquidswap**: Visit [liquidswap.com](https://liquidswap.com) and search for CATTOS
2. **PancakeSwap on Aptos**: Check [pancakeswap.finance](https://pancakeswap.finance)
3. **Thala**: Visit [thala.fi](https://thala.fi) for more Aptos tokens

### Option C: Blockchain Query
```typescript
// Query all coins on Aptos
const coins = await aptosClient.getAccountResources('0x1');
// Look for CATTOS in the results
```

## Step 2: Update Token Configuration

Once you find the CATTOS token address, update `app/config/tokens.ts`:

```typescript
CATTOS: {
  symbol: 'CATTOS',
  name: 'CATTOS',
  decimals: 8,
  address: '0x...', // Replace with real address
  description: 'CATTOS token in the Aptos ecosystem',
},
```

## Step 3: Implement Real DEX Integration

### Liquidswap Integration
```typescript
async function fetchFromLiquidswap(): Promise<number | null> {
  try {
    // Real Liquidswap API endpoint
    const response = await axios.get('https://api.liquidswap.com/v1/pairs', {
      params: {
        token0: 'APT',
        token1: 'CATTOS',
        network: 'aptos',
      },
    });

    if (response.data && response.data.price) {
      return parseFloat(response.data.price);
    }
    return null;
  } catch (error) {
    console.warn('Liquidswap fetch failed:', error);
    return null;
  }
}
```

### PancakeSwap on Aptos Integration
```typescript
async function fetchFromPancakeSwap(): Promise<number | null> {
  try {
    // Real PancakeSwap API endpoint
    const response = await axios.get('https://api.pancakeswap.finance/v1/pairs', {
      params: {
        token0: 'APT',
        token1: 'CATTOS',
        chainId: 'aptos', // Aptos chain ID
      },
    });

    if (response.data && response.data.price) {
      return parseFloat(response.data.price);
    }
    return null;
  } catch (error) {
    console.warn('PancakeSwap fetch failed:', error);
    return null;
  }
}
```

## Step 4: Direct Blockchain Price Calculation

### Method A: Liquidity Pool Reserves
```typescript
async function calculatePriceFromPoolReserves(): Promise<number | null> {
  try {
    // CATTOS/APT liquidity pool address
    const poolAddress = '0x...'; // Replace with real pool address
    
    // Get pool reserves
    const poolResource = await aptosClient.getAccountResource(
      poolAddress,
      '0x1::pool::Pool'
    );
    
    if (poolResource.data) {
      const { coin_x_reserve, coin_y_reserve } = poolResource.data;
      
      // Calculate price: CATTOS per APT
      const cattosReserve = Number(coin_x_reserve.value);
      const aptReserve = Number(coin_y_reserve.value);
      
      return cattosReserve / aptReserve;
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating price from reserves:', error);
    return null;
  }
}
```

### Method B: Multiple Pool Sources
```typescript
async function calculatePriceFromMultiplePools(): Promise<number | null> {
  const pools = [
    '0x...', // Liquidswap pool
    '0x...', // PancakeSwap pool
    '0x...', // Thala pool
  ];
  
  const prices: number[] = [];
  
  for (const poolAddress of pools) {
    try {
      const price = await getPriceFromPool(poolAddress);
      if (price !== null) {
        prices.push(price);
      }
    } catch (error) {
      console.warn(`Failed to get price from pool ${poolAddress}:`, error);
    }
  }
  
  if (prices.length === 0) return null;
  
  // Return weighted average or median
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}
```

## Step 5: Alternative Data Sources

### Aptoscan API
```typescript
async function fetchFromAptoscan(): Promise<number | null> {
  try {
    const response = await axios.get('https://api.aptoscan.com/v1/tokens', {
      params: {
        symbol: 'CATTOS',
        network: 'mainnet',
      },
      headers: {
        'Authorization': `Bearer ${process.env.APTOSCAN_API_KEY}`,
      },
    });

    if (response.data && response.data.data && response.data.data.length > 0) {
      const cattosToken = response.data.data[0];
      if (cattosToken.price_usd && cattosToken.price_apt) {
        return parseFloat(cattosToken.price_apt);
      }
    }
    return null;
  } catch (error) {
    console.warn('Aptoscan fetch failed:', error);
    return null;
  }
}
```

### CoinGecko (if CATTOS is listed)
```typescript
async function fetchFromCoinGecko(): Promise<number | null> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'cattos', // If CATTOS has a CoinGecko ID
        vs_currencies: 'usd,apt',
      },
    });

    if (response.data && response.data.cattos && response.data.cattos.apt) {
      return response.data.cattos.apt;
    }
    return null;
  } catch (error) {
    console.warn('CoinGecko CATTOS fetch failed:', error);
    return null;
  }
}
```

## Step 6: Price Aggregation and Fallbacks

```typescript
export async function fetchCattosPrice(): Promise<number | null> {
  const sources = [
    fetchFromLiquidswap,
    fetchFromPancakeSwap,
    fetchFromAptoscan,
    calculatePriceFromPoolReserves,
    fetchFromCoinGecko, // If available
  ];

  const prices: number[] = [];
  
  for (const source of sources) {
    try {
      const price = await source();
      if (price !== null && price > 0) {
        prices.push(price);
      }
    } catch (error) {
      console.warn(`Source ${source.name} failed:`, error);
    }
  }

  if (prices.length === 0) return null;

  // Remove outliers and calculate median
  const sortedPrices = prices.sort((a, b) => a - b);
  const median = sortedPrices[Math.floor(sortedPrices.length / 2)];
  
  return median;
}
```

## Step 7: Testing and Validation

### Test Individual Sources
```typescript
// Test each price source individually
const sources = [
  { name: 'Liquidswap', fn: fetchFromLiquidswap },
  { name: 'PancakeSwap', fn: fetchFromPancakeSwap },
  { name: 'Aptoscan', fn: fetchFromAptoscan },
];

for (const source of sources) {
  try {
    const price = await source.fn();
    console.log(`${source.name}: ${price}`);
  } catch (error) {
    console.error(`${source.name} failed:`, error);
  }
}
```

### Validate Price Accuracy
```typescript
function validatePrice(price: number): boolean {
  // Basic validation
  if (price <= 0) return false;
  if (price > 1000000) return false; // Unrealistic price
  
  // Check if price is within reasonable range
  // You can adjust these thresholds based on expected CATTOS value
  return price >= 0.000001 && price <= 1000;
}
```

## Step 8: Error Handling and Monitoring

```typescript
export async function fetchCattosPriceWithMonitoring(): Promise<{
  price: number | null;
  source: string;
  timestamp: string;
  errors: string[];
}> {
  const result = {
    price: null as number | null,
    source: 'unknown',
    timestamp: new Date().toISOString(),
    errors: [] as string[],
  };

  try {
    const price = await fetchCattosPrice();
    result.price = price;
    
    // Log successful fetch
    console.log(`CATTOS price fetched: ${price} from ${result.source}`);
    
  } catch (error) {
    result.errors.push(error.message);
    console.error('CATTOS price fetch failed:', error);
  }

  return result;
}
```

## Troubleshooting

### Common Issues

1. **Token Not Found**: CATTOS might not be listed on major DEXes yet
2. **API Rate Limits**: Some APIs have strict rate limits
3. **Network Issues**: Aptos RPC nodes might be slow or unreliable
4. **Incorrect Address**: Double-check the CATTOS token address

### Debug Steps

1. **Check Token Existence**: Verify CATTOS exists on Aptos
2. **Test API Endpoints**: Use tools like Postman to test APIs manually
3. **Check Network**: Ensure you're querying mainnet, not testnet
4. **Validate Addresses**: Confirm all addresses are correct

### Fallback Strategies

1. **Cache Previous Prices**: Store last known price as fallback
2. **Multiple Sources**: Use weighted average from multiple sources
3. **Manual Override**: Allow manual price input for testing
4. **Price Estimation**: Estimate price based on similar tokens

## Next Steps

1. **Research CATTOS**: Find the actual token address and DEX listings
2. **Implement Sources**: Add real API integrations
3. **Test Thoroughly**: Validate price accuracy
4. **Monitor Performance**: Track API reliability and response times
5. **Optimize**: Implement caching and error handling

## Resources

- [Aptos Documentation](https://aptos.dev/)
- [Liquidswap API](https://liquidswap.com/)
- [PancakeSwap API](https://docs.pancakeswap.finance/)
- [Aptoscan API](https://docs.aptoscan.com/)
- [Aptos Community](https://discord.gg/aptos)
