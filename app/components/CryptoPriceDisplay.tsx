'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CryptoPrices } from '../types/crypto';
import { DEFAULT_CURRENCY, getCurrencyByCode, getPopularCurrencies, searchCurrencies } from '../config/currencies';

export default function CryptoPriceDisplay() {
  const [prices, setPrices] = useState<CryptoPrices>({
    aptToUsdt: null,
    usdtToPhp: null,
    aptToCattos: null,
    selectedCurrency: DEFAULT_CURRENCY,
    selectedCurrencyToUsdt: null,
    aptToSelectedCurrency: null,
    lastUpdated: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds
  const [lastUpdateAnimation, setLastUpdateAnimation] = useState(false);
  
  // Currency selector state
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearchQuery, setCurrencySearchQuery] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState(getPopularCurrencies());
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  const fetchPrices = useCallback(async (currency?: string) => {
    try {
      setUpdating(true);
      setError(null);
      
      const currentCurrency = currency || prices.selectedCurrency;
      console.log(`🔄 Frontend: Fetching prices for ${currentCurrency.toUpperCase()}...`);
      
      const response = await fetch(`/api/prices?currency=${currentCurrency}&t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: CryptoPrices = await response.json();
      console.log('📊 Frontend: Received prices:', {
        apt: data.aptToUsdt,
        currency: `${data.selectedCurrencyToUsdt} ${currentCurrency.toUpperCase()}`,
        cattos: data.aptToCattos,
        timestamp: data.lastUpdated
      });
      
      setPrices(data);
      setLoading(false);
      
      // Trigger update animation
      setLastUpdateAnimation(true);
      setTimeout(() => setLastUpdateAnimation(false), 2000);
      
      // Reset countdown
      setCountdown(300); // 5 minutes = 300 seconds
      
    } catch (err) {
      console.error('❌ Frontend: Error fetching prices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      setLoading(false);
    } finally {
      setUpdating(false);
    }
  }, [prices.selectedCurrency]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Frontend: Auto-refresh triggered (5 minute interval)');
      fetchPrices();
    }, 5 * 60 * 1000); // 5 minutes = 300 seconds

    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Click outside handler for currency dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
        setCurrencySearchQuery('');
        setFilteredCurrencies(getPopularCurrencies());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    console.log(`🔄 Currency change requested: ${prices.selectedCurrency} → ${newCurrency}`);
    
    // Update state immediately
    setPrices(prev => ({ 
      ...prev, 
      selectedCurrency: newCurrency,
      // Reset price values to show loading state
      selectedCurrencyToUsdt: null,
      aptToSelectedCurrency: null 
    }));
    
    // Close dropdown and reset search
    setIsCurrencyDropdownOpen(false);
    setCurrencySearchQuery('');
    setFilteredCurrencies(getPopularCurrencies());
    
    // Fetch new prices
    fetchPrices(newCurrency);
  };

  // Handle currency search
  const handleCurrencySearch = (query: string) => {
    setCurrencySearchQuery(query);
    if (query.trim() === '') {
      setFilteredCurrencies(getPopularCurrencies());
    } else {
      setFilteredCurrencies(searchCurrencies(query));
    }
  };

  // Format price with more precision to show small changes
  const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A';
    // Show more decimals for values less than 1, otherwise 2 decimals
    return price < 1 ? price.toFixed(6) : price.toFixed(2);
  };

  // Format CATTOS price with 2 decimal places for consistency
  const formatCattosPrice = (price: number | null): string => {
    if (price === null) return 'N/A';
    return price.toFixed(2);
  };

  const currentCurrency = getCurrencyByCode(prices.selectedCurrency);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading cryptocurrency prices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">Error Loading Prices</h2>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Prices will automatically retry in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            🚀 DefiCattos Price Tracker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time prices from the Aptos ecosystem
          </p>
        </div>

        {/* Price Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* APT to USDT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">APT</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">APT to USDT</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aptos to Tether</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-all duration-500 ${
                lastUpdateAnimation ? 'scale-105 ring-2 ring-blue-200 dark:ring-blue-800 rounded' : ''
              }`}>
                ${formatPrice(prices.aptToUsdt)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current APT price in USDT
              </p>
            </div>
          </div>

          {/* Selected Currency to USDT with Integrated Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative" ref={currencyDropdownRef}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">{currentCurrency?.flag || '🌍'}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    USDT to {currentCurrency?.code.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tether to {currentCurrency?.name}
                  </p>
                </div>
              </div>
              
              {/* Currency Selector Button */}
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                aria-label="Change currency"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold text-green-600 dark:text-green-400 mb-2 transition-all duration-500 ${
                lastUpdateAnimation ? 'scale-105 ring-2 ring-green-200 dark:ring-green-800 rounded' : ''
              }`}>
                {currentCurrency?.symbol}{formatPrice(prices.selectedCurrencyToUsdt)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                1 USDT = {currentCurrency?.symbol}{formatPrice(prices.selectedCurrencyToUsdt)} {currentCurrency?.code.toUpperCase()}
              </p>
            </div>

            {/* Currency Dropdown */}
            {isCurrencyDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
                {/* Search Input */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      value={currencySearchQuery}
                      onChange={(e) => handleCurrencySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <svg
                      className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Currency List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCurrencies.length > 0 ? (
                    filteredCurrencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => handleCurrencyChange(currency.code)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                          currency.code === prices.selectedCurrency
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500'
                            : ''
                        }`}
                      >
                        <span className="text-xl">{currency.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {currency.code.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {currency.name}
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 dark:text-gray-500">
                          {currency.symbol}
                        </div>
                        {currency.code === prices.selectedCurrency && (
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No currencies found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredCurrencies.length} currency{filteredCurrencies.length !== 1 ? 'ies' : ''} available
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* APT to CATTOS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🐱</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">APT to CATTOS</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aptos to CATTOS</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 transition-all duration-500 ${
                lastUpdateAnimation ? 'scale-105 ring-2 ring-purple-200 dark:ring-purple-800 rounded' : ''
              }`}>
                {formatCattosPrice(prices.aptToCattos)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                CATTOS per 1 APT
              </p>
            </div>
          </div>
        </div>

        {/* Status and Timer Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Last Updated */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                lastUpdateAnimation 
                  ? 'bg-yellow-500 animate-ping scale-125' 
                  : 'bg-green-500 animate-pulse'
              }`}></div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                <p className={`font-semibold transition-all duration-300 ${
                  lastUpdateAnimation 
                    ? 'text-yellow-600 dark:text-yellow-400 scale-105' 
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {prices.lastUpdated ? new Date(prices.lastUpdated).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            {/* Next Update Timer */}
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Next Update In</p>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-gray-300 dark:text-gray-600"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${2 * Math.PI * 14 * (1 - countdown / 300)}`}
                        className="text-blue-600 dark:text-blue-400 transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                      {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <div className="flex items-center space-x-2">
                  {updating ? (
                    <>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        Updating...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Live
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Prices update automatically every 5 minutes • No manual refresh needed
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by CoinGecko, Aptoscan, and GeckoTerminal APIs
          </p>
        </div>
      </div>
    </div>
  );
}
