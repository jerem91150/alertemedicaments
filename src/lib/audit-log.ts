import prisma from "@/lib/prisma";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_CHANGE"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_COMPLETE"
  | "ACCOUNT_DELETION"
  | "ACCOUNT_DELETED"
  | "DATA_EXPORT"
  | "PROFILE_CREATE"
  | "PROFILE_UPDATE"
  | "PROFILE_DELETE"
  | "ALERT_CREATE"
  | "ALERT_DELETE"
  | "MEDICATION_SEARCH"
  | "ORDONNANCE_SCAN"
  | "CONSENT_UPDATE"
  | "PUSH_TOKEN_REGISTER"
  | "CHECKOUT_INITIATED"
  | "SUBSCRIPTION_CREATED"
  | "SUBSCRIPTION_UPDATED"
  | "SUBSCRIPTION_CANCELLED"
  | "SUBSCRIPTION_CANCELLATION_SCHEDULED"
  | "PAYMENT_FAILED"
  | "PORTAL_ACCESSED"
  | "SUSPICIOUS_ACTIVITY";

export interface AuditLogEntry {
  action: AuditAction;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  success: boolean;
  errorMessage?: string;
}

// Simplified audit log for common cases
interface SimpleAuditLog {
  userId: string;
  action: AuditAction;
  resource?: string;
  details?: Record<string, unknown>;
}

// In production, use a proper logging service (DataDog, Splunk, etc.)
export async function logAuditEvent(entry: AuditLogEntry | SimpleAuditLog): Promise<void> {
  // Convert simple format to full format
  const fullEntry: AuditLogEntry = 'success' in entry
    ? entry
    : {
        action: entry.action,
        userId: entry.userId,
        details: { ...entry.details, resource: entry.resource },
        success: true,
      };
  const logEntry = {
    ...fullEntry,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };

  // Console log for development
  if (process.env.NODE_ENV === "development") {
    console.log("[AUDIT]", JSON.stringify(logEntry, null, 2));
  }

  // Store security-relevant events in database
  const securityActions: AuditAction[] = [
    "LOGIN_FAILED",
    "PASSWORD_CHANGE",
    "PASSWORD_RESET_REQUEST",
    "PASSWORD_RESET_COMPLETE",
    "ACCOUNT_DELETION",
    "DATA_EXPORT",
    "SUSPICIOUS_ACTIVITY",
  ];

  if (securityActions.includes(fullEntry.action) && fullEntry.userId) {
    try {
      await prisma.notification.create({
        data: {
          userId: fullEntry.userId,
          type: "AVAILABLE_ALERT",
          title: `Activité de sécurité: ${fullEntry.action}`,
          message: fullEntry.success
            ? `Action effectuée avec succès`
            : `Tentative échouée: ${fullEntry.errorMessage || "Erreur inconnue"}`,
          data: {
            action: fullEntry.action,
            ip: fullEntry.ip,
            userAgent: fullEntry.userAgent?.substring(0, 200),
            timestamp: logEntry.timestamp,
          },
          read: fullEntry.success, // Mark failed attempts as unread
        },
      });
    } catch (error) {
      console.error("Failed to store audit log:", error);
    }
  }

  // For production: send to external logging service
  if (process.env.NODE_ENV === "production" && process.env.LOG_WEBHOOK_URL) {
    try {
      await fetch(process.env.LOG_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error("Failed to send audit log to webhook:", error);
    }
  }
}

// Helper to extract request info
export function getRequestInfo(request: Request) {
  return {
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown",
    userAgent: request.headers.get("user-agent") || "unknown",
  };
}

// Detect suspicious activity
export function detectSuspiciousActivity(
  action: AuditAction,
  userId: string | undefined,
  ip: string
): boolean {
  // In production, implement more sophisticated detection:
  // - Too many failed login attempts
  // - Login from new location/device
  // - Unusual data access patterns
  // - etc.

  // For now, just log everything
  return false;
}
