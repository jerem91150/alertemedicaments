import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  const health = {
    status: 'ok' as 'ok' | 'degraded' | 'error',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    checks: {
      database: { status: 'unknown' as string, latency: 0 },
      memory: { status: 'ok' as string, used: 0, total: 0 },
    },
  };

  // Check database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = {
      status: 'ok',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    health.checks.database = {
      status: 'error',
      latency: 0,
    };
    health.status = 'degraded';
    console.error('Health check - Database error:', error);
  }

  // Check memory
  const memUsage = process.memoryUsage();
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  health.checks.memory = {
    status: usedMB > totalMB * 0.9 ? 'warning' : 'ok',
    used: usedMB,
    total: totalMB,
  };

  // Calculate response time
  const responseTime = Date.now() - startTime;

  return NextResponse.json(
    {
      ...health,
      responseTime,
    },
    {
      status: health.status === 'ok' ? 200 : health.status === 'degraded' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
