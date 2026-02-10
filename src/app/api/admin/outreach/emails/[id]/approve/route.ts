import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

// PATCH — Approve or reject an email
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const { action, editedSubject, editedBody } = body as {
    action: 'approve' | 'reject' | 'edit';
    editedSubject?: string;
    editedBody?: string;
  };

  if (action === 'reject') {
    await prisma.outreachEmail.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === 'edit') {
    const updated = await prisma.outreachEmail.update({
      where: { id },
      data: {
        subject: editedSubject || undefined,
        body: editedBody || undefined,
      },
    });
    return NextResponse.json(updated);
  }

  // approve
  const updated = await prisma.outreachEmail.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
  return NextResponse.json(updated);
}
