import { createCipheriv, createDecipheriv, randomBytes, createHash, scryptSync } from "node:crypto";
import { getEncryptionKey } from "./jwt-secret";

// Get encryption key from environment - no fallback allowed
const ENCRYPTION_KEY = getEncryptionKey();

// Derive a proper 32-byte key from the secret
function deriveKey(secret: string): Buffer {
  return scryptSync(secret, "meditrouve-salt", 32);
}

// ============================================================
// Legacy CryptoJS compatibility layer (for existing encrypted data)
// ============================================================

// CryptoJS AES.encrypt with passphrase uses OpenSSL's EVP_BytesToKey
function evpBytesToKey(password: string, salt: Buffer): { key: Buffer; iv: Buffer } {
  const data = Buffer.concat([Buffer.from(password, "utf8"), salt]);
  let hash = createHash("md5").update(data).digest();
  let result = hash;
  while (result.length < 48) {
    hash = createHash("md5").update(Buffer.concat([hash, data])).digest();
    result = Buffer.concat([result, hash]);
  }
  return { key: result.subarray(0, 32), iv: result.subarray(32, 48) };
}

function legacyDecrypt(encryptedBase64: string, passphrase: string): string {
  const raw = Buffer.from(encryptedBase64, "base64");
  // CryptoJS format: "Salted__" + 8 bytes salt + ciphertext
  if (raw.subarray(0, 8).toString("utf8") === "Salted__") {
    const salt = raw.subarray(8, 16);
    const ciphertext = raw.subarray(16);
    const { key, iv } = evpBytesToKey(passphrase, salt);
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  }
  throw new Error("Unknown legacy encryption format");
}

// ============================================================
// New AES-256-GCM encryption
// ============================================================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
// Prefix to identify new format
const NEW_FORMAT_PREFIX = "$GCM$";

export function encryptData(data: string): string {
  const key = deriveKey(ENCRYPTION_KEY);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: $GCM$ + base64(iv + authTag + ciphertext)
  const combined = Buffer.concat([iv, authTag, encrypted]);
  return NEW_FORMAT_PREFIX + combined.toString("base64");
}

export function decryptData(encryptedData: string): string {
  // New GCM format
  if (encryptedData.startsWith(NEW_FORMAT_PREFIX)) {
    const key = deriveKey(ENCRYPTION_KEY);
    const raw = Buffer.from(encryptedData.slice(NEW_FORMAT_PREFIX.length), "base64");
    const iv = raw.subarray(0, IV_LENGTH);
    const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  }

  // Legacy CryptoJS format (backward compatibility)
  try {
    return legacyDecrypt(encryptedData, ENCRYPTION_KEY);
  } catch {
    throw new Error("Failed to decrypt data");
  }
}

// Hash sensitive data for storage (one-way, for comparison)
export function hashData(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

// Encrypt object to JSON string
export function encryptObject(obj: object): string {
  return encryptData(JSON.stringify(obj));
}

// Decrypt JSON string to object
export function decryptObject<T>(encryptedData: string): T {
  const decrypted = decryptData(encryptedData);
  return JSON.parse(decrypted) as T;
}

// Mask sensitive data for logging/display
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***";
  const maskedLocal = local.substring(0, 2) + "***";
  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return "****";
  return phone.substring(0, 2) + "****" + phone.substring(phone.length - 2);
}

export function maskName(name: string): string {
  if (name.length < 2) return "**";
  return name.charAt(0) + "*".repeat(name.length - 1);
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(length);
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(bytes[i] % chars.length);
  }
  return token;
}

// Encrypt prescription/medical data (extra protection for health data)
export function encryptHealthData(data: object): { encrypted: string; iv: string } {
  const key = deriveKey(ENCRYPTION_KEY).subarray(0, 32);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([authTag, encrypted]);
  return {
    encrypted: combined.toString("base64"),
    iv: iv.toString("hex"),
  };
}

export function decryptHealthData<T>(encrypted: string, iv: string): T {
  const key = deriveKey(ENCRYPTION_KEY).subarray(0, 32);
  const ivBuf = Buffer.from(iv, "hex");
  const raw = Buffer.from(encrypted, "base64");
  const authTag = raw.subarray(0, AUTH_TAG_LENGTH);
  const ciphertext = raw.subarray(AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, ivBuf, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  return JSON.parse(
    Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8")
  ) as T;
}
