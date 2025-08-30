# Cryptocurrency Price Tracker - APT, USDT, CATTOS

A Next.js 15 application that tracks real-time cryptocurrency prices for:
- **APT to USDT** (Aptos to Tether)
- **USDT to PHP** (Tether to Philippine Peso)  
- **APT to CATTOS** (Aptos to CATTOS tokens in the Aptos ecosystem)

## ✨ Key Features

- 🚀 **Real-time Updates**: Prices automatically refresh every minute
- 🔄 **No Page Reloads**: Smooth client-side updates using React state
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔄 **Auto-refresh**: Manual refresh button and automatic updates
- 📊 **Multiple Data Sources**: CoinGecko API + Aptos ecosystem APIs
- 🏥 **Health Monitoring**: API endpoint health checks
- ⚡ **Next.js 15**: Built with the latest Next.js features
- 🎯 **Smooth UX**: Hover effects, loading states, and visual feedback

## 🎯 No Page Reload Implementation

The application is designed to provide a seamless user experience:

- **Client-side State Management**: Uses React hooks for smooth state updates
- **API-only Updates**: Only fetches new data, doesn't reload the entire page
- **Visual Feedback**: Shows loading indicators during updates
- **Automatic Refresh**: Updates every minute in the background
- **Manual Refresh**: Button to manually fetch latest prices

### How It Works

1. **Initial Load**: Page loads once with initial prices
2. **Background Updates**: JavaScript fetches new data every minute
3. **State Updates**: React state updates trigger UI re-renders
4. **Smooth Transitions**: No page flicker or reload delays

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
