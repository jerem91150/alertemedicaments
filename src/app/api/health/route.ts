import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  const health: {
    status: 'ok' | 'degraded' | 'error';
    timestamp: string;
    version: string;
    checks: {
      database: { status: string; latency: number };
      bdpmSync: { status: string; lastSync: string | null; hoursAgo: number | null };
      memory: { status: string; usedMB: number; totalMB: number };
    };
    responseTime?: number;
  } = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: { status: 'unknown', latency: 0 },
      bdpmSync: { status: 'unknown', lastSync: null, hoursAgo: null },
      memory: { status: 'ok', usedMB: 0, totalMB: 0 },
    },
  };

  // Check database
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = { status: 'ok', latency: Date.now() - dbStart };
  } catch (error) {
    health.checks.database = { status: 'error', latency: 0 };
    health.status = 'error';
    console.error('[HEALTH_CHECK_DB_ERROR]', error instanceof Error ? error.message : error);
  }

  // Check BDPM sync (last medication update < 24h)
  try {
    const lastMed = await prisma.medication.findFirst({
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    if (lastMed) {
      const hoursAgo = (Date.now() - lastMed.updatedAt.getTime()) / (1000 * 60 * 60);
      health.checks.bdpmSync = {
        status: hoursAgo < 48 ? 'ok' : 'warning',
        lastSync: lastMed.updatedAt.toISOString(),
        hoursAgo: Math.round(hoursAgo * 10) / 10,
      };
      if (hoursAgo >= 48) health.status = 'degraded';
    } else {
      health.checks.bdpmSync = { status: 'warning', lastSync: null, hoursAgo: null };
    }
  } catch (error) {
    health.checks.bdpmSync = { status: 'error', lastSync: null, hoursAgo: null };
    console.error('[HEALTH_CHECK_SYNC_ERROR]', error instanceof Error ? error.message : error);
  }

  // Check memory
  const memUsage = process.memoryUsage();
  const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  health.checks.memory = {
    status: usedMB > totalMB * 0.9 ? 'warning' : 'ok',
    usedMB,
    totalMB,
  };

  health.responseTime = Date.now() - startTime;

  return NextResponse.json(health, {
    status: health.status === 'error' ? 503 : 200,
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
  });
}
