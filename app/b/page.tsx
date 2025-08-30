import axios from 'axios';
import React from 'react'

async function page() {
  try {
    // Use the working endpoint that works in the browser
    const response = await axios.get('https://api.aptoscan.com/public/v1.0/fungible_assets/0xeeb5ba9616292d315edc8ce36a25b921bab879b2a7088d479d12b0c182bd28c8', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 10000,
    });
    
    console.log('APT to CATTOS Response: ', response.data);
    
    return (
      <div>
        <h1>CATTOS Token Data</h1>
        <pre>{JSON.stringify(response.data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error('Error fetching CATTOS data:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      
      return (
        <div>
          <h1>Error Fetching CATTOS Data</h1>
          <p>Status: {error.response?.status || 'Unknown'}</p>
          <p>Error: {error.message}</p>
          <pre>{JSON.stringify(error.response?.data || {}, null, 2)}</pre>
        </div>
      );
    }
    
    return (
      <div>
        <h1>Error Fetching CATTOS Data</h1>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}

export default page