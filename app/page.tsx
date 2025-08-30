'use client';

import CryptoPriceDisplay from './components/CryptoPriceDisplay';
import ThemeToggle from './components/ThemeToggle';
import ThemeProvider from './components/ThemeProvider';

export default function Home() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <CryptoPriceDisplay />
    </ThemeProvider>
  );
}
