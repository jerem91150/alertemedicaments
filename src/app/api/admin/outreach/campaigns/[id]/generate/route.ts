import { NextRequest, NextResponse } from 'next/server';
import { generateCampaignEmails } from '@/lib/outreach-ai';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  try {
    const result = await generateCampaignEmails(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[ADMIN_GENERATE_ERROR]', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}
