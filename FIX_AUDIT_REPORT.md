# 🔧 Rapport de correction — Audit MediTrouve

**Date** : 2026-02-09  
**Branche** : `fix/audit-critical-issues`  
**PR** : https://github.com/jerem91150/meditrouve/pull/new/fix/audit-critical-issues

---

## ✅ Urgences critiques corrigées (5/5)

### 1. 🔴 Build Vercel cassé → ✅ CORRIGÉ
- Ajouté `export const dynamic = 'force-dynamic'` dans `/blog/page.tsx` et `/blog/[slug]/page.tsx`
- Les pages blog sont maintenant rendues dynamiquement (ƒ) au lieu de SSG
- Build Next.js passe sans erreur

### 2. 🔴 23 vulnérabilités NPM → ✅ CORRIGÉ
- `npm audit fix --force` : mise à jour de `next` vers 16.1.6
- **Résultat** : 0 vulnérabilités

### 3. 🔴 Register sans validation Zod → ✅ CORRIGÉ
- Schema Zod complet : email validé, password min 8 chars + majuscule + minuscule + chiffre
- Sanitization : trim, lowercase email
- Gestion JSON malformé (SyntaxError catch)
- Erreurs structurées retournées en 400

### 4. 🔴 XSS via dangerouslySetInnerHTML → ✅ CORRIGÉ
- Installé `isomorphic-dompurify` (compatible SSR)
- Contenu HTML sanitizé avec whitelist stricte de tags/attributs
- Tags autorisés : h1-h4, p, br, strong, em, a, ul, li
- Attributs autorisés : href, target, rel, class

### 5. 🔴 CryptoJS obsolète → ✅ CORRIGÉ
- Migration complète vers `node:crypto` natif
- Nouveau chiffrement : **AES-256-GCM** (authentifié) au lieu de AES-CBC
- Dérivation de clé avec **scrypt** au lieu de passphrase brute
- **Rétro-compatibilité** : les données chiffrées avec CryptoJS peuvent toujours être déchiffrées
- Nouveau format identifié par préfixe `$GCM$`
- Suppression des dépendances `crypto-js` et `@types/crypto-js`

---

## 🟡 Problèmes importants traités

### 9. Encryption Key = JWT_SECRET → ✅ AMÉLIORÉ
- Ajout d'un warning runtime quand `ENCRYPTION_KEY` n'est pas défini séparément
- Le code supporte déjà une variable `ENCRYPTION_KEY` dédiée
- **Action requise** : définir `ENCRYPTION_KEY` dans Vercel env vars

---

## 🟡 Problèmes restants (non bloquants)

### 6. Rate Limiting in-memory
- Le rate limiting utilise toujours un `Map` en mémoire
- **Recommandation** : migrer vers Upstash Redis / `@upstash/ratelimit`

### 7. CSP unsafe-inline
- Non traité — nécessite des nonces CSP avec configuration Next.js middleware
- **Recommandation** : implémenter dans un PR dédié

### 8. Connection Pooling Prisma
- Non traité — dépend de la configuration de la DATABASE_URL
- **Recommandation** : ajouter `?pgbouncer=true&connection_limit=1` ou Prisma Accelerate

---

## 📊 Résultats

| Critère | Avant | Après |
|---------|-------|-------|
| Build Vercel | ❌ Cassé | ✅ Passe |
| Vulnérabilités npm | 23 (22 high, 1 moderate) | 0 |
| Validation register | ❌ Basique | ✅ Zod complet |
| XSS blog | ❌ Vulnérable | ✅ DOMPurify |
| Chiffrement | ❌ CryptoJS/CBC | ✅ node:crypto/GCM |
