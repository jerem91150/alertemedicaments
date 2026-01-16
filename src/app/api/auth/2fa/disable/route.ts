// API Route pour désactiver le 2FA
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { verifyTwoFactor } from '@/lib/two-factor';
import { logAuditEvent, getRequestInfo } from '@/lib/audit-log';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { password, token } = body;

    // Get user with 2FA info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
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

    // Verify password
    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { error: 'Mot de passe requis' },
          { status: 400 }
        );
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return NextResponse.json(
          { error: 'Mot de passe incorrect' },
          { status: 401 }
        );
      }
    }

    // Verify 2FA token
    if (!token) {
      return NextResponse.json(
        { error: 'Code 2FA requis' },
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

    // Disable 2FA
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: [],
      },
    });

    // Log the event
    const requestInfo = getRequestInfo(request);
    await logAuditEvent({
      action: 'PASSWORD_CHANGE',
      userId: session.user.id,
      success: true,
      details: { action: '2FA_DISABLED' },
      ...requestInfo,
    });

    return NextResponse.json({
      success: true,
      message: 'Authentification à deux facteurs désactivée.',
    });
  } catch (error) {
    console.error('2FA disable error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la désactivation du 2FA' },
      { status: 500 }
    );
  }
}
