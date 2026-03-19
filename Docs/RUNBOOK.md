# Bocanv Runbook

Quick reference for building and deploying Bocanv (Medusa backend + Next.js storefront) to the web.

---

## Quick Reference

| Service | URL |
|---------|-----|
| Backend | https://medusa-backend-production-8203.up.railway.app |
| Admin | https://medusa-backend-production-8203.up.railway.app/app |
| Storefront | https://bocanv.vercel.app |

---

## 1. Backend (Railway)

### Setup Checklist

- [ ] Railway project with backend service (Root Directory: `backend`)
- [ ] PostgreSQL added and `DATABASE_URL` linked
- [ ] Redis added and `REDIS_URL` linked
- [ ] Domain generated (Settings → Networking)

### Required Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | From PostgreSQL |
| `REDIS_URL` | From Redis |
| `BACKEND_URL` | `https://medusa-backend-production-8203.up.railway.app` |
| `STORE_CORS` | `https://bocanv.vercel.app` |
| `ADMIN_CORS` | Same as BACKEND_URL |
| `AUTH_CORS` | `https://bocanv.vercel.app` |
| `JWT_SECRET` | Random string |
| `COOKIE_SECRET` | Random string |
| `MEDUSA_ADMIN_EMAIL` | Admin email |
| `MEDUSA_ADMIN_PASSWORD` | Admin password |

**CORS:** `STORE_CORS` and `AUTH_CORS` must be the **storefront URL**, not the backend URL.

### Start Command (from railway.json)

Runs on every deploy: create admin (if new) → migrate → start server.

### Redeploy

Railway → Deployments → Redeploy (or push to GitHub).

---

## 2. Storefront (Vercel)

### Setup Checklist

- [ ] Vercel project imported from GitHub
- [ ] Root Directory: `storefront`
- [ ] Build overrides set (npm, not Yarn)

### Build Overrides (Required)

**Settings** → **Build & Development Settings**:
- Install Command: Override → `npm install`
- Build Command: Override → `npm run build`

### Required Variables

| Variable | Value |
|----------|-------|
| `MEDUSA_BACKEND_URL` | `https://medusa-backend-production-8203.up.railway.app` (include `https://`) |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | From Medusa admin |
| `NEXT_PUBLIC_BASE_URL` | `https://bocanv.vercel.app` |
| `REVALIDATE_SECRET` | Random string |
| `NEXT_PUBLIC_DEFAULT_REGION` | `dk` |

### Publishable Key

Medusa admin → Settings → Publishable API Keys → Create/copy key → Add to Vercel.

### After First Deploy

Add Vercel URL to Railway: `STORE_CORS` and `AUTH_CORS`. Redeploy backend.

### Regions

Medusa admin → Settings → Regions → At least one region with countries (e.g. Denmark).

---

## 3. Admin User

### Create Fresh Admin (Clean Slate)

1. Set `MEDUSA_ADMIN_EMAIL` and `MEDUSA_ADMIN_PASSWORD` in Railway.
2. In Railway PostgreSQL, run:
   ```sql
   DELETE FROM auth_identity;
   DELETE FROM "user";
   ```
3. Redeploy backend.
4. Log in with the credentials.

### Reset Password

1. Railway Variables: Add `ADMIN_EMAIL`, `ADMIN_NEW_PASSWORD`.
2. Add Pre-deploy Command: `npm run reset-admin-password`.
3. Redeploy.
4. Remove Pre-deploy Command and `ADMIN_NEW_PASSWORD` after success.

### Fix Email Typo

Delete user/auth (see Clean Slate), fix `MEDUSA_ADMIN_EMAIL` in variables, redeploy.

---

## 4. Troubleshooting

### Backend: "Failed to fetch" on admin login

- **Fix:** `BACKEND_URL=/` in Dockerfile (already applied). Rebuild and redeploy.

### Backend: "Invalid email or password"

- **Fix:** Clean slate (delete user/auth, set correct variables, redeploy) or reset password script.

### Backend: CORS errors from storefront

- **Fix:** `STORE_CORS` and `AUTH_CORS` = storefront URL (`https://bocanv.vercel.app`).

### Vercel: `yarn install` or `yarn run build` exited with 1

- **Fix:** Override Install Command to `npm install` and Build Command to `npm run build`.

### Vercel: 500 MIDDLEWARE_INVOCATION_FAILED

- **Check:** `MEDUSA_BACKEND_URL` has `https://`, publishable key valid, CORS set on Railway, regions exist in Medusa admin.

### Database: Connect locally

- Use `DATABASE_PUBLIC_URL` (not `DATABASE_URL`) for external connections.
- Enable TCP Proxy on PostgreSQL service.

---

## 5. Project Structure

```
bocanv/
├── backend/       # Medusa (Railway)
├── storefront/    # Next.js (Vercel)
└── Docs/          # This runbook
```
