# Registre des Traitements de Données Personnelles

**MediTrouve**
Document conforme à l'Article 30 du RGPD
Dernière mise à jour : Janvier 2025

---

## 1. Informations sur le Responsable de Traitement

| Champ | Valeur |
|-------|--------|
| Raison sociale | [À compléter] |
| SIRET | [À compléter] |
| Adresse | [À compléter] |
| Email DPO | dpo@meditrouve.fr |
| Téléphone | [À compléter] |

---

## 2. Registre des Activités de Traitement

### 2.1 Gestion des comptes utilisateurs

| Champ | Détail |
|-------|--------|
| **Finalité** | Création et gestion des comptes utilisateurs |
| **Base légale** | Exécution du contrat (Article 6.1.b) |
| **Catégories de personnes** | Utilisateurs de l'application |
| **Catégories de données** | Email, nom (optionnel), mot de passe hashé, téléphone (optionnel) |
| **Destinataires** | Personnel habilité, hébergeur (Vercel) |
| **Transferts hors UE** | Non |
| **Durée de conservation** | Durée de vie du compte + 30 jours |
| **Mesures de sécurité** | Chiffrement, hashing bcrypt, HTTPS |

### 2.2 Suivi des médicaments et alertes

| Champ | Détail |
|-------|--------|
| **Finalité** | Alerter les utilisateurs des ruptures de médicaments |
| **Base légale** | Consentement explicite (Article 9.2.a) - Données de santé |
| **Catégories de personnes** | Utilisateurs ayant créé des alertes |
| **Catégories de données** | Liste des médicaments suivis, préférences d'alerte |
| **Destinataires** | Personnel habilité |
| **Transferts hors UE** | Non |
| **Durée de conservation** | Durée de vie du compte + 30 jours |
| **Mesures de sécurité** | Chiffrement au repos, accès restreint, audit logs |

### 2.3 Rappels de prise de médicaments

| Champ | Détail |
|-------|--------|
| **Finalité** | Rappeler aux utilisateurs de prendre leurs médicaments |
| **Base légale** | Consentement explicite (Article 9.2.a) - Données de santé |
| **Catégories de personnes** | Utilisateurs avec rappels actifs |
| **Catégories de données** | Médicaments, dosages, horaires de prise |
| **Destinataires** | Personnel habilité, Firebase (notifications) |
| **Transferts hors UE** | Oui (Firebase/Google - CCT) |
| **Durée de conservation** | Durée de vie du compte + 30 jours |
| **Mesures de sécurité** | Chiffrement, notifications push sécurisées |

### 2.4 Scan d'ordonnances (OCR)

| Champ | Détail |
|-------|--------|
| **Finalité** | Extraire automatiquement les médicaments d'une ordonnance |
| **Base légale** | Consentement explicite (Article 9.2.a) - Données de santé |
| **Catégories de personnes** | Utilisateurs Premium/Famille |
| **Catégories de données** | Image d'ordonnance, médicaments extraits, nom du médecin |
| **Destinataires** | Personnel habilité, OpenAI (traitement OCR) |
| **Transferts hors UE** | Oui (OpenAI - CCT) |
| **Durée de conservation** | Durée de vie du compte + 30 jours |
| **Mesures de sécurité** | Chiffrement, images non stockées après traitement |

### 2.5 Gestion des profils famille

| Champ | Détail |
|-------|--------|
| **Finalité** | Permettre la gestion des médicaments de plusieurs personnes |
| **Base légale** | Consentement explicite (Article 9.2.a) - Données de santé |
| **Catégories de personnes** | Utilisateurs Famille et leurs proches |
| **Catégories de données** | Nom, relation, date de naissance, médicaments |
| **Destinataires** | Personnel habilité, utilisateurs autorisés |
| **Transferts hors UE** | Non |
| **Durée de conservation** | Durée de vie du compte + 30 jours |
| **Mesures de sécurité** | Contrôle d'accès par rôle, audit logs |

### 2.6 Paiements et abonnements

