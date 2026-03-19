# Deploy Bocanv to GitHub, Railway & Vercel

## 1. Push to GitHub

```bash
cd /Users/massi.media/Sandbox/bocanv

# Initialize git (if not already)
git init

# Add all files
git add .
git commit -m "Initial commit: Medusa backend + Next.js storefront"

# Create repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/bocanv.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy Backend to Railway

### 2.1 Create Project

1. Go to [railway.app](https://railway.app) and sign in (GitHub).
2. **New Project** → **Deploy from GitHub repo** → select `bocanv`.
3. Railway will deploy the root. We need the **backend** only.

### 2.2 Configure Backend Service

1. Click the deployed service → **Settings**.
2. **Root Directory**: set to `backend`.
3. **Start Command**: `npm run start:prod` (or leave empty – it’s in `railway.json`).

### 2.3 Add PostgreSQL

1. In the project, click **+ New** → **Database** → **PostgreSQL**.
2. Wait for it to provision.
3. Click the PostgreSQL service → **Variables** → copy `DATABASE_URL`.
4. In your backend service → **Variables** → **Add Variable** → paste `DATABASE_URL`.

### 2.4 Add Redis

1. **+ New** → **Database** → **Redis**.
2. Copy `REDIS_URL` from the Redis service.
3. Add `REDIS_URL` to the backend service variables.

### 2.5 Backend Environment Variables

Add these to the backend service (Variables tab):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | From PostgreSQL (auto-linked if you use “Add Reference”) |
| `REDIS_URL` | From Redis |
| `BACKEND_URL` | `https://YOUR-APP.up.railway.app` (set after first deploy) |
| `STORE_CORS` | `https://your-store.vercel.app` (Vercel URL) |
| `ADMIN_CORS` | Same as `BACKEND_URL` |
| `AUTH_CORS` | Same as `STORE_CORS` |
| `JWT_SECRET` | Random string (e.g. `openssl rand -hex 32`) |
| `COOKIE_SECRET` | Random string |
| `MEDUSA_FF_CACHING` | `true` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

Optional (Stripe):

| Variable | Value |
|----------|-------|
| `STRIPE_API_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook |

### 2.6 Deploy & Get URL

1. Railway will redeploy when you add variables.
2. **Settings** → **Networking** → **Generate Domain**.
3. Copy the URL (e.g. `https://bocanv-backend.up.railway.app`).
4. Set `BACKEND_URL` to this URL and redeploy if needed.

### 2.7 Create Admin User

After the first successful deploy:

```bash
cd backend
MEDUSA_ADMIN_EMAIL=mail@massimedia.dk MEDUSA_ADMIN_PASSWORD=Ma5terMa55! npm run create-admin
```

Use `DATABASE_URL` from Railway (or run this from a machine that can reach the Railway DB).  
Or use Railway’s **Run Command** if available.

### 2.8 Fix Admin Email Typo (if needed)

If the admin email was created with a typo (e.g. `mail@massiemdia.dk` instead of `mail@massimedia.dk`):

**Option A – Medusa script:** `cd backend` then `DATABASE_URL="your-railway-url" npm run fix-admin-email`

**Option B – Manual SQL:** Update `"user"` table: `UPDATE "user" SET email = 'mail@massimedia.dk' WHERE email = 'mail@massiemdia.dk';`  
Then find auth tables with `SELECT table_schema, table_name FROM information_schema.tables WHERE table_name LIKE '%provider%' OR table_name LIKE '%identity%';` and update the provider identity table's `entity_id` column.

---

## 3. Deploy Storefront to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub).
2. **Add New** → **Project** → import `bocanv`.
3. **Root Directory**: click **Edit** → set to `storefront`.
4. Framework Preset: Next.js (auto-detected).

### 3.2 Environment Variables

Add these in Vercel → Project → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `MEDUSA_BACKEND_URL` | `https://YOUR-APP.up.railway.app` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | From Medusa admin (Settings → Publishable API Keys) |
| `NEXT_PUBLIC_BASE_URL` | `https://your-store.vercel.app` |
| `REVALIDATE_SECRET` | Random string |
| `NEXT_PUBLIC_DEFAULT_REGION` | `dk` (or your default region) |

Optional (Stripe):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_STRIPE_KEY` | `pk_live_...` |

### 3.3 Publishable Key

1. Open Medusa admin: `https://YOUR-BACKEND.up.railway.app/app`.
2. Log in.
3. **Settings** → **Publishable API Keys**.
4. Create or copy the key linked to your sales channel.
5. Add it as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` in Vercel.

### 3.4 Deploy

1. Click **Deploy**.
2. After deploy, copy the Vercel URL.
3. Add this URL to the backend `STORE_CORS` and `AUTH_CORS` on Railway and redeploy.

---

## 4. Final Checklist

- [ ] Backend on Railway with PostgreSQL + Redis
- [ ] `BACKEND_URL`, `STORE_CORS`, `AUTH_CORS` set correctly
- [ ] Admin user created
- [ ] Publishable key created and added to Vercel
- [ ] Storefront on Vercel with correct env vars
- [ ] Stripe webhook (if using payments): `https://YOUR-BACKEND.up.railway.app/hooks/stripe`

---

## 5. Stripe Webhook (Optional)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint.
2. URL: `https://YOUR-BACKEND.up.railway.app/hooks/stripe`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, etc. (or all).
4. Copy the signing secret and set `STRIPE_WEBHOOK_SECRET` in Railway.
