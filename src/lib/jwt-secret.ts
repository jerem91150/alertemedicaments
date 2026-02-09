// Centralized JWT secret validation - no fallbacks allowed

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

export function getJwtSecret(): string {
  return getRequiredEnv("JWT_SECRET");
}

export function getJwtSecretBytes(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
}

export function getEncryptionKey(): string {
  // ENCRYPTION_KEY should be set separately from JWT_SECRET in production
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    console.warn(
      "[SECURITY] ENCRYPTION_KEY not set — falling back to JWT_SECRET. Set a dedicated ENCRYPTION_KEY in production."
    );
    return getRequiredEnv("JWT_SECRET");
  }
  return key;
}
