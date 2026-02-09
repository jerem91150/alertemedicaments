# 🔧 FIX REPORT - Urgences Critiques AlerteMedicaments

**Date:** 2025-02-09  
**Branche:** `fix/security-critical`  
**Commit:** ac1af45

---

## ✅ 1. JWT Secret en dur (CRITIQUE - sécurité)

**Problème:** 13 fichiers contenaient des secrets JWT/encryption en fallback hardcodé, permettant à l'app de tourner avec des secrets prévisibles.

**Solution:** 
- Créé `src/lib/jwt-secret.ts` — module centralisé avec `getJwtSecret()`, `getJwtSecretBytes()`, `getEncryptionKey()`
- Toutes les fonctions lancent un `throw Error` si la variable d'environnement est absente
- Remplacé tous les fallbacks dans 15 fichiers

**Fichiers modifiés:**
| Fichier | Ancien fallback |
|---------|----------------|
| `src/lib/encryption.ts` | `"default-encryption-key-change-me"` |
| `src/app/api/push-tokens/mobile/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/alerts/mobile/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/auth/mobile/login/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/auth/mobile/register/route.ts` | `"your-secret-key-change-in-production"` |
| `src/app/api/auth/2fa/verify/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/user/data-export/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/user/delete-account/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/subscription/status/route.ts` | `"meditrouve-jwt-secret-2024"` |
| `src/app/api/pharmacien/auth/route.ts` | `"pharmacien-secret-key-change-in-production"` |
| `src/app/api/pharmacien/qr-code/route.ts` | `"pharmacien-secret-key-change-in-production"` |
| `src/app/api/pharmacien/mes-signalements/route.ts` | `"pharmacien-secret-key-change-in-production"` |
| `src/app/api/pharmacien/stats/route.ts` | `"pharmacien-secret-key-change-in-production"` |
| `src/app/api/pharmacien/api-key/route.ts` | `"pharmacien-secret-key-change-in-production"` |
| `src/app/api/pharmacien/ruptures/route.ts` | `"pharmacien-secret-key-change-in-production"` |

**⚠️ Action requise:** S'assurer que `JWT_SECRET` est défini dans `.env` / variables d'environnement de production.

---

## ✅ 2. Prisma Client singleton (CRITIQUE - connexions DB)

**Problème:** 5 fichiers créaient `new PrismaClient()` à chaque import, causant une fuite de connexions DB.

**Solution:** Remplacé par `import prisma from "@/lib/prisma"` (singleton existant avec cache global).

**Fichiers modifiés:**
- `src/lib/auth.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/profile/route.ts`
- `src/app/api/auth/mobile/register/route.ts`
- `src/app/api/cron/sync/route.ts`

---

## ✅ 3. Scraper ANSM non fonctionnel (BLOQUANT)

**Problème:** Le scraper utilisait des sélecteurs CSS génériques (`.medication-row`, `tr[data-medication]`) qui ne matchaient pas le DOM réel de l'ANSM.

**Solution:** Réécriture complète de `src/lib/ansm-scraper.ts` pour utiliser les fichiers open data BDPM locaux :
- `data/CIS_bdpm.txt` — base des médicaments (noms, labos, formes)
- `data/CIS_CIP_Dispo_Spec.txt` — ruptures et tensions d'approvisionnement
- Parsing tab-separated avec encodage latin1
- Supprimé la dépendance au scraping web (cheerio n'est plus utilisé dans ce fichier)
- La fonction `searchMedications()` et les données démo sont conservées

---

## 📊 Résumé

| Urgence | Sévérité | Status |
|---------|----------|--------|
| JWT secrets hardcodés | 🔴 CRITIQUE | ✅ Corrigé (15 fichiers) |
| PrismaClient singleton | 🔴 CRITIQUE | ✅ Corrigé (5 fichiers) |
| Scraper ANSM cassé | 🟠 BLOQUANT | ✅ Réécrit (BDPM local) |

**Total:** 20+ fichiers modifiés, 1 fichier créé (`jwt-secret.ts`), 0 fichier supprimé.