| Champ | Détail |
|-------|--------|
| **Finalité** | Gérer les abonnements et paiements |
| **Base légale** | Exécution du contrat (Article 6.1.b) |
| **Catégories de personnes** | Utilisateurs payants |
| **Catégories de données** | ID client Stripe (pas de données CB stockées) |
| **Destinataires** | Stripe |
| **Transferts hors UE** | Oui (Stripe - CCT + DPF) |
| **Durée de conservation** | 10 ans (obligation comptable) |
| **Mesures de sécurité** | Stripe PCI-DSS, tokenisation |

### 2.7 Envoi de notifications

| Champ | Détail |
|-------|--------|
| **Finalité** | Envoyer des notifications email et push |
| **Base légale** | Exécution du contrat + Consentement |
| **Catégories de personnes** | Tous les utilisateurs |
| **Catégories de données** | Email, tokens push, préférences |
| **Destinataires** | Resend (email), Firebase (push) |
| **Transferts hors UE** | Oui (CCT) |
| **Durée de conservation** | Durée de vie du compte |
| **Mesures de sécurité** | Chiffrement TLS, tokens révocables |

### 2.8 Analytics et logs de sécurité

| Champ | Détail |
|-------|--------|
| **Finalité** | Sécurité, détection de fraude, amélioration du service |
| **Base légale** | Intérêt légitime (Article 6.1.f) + Obligation légale |
| **Catégories de personnes** | Tous les visiteurs |
| **Catégories de données** | IP (anonymisée), pages visitées, timestamp |
| **Destinataires** | Personnel habilité |
| **Transferts hors UE** | Non |
| **Durée de conservation** | 12 mois |
| **Mesures de sécurité** | Anonymisation, accès restreint |

---

## 3. Sous-traitants

| Sous-traitant | Finalité | Localisation | Garanties |
|---------------|----------|--------------|-----------|
| Vercel | Hébergement | UE (Francfort) | DPA signé |
| Supabase/PlanetScale | Base de données | UE | DPA signé |
| Stripe | Paiements | USA + UE | CCT + DPF |
| Resend | Emails | USA | CCT |
| Firebase/Google | Notifications push | USA + UE | CCT + DPF |
| OpenAI | OCR ordonnances | USA | CCT + DPA |

---

## 4. Mesures de Sécurité Techniques et Organisationnelles

### 4.1 Mesures techniques
- Chiffrement HTTPS/TLS 1.3 pour toutes les communications
- Chiffrement AES-256 des données sensibles au repos
- Hashing bcrypt des mots de passe (coût 12)
- Tokens JWT avec expiration courte
- Rate limiting par IP et endpoint
- Headers de sécurité (CSP, HSTS, X-Frame-Options)
- Protection CSRF
- Validation des entrées avec Zod

### 4.2 Mesures organisationnelles
- Principe du moindre privilège
- Audit logs des accès aux données
- Formation RGPD du personnel
- Procédure de gestion des violations de données
- Revue de sécurité périodique

---

## 5. Procédure de Gestion des Demandes RGPD

### 5.1 Droit d'accès
- Endpoint : `GET /api/user/data-export`
- Délai : Immédiat (automatisé)
- Format : JSON

### 5.2 Droit de rectification
- Interface : Paramètres du profil
- Délai : Immédiat

### 5.3 Droit à l'effacement
- Endpoint : `DELETE /api/user/delete-account`
- Délai : 30 jours (période d'annulation)
- Confirmation requise : Mot de passe + phrase

### 5.4 Droit à la portabilité
- Endpoint : `GET /api/user/data-export`
- Format : JSON
- Délai : Immédiat

---

## 6. Historique des Modifications

| Date | Version | Modification | Auteur |
|------|---------|--------------|--------|
| Janvier 2025 | 1.0 | Création du registre | DPO |

---

## 7. Signature

Ce registre est tenu à jour par le Délégué à la Protection des Données.

**DPO :** ____________________
**Date :** ____________________
