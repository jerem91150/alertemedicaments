// API Route pour configurer le 2FA
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { setupTwoFactor } from '@/lib/two-factor';
import { logAuditEvent, getRequestInfo } from '@/lib/audit-log';

// GET: Générer un nouveau secret 2FA (avant activation)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, twoFactorEnabled: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: 'Le 2FA est déjà activé' },
        { status: 400 }
      );
    }

    // Generate new 2FA setup
    const setup = await setupTwoFactor(user.email);

    return NextResponse.json({
      qrCodeUrl: setup.qrCodeUrl,
      secret: setup.secret, // For manual entry
      // Don't send backup codes yet - only after verification
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la configuration du 2FA' },
      { status: 500 }
    );
  }
}

// POST: Activer le 2FA après vérification du premier code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { secret, token } = body;

    if (!secret || !token) {
      return NextResponse.json(
        { error: 'Secret et code requis' },
        { status: 400 }
      );
    }

    // Verify the token with the provided secret
    const { verifyTwoFactorToken, encryptSecret, generateBackupCodes, encryptBackupCodes } = await import('@/lib/two-factor');

    if (!verifyTwoFactorToken(token, secret)) {
      return NextResponse.json(
        { error: 'Code invalide. Vérifiez que votre application est synchronisée.' },
        { status: 400 }
      );
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);
    const encryptedBackupCodes = encryptBackupCodes(backupCodes);

    // Enable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: encryptSecret(secret),
        backupCodes: encryptedBackupCodes,
      },
    });

    // Log the event
    const requestInfo = getRequestInfo(request);
    await logAuditEvent({
      action: 'PASSWORD_CHANGE', // Using existing action type
      userId: session.user.id,
      success: true,
      details: { action: '2FA_ENABLED' },
      ...requestInfo,
    });

    return NextResponse.json({
      success: true,
      backupCodes, // Return backup codes only once!
      message: 'Authentification à deux facteurs activée. Conservez vos codes de secours en lieu sûr.',
    });
  } catch (error) {
    console.error('2FA activation error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation du 2FA' },
      { status: 500 }
    );
  }
}
