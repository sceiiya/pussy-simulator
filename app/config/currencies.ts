import { CurrencyOption } from '../types/crypto';

// Popular currencies with flags and symbols
export const AVAILABLE_CURRENCIES: CurrencyOption[] = [
  // Major Fiat Currencies
  { code: 'usd', name: 'US Dollar', symbol: '$', flag: '🇺🇸', isPopular: true },
  { code: 'eur', name: 'Euro', symbol: '€', flag: '🇪🇺', isPopular: true },
  { code: 'gbp', name: 'British Pound', symbol: '£', flag: '🇬🇧', isPopular: true },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', isPopular: true },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', isPopular: true },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', isPopular: true },
  { code: 'chf', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', isPopular: true },
  
  // Asian Currencies
  { code: 'php', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', isPopular: true },
  { code: 'cny', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', isPopular: true },
  { code: 'krw', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', isPopular: true },
  { code: 'inr', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', isPopular: true },
  { code: 'sgd', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', isPopular: true },
  { code: 'thb', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', isPopular: true },
  { code: 'myr', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', isPopular: true },
  { code: 'idr', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', isPopular: true },
  { code: 'vnd', name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', isPopular: true },
  
  // European Currencies
  { code: 'sek', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', isPopular: false },
  { code: 'nok', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', isPopular: false },
  { code: 'dkk', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', isPopular: false },
  { code: 'pln', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱', isPopular: false },
  { code: 'czk', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', isPopular: false },
  { code: 'huf', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', isPopular: false },
  { code: 'ron', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', isPopular: false },
  { code: 'hrk', name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷', isPopular: false },
  { code: 'bgn', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', isPopular: false },
  
  // American Currencies
  { code: 'mxn', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', isPopular: false },
  { code: 'brl', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', isPopular: false },
  { code: 'ars', name: 'Argentine Peso', symbol: '$', flag: '🇦🇷', isPopular: false },
  { code: 'clp', name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', isPopular: false },
  { code: 'cop', name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', isPopular: false },
  { code: 'pen', name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', isPopular: false },
  { code: 'uyu', name: 'Uruguayan Peso', symbol: '$', flag: '🇺🇾', isPopular: false },
  
  // African Currencies
  { code: 'zar', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', isPopular: false },
  { code: 'egp', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', isPopular: false },
  { code: 'ngn', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', isPopular: false },
  { code: 'kes', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', isPopular: false },
  { code: 'ghs', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', isPopular: false },
  { code: 'mad', name: 'Moroccan Dirham', symbol: 'MAD', flag: '🇲🇦', isPopular: false },
  
  // Middle Eastern Currencies
  { code: 'aed', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', isPopular: false },
  { code: 'sar', name: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦', isPopular: false },
  { code: 'qar', name: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦', isPopular: false },
  { code: 'kwd', name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', isPopular: false },
  { code: 'bhd', name: 'Bahraini Dinar', symbol: '.د.ب', flag: '🇧🇭', isPopular: false },
  { code: 'omr', name: 'Omani Rial', symbol: 'ر.ع.', flag: '🇴🇲', isPopular: false },
  
  // Oceanian Currencies
  { code: 'nzd', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', isPopular: false },
  { code: 'fjd', name: 'Fijian Dollar', symbol: 'FJ$', flag: '🇫🇯', isPopular: false },
  { code: 'pgn', name: 'Papua New Guinean Kina', symbol: 'K', flag: '🇵🇬', isPopular: false },
  
  // Other Major Currencies
  { code: 'hkd', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', isPopular: true },
  { code: 'twd', name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', isPopular: false },
  { code: 'ils', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', isPopular: false },
  { code: 'try', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', isPopular: false },
  { code: 'rub', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', isPopular: false },
  { code: 'uah', name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', isPopular: false },
];

// Get popular currencies (top tier)
export const getPopularCurrencies = (): CurrencyOption[] => {
  return AVAILABLE_CURRENCIES.filter(currency => currency.isPopular);
};

// Search currencies by name or code
export const searchCurrencies = (query: string): CurrencyOption[] => {
  const searchTerm = query.toLowerCase();
  return AVAILABLE_CURRENCIES.filter(currency => 
    currency.name.toLowerCase().includes(searchTerm) ||
    currency.code.toLowerCase().includes(searchTerm) ||
    currency.symbol.toLowerCase().includes(searchTerm)
  );
};

// Get currency by code
export const getCurrencyByCode = (code: string): CurrencyOption | undefined => {
  return AVAILABLE_CURRENCIES.find(currency => currency.code === code.toLowerCase());
};

// Default currency
export const DEFAULT_CURRENCY = 'php';

// Re-export the type for convenience
export type { CurrencyOption };
