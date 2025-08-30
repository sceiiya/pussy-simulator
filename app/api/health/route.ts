import { NextResponse } from 'next/server';
import { checkApiHealth } from '@/app/utils/cryptoApi';

export async function GET() {
  try {
    const health = await checkApiHealth();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: health,
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}
