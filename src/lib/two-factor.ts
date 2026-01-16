// Service d'authentification à deux facteurs (2FA / TOTP)
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { encryptData, decryptData, generateSecureToken } from './encryption';

const APP_NAME = 'MediTrouve';

// TOTP configuration
const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30; // seconds

// Generate a new TOTP secret for a user
export function generateTwoFactorSecret(): string {
  // Generate a random 20-byte secret and encode it as base32
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

// Encrypt the secret for storage
export function encryptSecret(secret: string): string {
  return encryptData(secret);
}

// Decrypt the stored secret
export function decryptSecret(encryptedSecret: string): string {
  return decryptData(encryptedSecret);
}

// Generate the otpauth URL for QR code
export function generateOtpAuthUrl(email: string, secret: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: APP_NAME,
    label: email,
    algorithm: 'SHA1',
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: secret,
  });
  return totp.toString();
}

// Generate QR code as data URL
export async function generateQRCodeDataUrl(otpAuthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpAuthUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 200,
  });
}

// Verify a TOTP token
export function verifyTwoFactorToken(token: string, secret: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: APP_NAME,
      algorithm: 'SHA1',
      digits: TOTP_DIGITS,
      period: TOTP_PERIOD,
      secret: secret,
    });
    // delta returns null if invalid, or the time step difference if valid
    const delta = totp.validate({ token, window: 1 });
    return delta !== null;
  } catch {
    return false;
  }
}

// Generate backup codes (one-time use)
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = generateSecureToken(8).toUpperCase();
    // Format as XXXX-XXXX for readability
    codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
  }
  return codes;
}

// Encrypt backup codes for storage
export function encryptBackupCodes(codes: string[]): string[] {
  return codes.map((code) => encryptData(code));
}

// Check if a backup code is valid and remove it if so
export function verifyBackupCode(
  inputCode: string,
  encryptedCodes: string[]
): { valid: boolean; remainingCodes: string[] } {
  const normalizedInput = inputCode.toUpperCase().replace(/[^A-Z0-9]/g, '');

  for (let i = 0; i < encryptedCodes.length; i++) {
    try {
      const decryptedCode = decryptData(encryptedCodes[i]);
      const normalizedStored = decryptedCode.replace(/[^A-Z0-9]/g, '');

      if (normalizedInput === normalizedStored) {
        // Remove the used code
        const remainingCodes = [...encryptedCodes];
        remainingCodes.splice(i, 1);
        return { valid: true, remainingCodes };
      }
    } catch {
      // Skip invalid codes
      continue;
    }
  }

  return { valid: false, remainingCodes: encryptedCodes };
}

// Full 2FA setup response
export interface TwoFactorSetupResponse {
  secret: string; // Plain secret for user to save
  encryptedSecret: string; // For storage
  qrCodeUrl: string; // Data URL for QR code
  backupCodes: string[]; // Plain backup codes for user
  encryptedBackupCodes: string[]; // For storage
}

// Setup 2FA for a user
export async function setupTwoFactor(email: string): Promise<TwoFactorSetupResponse> {
  const secret = generateTwoFactorSecret();
  const otpAuthUrl = generateOtpAuthUrl(email, secret);
  const qrCodeUrl = await generateQRCodeDataUrl(otpAuthUrl);
  const backupCodes = generateBackupCodes(10);

  return {
    secret,
    encryptedSecret: encryptSecret(secret),
    qrCodeUrl,
    backupCodes,
    encryptedBackupCodes: encryptBackupCodes(backupCodes),
  };
}

// Verify 2FA during login
export interface TwoFactorVerifyResult {
  valid: boolean;
  method: 'totp' | 'backup' | null;
  remainingBackupCodes?: string[];
}

export function verifyTwoFactor(
  token: string,
  encryptedSecret: string,
  encryptedBackupCodes: string[]
): TwoFactorVerifyResult {
  // First, try TOTP
  try {
    const secret = decryptSecret(encryptedSecret);
    if (verifyTwoFactorToken(token, secret)) {
      return { valid: true, method: 'totp' };
    }
  } catch {
    // Secret decryption failed, try backup code
  }

  // Then, try backup code
  const backupResult = verifyBackupCode(token, encryptedBackupCodes);
  if (backupResult.valid) {
    return {
      valid: true,
      method: 'backup',
      remainingBackupCodes: backupResult.remainingCodes,
    };
  }

  return { valid: false, method: null };
}
