import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/referral/validate?code=XXXX — Vérifie si un code est valide (public)
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, error: "Code manquant" }, { status: 400 });
  }

  const codeRecord = await prisma.referralCode.findUnique({
    where: { code: code.toUpperCase() },
    include: { user: { select: { name: true } } },
  });

  if (!codeRecord) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    referrerName: codeRecord.user.name || "Un utilisateur",
  });
}
