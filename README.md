# Bocanv – Restaurant Ecommerce

Production-ready fullstack ecommerce for a small restaurant (empanada takeaway and bar).

- **Backend**: Medusa (PostgreSQL, Redis, Cloudinary)
- **Storefront**: Next.js 15 (Medusa starter)
- **Deploy**: Backend on Railway/Render, Storefront on Vercel

## Project Structure

```
bocanv/
├── backend/          # Medusa server
├── storefront/       # Next.js storefront
├── .env.example      # Environment template
└── README.md
```

## Prerequisites

- Node.js 20+
- PostgreSQL
- Redis (for production)
- Cloudinary account
- Stripe account

## Quick Start

### 0. Start PostgreSQL and Redis (Docker)

```bash
docker compose up -d
```

This starts PostgreSQL on port 5433 and Redis on 6380 (avoids conflicts with system services). The backend `.env` is preconfigured for this setup.

### 1. Backend

```bash
cd backend
# .env already has DATABASE_URL for docker-compose
npm run dev
```

Admin: http://localhost:9000/app

To sync **production data** from Railway into local Docker Postgres (replaces local DB), see **Docs/RUNBOOK.md** → *Copy production DB → local Docker* and run `./scripts/sync-local-db-from-railway.sh`.

### 2. Storefront

```bash
cd storefront
cp .env.example .env.local
# Get publishable key: cd backend && npx medusa exec ./src/scripts/get-publishable-key.ts
# Add the key to .env.local as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
npm install
npm run dev
```

Storefront: http://localhost:8000  
Backend admin: http://localhost:9000/app

## Deploy to GitHub, Railway & Vercel

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions.

---

## Deployment (Summary)

### Backend (Railway or Render)

1. Create PostgreSQL and Redis (Railway/Render or Upstash).
2. Create a new project, connect the `backend/` directory.
3. Set environment variables from `.env.example`.
4. **Start command**: `npm run start:prod`
5. **Important**: Set `BACKEND_URL` to your deployed backend URL (e.g. `https://xxx.up.railway.app`).
6. Set `STORE_CORS` and `AUTH_CORS` to your storefront URL.
7. Set `ADMIN_CORS` to your backend URL.

### Create Admin User (Critical)

After the first deploy, create an admin user to access `/app`:

```bash
cd backend
MEDUSA_ADMIN_EMAIL=admin@example.com MEDUSA_ADMIN_PASSWORD=yourpassword npm run create-admin
```

Or run manually:

```bash
npx medusa user -e admin@example.com -p yourpassword
```

### Storefront (Vercel)

1. Import the `storefront/` directory.
2. Set env vars: `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_STRIPE_KEY`.

### Stripe Webhook

1. In Stripe Dashboard → Webhooks, add: `https://your-backend.up.railway.app/hooks/stripe`
2. Set `STRIPE_WEBHOOK_SECRET` in the backend env.

### Publishable Key

1. Log into Medusa admin at `https://your-backend.up.railway.app/app`
2. Settings → Publishable API Keys → Create
3. Add the key to storefront `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

## Gallery

Edit `storefront/src/lib/data/gallery.json` to add Cloudinary image URLs for the gallery page.

## License

MIT
