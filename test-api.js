// Simple test script to verify API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Cryptocurrency Price Tracker API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing /api/health...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test prices endpoint
    console.log('2. Testing /api/prices...');
    const pricesResponse = await axios.get(`${BASE_URL}/api/prices`);
    console.log('✅ Prices fetched successfully:');
    console.log(`   APT to USDT: $${pricesResponse.data.aptToUsdt}`);
    console.log(`   USDT to PHP: ₱${pricesResponse.data.usdtToPhp}`);
    console.log(`   APT to CATTOS: ${pricesResponse.data.aptToCattos || 'N/A'}`);
    console.log(`   Last Updated: ${pricesResponse.data.lastUpdated}`);
    console.log('');

    console.log('🎉 All tests passed! The API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAPI();
