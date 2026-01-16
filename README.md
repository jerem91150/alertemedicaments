# MediTrouve

Application de suivi des ruptures de medicaments en France.

## Description

MediTrouve permet aux patients de suivre la disponibilite de leurs medicaments et de recevoir des alertes en temps reel en cas de rupture ou de retour a la disponibilite. Les donnees proviennent de l'ANSM (Agence Nationale de Securite du Medicament).

## Fonctionnalites

- Recherche de medicaments par nom, molecule ou laboratoire
- Alertes personnalisees (email, push)
- Scan d'ordonnance par OCR
- Carte des pharmacies
- Mode famille (multi-profils)
- Authentification securisee avec 2FA

## Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Emails**: Resend

## Installation

```bash
# Cloner le repo
git clone https://github.com/votre-repo/meditrouve.git
cd meditrouve

# Installer les dependances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Initialiser la base de donnees
npx prisma migrate dev

# Lancer le serveur de dev
npm run dev
```

## Variables d'environnement

Voir `.env.example` pour la liste complete.

## Deploiement

Le projet est deploye sur Vercel avec une base PostgreSQL.

```bash
npm run build
```

## Licence

Tous droits reserves - MediTrouve 2025
