// Schémas de validation Zod centralisés
// Protection contre les injections et données malformées

import { z } from 'zod';

// ============================================
// UTILISATEUR & AUTH
// ============================================

export const emailSchema = z
  .string()
  .email('Adresse email invalide')
  .max(255, 'Email trop long')
  .transform((email) => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Le mot de passe est trop long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
  );

export const nameSchema = z
  .string()
  .min(1, 'Le nom est requis')
  .max(100, 'Le nom est trop long')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides')
  .transform((name) => name.trim());

export const phoneSchema = z
  .string()
  .regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Numéro de téléphone invalide')
  .optional()
  .nullable();

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema.optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
});

// ============================================
// PROFILS
// ============================================

export const relationSchema = z.enum(['self', 'parent', 'child', 'spouse', 'other']);

export const profileSchema = z.object({
  name: nameSchema,
  relation: relationSchema.optional().default('self'),
  birthDate: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform((date) => (date ? new Date(date) : null)),
  notes: z
    .string()
    .max(500, 'Les notes sont trop longues')
    .optional()
    .nullable(),
});

// ============================================
// MÉDICAMENTS & ALERTES
// ============================================

export const medicationSearchSchema = z.object({
  query: z
    .string()
    .min(2, 'La recherche doit contenir au moins 2 caractères')
    .max(200, 'La recherche est trop longue')
    .transform((q) => q.trim()),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const alertTypeSchema = z.enum([
  'RUPTURE',
  'TENSION',
  'AVAILABLE',
  'PREDICTION',
  'ANY_CHANGE',
]);

export const createAlertSchema = z.object({
  medicationId: z.string().cuid('ID de médicament invalide'),
  type: alertTypeSchema.optional().default('AVAILABLE'),
});

// ============================================
// RAPPELS
// ============================================

export const reminderTimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format d\'heure invalide (HH:MM)');

export const reminderSchema = z.object({
  profileId: z.string().cuid('ID de profil invalide'),
  userMedicationId: z.string().cuid('ID de médicament invalide'),
  scheduledTime: z.string().datetime('Date/heure invalide'),
});

export const updateReminderSchema = z.object({
  status: z.enum(['PENDING', 'SENT', 'TAKEN', 'SKIPPED', 'POSTPONED']),
  takenAt: z.string().datetime().optional().nullable(),
  postponedTo: z.string().datetime().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

// ============================================
// PHARMACIES
// ============================================

export const coordinatesSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export const pharmacySearchSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(100).max(50000).optional().default(5000),
  medicationId: z.string().cuid().optional(),
});

export const pharmacyReportSchema = z.object({
  pharmacyId: z.string().cuid('ID de pharmacie invalide'),
  medicationId: z.string().cuid('ID de médicament invalide'),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'LIMITED']),
  quantity: z.coerce.number().min(0).max(9999).optional().nullable(),
  price: z.coerce.number().min(0).max(9999.99).optional().nullable(),
});

// ============================================
// ORDONNANCES (OCR)
// ============================================

export const ordonnanceSchema = z.object({
  imageUrl: z
    .string()
    .url('URL d\'image invalide')
    .max(2000, 'URL trop longue'),
  profileId: z.string().cuid().optional().nullable(),
});

// ============================================
// STRIPE / PAIEMENTS
// ============================================

export const checkoutSchema = z.object({
  plan: z.enum(['PREMIUM', 'FAMILLE']),
  billing: z.enum(['monthly', 'yearly']),
});

// ============================================
// PAGINATION
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

// ============================================
// HELPERS
// ============================================

// Sanitize string input (remove potential XSS)
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize search query
export function sanitizeSearchQuery(query: string): string {
  return sanitizeString(query)
    .replace(/[^\w\sÀ-ÿ'-]/g, '') // Keep only alphanumeric, spaces, accents, hyphens
    .substring(0, 200);
}

// UUID/CUID validation
export const idSchema = z.string().cuid('ID invalide');

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Validate request body with schema
export async function validateBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: z.ZodError }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Corps de requête invalide',
          path: [],
        },
      ]),
    };
  }
}

// Format Zod errors for API response
export function formatZodErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((err) => ({
    field: err.path.join('.') || 'body',
    message: err.message,
  }));
}
