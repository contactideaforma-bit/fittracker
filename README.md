# FitTracker — Guide de démarrage

## 1. Installer les dépendances

```bash
npm install
```

## 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez `.env.local` avec :
- `NEXT_PUBLIC_SUPABASE_URL` → Settings > API de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → même page
- `ANTHROPIC_API_KEY` → console.anthropic.com

## 3. Créer la base de données Supabase

Dans l'éditeur SQL de Supabase, collez et exécutez le contenu de `supabase/schema.sql`.

## 4. Activer Google OAuth (optionnel)

Dans Supabase → Authentication → Providers → Google :
- Activez Google
- Renseignez Client ID et Secret depuis Google Cloud Console
- URL de callback : `https://VOTRE_PROJECT_ID.supabase.co/auth/v1/callback`

## 5. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
src/
├── app/
│   ├── auth/page.tsx          # Page de connexion
│   ├── dashboard/
│   │   ├── layout.tsx         # Layout avec navbar
│   │   └── page.tsx           # Dashboard principal
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx
│   │   └── KpiCard.tsx
│   └── dashboard/
│       ├── WeekCalendar.tsx
│       ├── CaloriesChart.tsx
│       └── RecentSessions.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Client navigateur
│   │   └── server.ts          # Client serveur
│   ├── queries.ts             # Toutes les requêtes Supabase
│   └── utils.ts               # Utilitaires
├── types/index.ts             # Types TypeScript
└── middleware.ts              # Protection des routes
```

## Prochaines étapes

- [ ] Étape 2 : Vue séance live avec Claude API
- [ ] Étape 3 : Historique éditable
- [ ] Étape 4 : Module coach IA
