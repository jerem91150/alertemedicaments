// API Route pour régénérer les codes de secours
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateBackupCodes, encryptBackupCodes, verifyTwoFactor } from '@/lib/two-factor';
import { logAuditEvent, getRequestInfo } from '@/lib/audit-log';

// GET: Voir le nombre de codes restants
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
        backupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      twoFactorEnabled: user.twoFactorEnabled,
      backupCodesRemaining: user.backupCodes.length,
    });
  } catch (error) {
    console.error('Backup codes check error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}

// POST: Régénérer de nouveaux codes de secours
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    // Get user with 2FA info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
        twoFactorSecret: true,
        backupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Le 2FA n\'est pas activé' },
        { status: 400 }
      );
    }

    // Verify current 2FA token
    if (!token) {
      return NextResponse.json(
        { error: 'Code 2FA requis pour régénérer les codes de secours' },
        { status: 400 }
      );
    }

    const verifyResult = verifyTwoFactor(
      token,
      user.twoFactorSecret!,
      user.backupCodes
    );

    if (!verifyResult.valid) {
      return NextResponse.json(
        { error: 'Code 2FA invalide' },
        { status: 401 }
      );
    }

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes(10);
    const encryptedBackupCodes = encryptBackupCodes(newBackupCodes);

    // Update user
    await prisma.user.update({
      where: { id: session.user.id },
      data: { backupCodes: encryptedBackupCodes },
    });

    // Log the event
    const requestInfo = getRequestInfo(request);
    await logAuditEvent({
      action: 'PASSWORD_CHANGE',
      userId: session.user.id,
      success: true,
      details: { action: 'BACKUP_CODES_REGENERATED' },
      ...requestInfo,
    });

    return NextResponse.json({
      success: true,
      backupCodes: newBackupCodes,
      message: 'Nouveaux codes de secours générés. Les anciens codes sont maintenant invalides.',
    });
  } catch (error) {
    console.error('Backup codes regeneration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la régénération des codes' },
      { status: 500 }
    );
  }
}
