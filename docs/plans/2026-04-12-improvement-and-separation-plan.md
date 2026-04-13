# Avir Trekkers — Improvement & Separation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the existing React + Express project to production-ready quality. Separate user site and admin portal into independent applications. Revamp UI with modern design.

**Architecture:** 3-app monorepo — shared Express backend + separate React frontends (user site & admin portal). Docker Compose for deployment on VPS.

**Existing Stack:** React 19, Express 4, MongoDB (Atlas), Mongoose, JWT, Formik/Yup, ag-Grid, SMTP email

---

## What Already Exists (DO NOT REBUILD)

The existing codebase has **significant working features**. We improve — not rewrite.

### Backend (Express) — KEEP & IMPROVE
- ✅ 30+ API endpoints (treks, enrollments, reviews, gallery, categories)
- ✅ JWT auth with bcrypt password hashing
- ✅ Multi-participant enrollment with OTP email verification
- ✅ Trek CRUD with itinerary builder support
- ✅ Review system with admin approval workflow
- ✅ Gallery with trek photos + social activities
- ✅ Category management with sort ordering
- ✅ Enrollment data export (PDF/Excel)
- ✅ Rate limiting, Helmet security, CORS config
- ✅ Dockerfile with PM2

### Frontend (React) — KEEP LOGIC, REVAMP UI
- ✅ Full routing (public + admin in one app)
- ✅ Trek browsing with filters, search, pagination
- ✅ Multi-participant booking with OTP flow
- ✅ Admin dashboard with stats
- ✅ Trek/Enrollment/Category/Gallery/Review management
- ✅ User registration, login, profile, enrollment history
- ✅ WhatsApp integration, SEO utils, performance monitoring
- ✅ PDF & Excel export utilities

---

## What Needs Fixing (Critical Issues)

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `.env` committed to git with real secrets (DB password, JWT secret, SMTP creds) | 🔴 CRITICAL | Remove from git history, add `.env.example`, rotate all secrets |
| 2 | OTP stored in-memory (JavaScript Map) — lost on restart | 🔴 CRITICAL | Move to MongoDB collection with TTL index (auto-expire) |
| 3 | No password reset flow | 🟡 HIGH | Add forgot-password → email token → reset endpoint |
| 4 | No input sanitization (XSS/NoSQL injection risk) | 🟡 HIGH | Add `express-mongo-sanitize` + `xss-clean` middleware |
| 5 | Token in sessionStorage (XSS vulnerable) | 🟡 HIGH | Move to HTTP-only cookies |
| 6 | No CSP headers | 🟡 MEDIUM | Add Content-Security-Policy via Helmet config |
| 7 | Gallery images — no CDN/optimization | 🟡 MEDIUM | Serve via MinIO + Nginx with caching headers |
| 8 | No API documentation | 🟡 MEDIUM | Add Swagger/OpenAPI docs |
| 9 | Zero test coverage (config exists, no tests) | 🟡 MEDIUM | Add critical path tests |
| 10 | Docker setup minimal (no health checks, no volumes) | 🟡 MEDIUM | Proper Docker Compose with all services |

---

## The Separation Plan

### Current: 1 app handles everything
```
avirtrekkersFrontend/  ← Public site + Admin portal (mixed)
avirtrekkersBackend/   ← Single API server
```

### Target: 3 independent apps in monorepo
```
D:\Workspace\Avir Trekkers\
├── apps/
│   ├── api/                    ← Express backend (improved, shared)
│   ├── user-site/              ← React app (public-facing, revamped UI)
│   └── admin-portal/           ← React app (admin dashboard, revamped UI)
├── packages/
│   └── shared/                 ← Shared types, utils, API client
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.user
│   ├── Dockerfile.admin
│   └── nginx/nginx.conf
├── docker-compose.yml
├── docs/
└── package.json                ← Workspace root (npm workspaces)
```

### Why Separate?
1. **Independent deployments** — update admin without touching user site
2. **Different audiences** — user site needs SEO/speed, admin needs data tables/forms
3. **Security** — admin portal on subdomain (`admin.avirtrekkers.com`), separate CORS
4. **Performance** — user site bundle is small (no ag-Grid, no admin components)
5. **Team scaling** — different devs can work on each app

### How Nginx Routes Traffic
```
avirtrekkers.com         → user-site (port 3000)
admin.avirtrekkers.com   → admin-portal (port 3001)
avirtrekkers.com/api     → api server (port 4001)
```

---

## UI Revamp Strategy

### User Site — Modern, Clean, Mobile-First
| Current | Revamp To |
|---------|-----------|
| Basic React components | **Tailwind CSS + Shadcn/ui** |
| No design system | Forest Green (#2D6A4F) + Orange (#E76F51) theme |
| Inconsistent spacing/fonts | **Inter + Lato** fonts, consistent spacing |
| Basic cards | Hover effects, subtle shadows, rounded corners |
| No animations | **Framer Motion** — hero fade, counter animate, scroll reveal |
| Basic image display | **Lightbox with lazy loading** |
| Simple forms | **Multi-step booking with progress indicator** |
| No loading states | **Skeleton loaders everywhere** |
| Basic mobile | **Mobile-first responsive with hamburger nav** |

### Admin Portal — Professional Dashboard
| Current | Revamp To |
|---------|-----------|
| Mixed with user site | **Standalone app with sidebar layout** |
| Basic tables | **ag-Grid** (already using) + better styling |
| Basic forms | **React Hook Form + Zod** (replace Formik/Yup) |
| SweetAlert2 | **Shadcn Toast + Dialog** |
| No charts | **Recharts** for dashboard stats |
| Basic layout | **Collapsible sidebar + breadcrumbs + header** |

---

## Implementation Tasks (Ordered)

---

### Task 1: Security Fixes & Secret Rotation (DO FIRST)

**Files:**
- Modify: `avirtrekkersBackend/.env` → create `.env.example`
- Modify: `avirtrekkersBackend/.gitignore`
- Modify: `avirtrekkersBackend/app.js`
- Create: `avirtrekkersBackend/Models/OTPModel.js`

**Step 1: Remove .env from git tracking**
```bash
cd "D:\Workspace\Avir Trekkers\avirtrekkersBackend"
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
```

**Step 2: Create `.env.example`** (no real values)
```env
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/avir_trekkers
JWT_SECRET=generate-a-random-secret-use-openssl-rand-base64-32
PORT=4001
NODE_ENV=dev
SMTP_HOST=
SMTP_PORT=465
SMTP_USER=
SMTP_PASS=
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_BUCKET=avir-trekkers
```

**Step 3: Create OTP MongoDB model** (replace in-memory Map)
```javascript
// Models/OTPModel.js
const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ["enrollment", "password-reset"], default: "enrollment" },
  createdAt: { type: Date, default: Date.now, expires: 600 } // TTL: 10 min auto-delete
});
module.exports = mongoose.model("OTP", otpSchema);
```

**Step 4: Update enrollment controller** — replace `otpStore` Map with OTP model queries.

**Step 5: Add security middleware to `app.js`**
```bash
npm install express-mongo-sanitize xss-clean hpp
```
```javascript
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss());           // Prevent XSS
app.use(hpp());           // Prevent HTTP param pollution
```

**Step 6: Commit**
```bash
git add -A && git commit -m "security: fix critical issues - OTP persistence, input sanitization, env cleanup"
```

---

### Task 2: Backend Improvements (API Hardening)

**Files:**
- Create: `avirtrekkersBackend/routes/passwordResetRoutes.js`
- Create: `avirtrekkersBackend/controllers/passwordResetController.js`
- Create: `avirtrekkersBackend/middleware/errorHandler.js`
- Create: `avirtrekkersBackend/middleware/requestLogger.js`
- Modify: `avirtrekkersBackend/app.js`
- Modify: `avirtrekkersBackend/middleware/authMiddleware.js`

**Step 1: Add global error handler middleware**
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Something went wrong" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};
module.exports = errorHandler;
```

**Step 2: Add request logger**
```javascript
// middleware/requestLogger.js
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} → ${res.statusCode} (${duration}ms)`);
  });
  next();
};
module.exports = requestLogger;
```

**Step 3: Add password reset flow**
- `POST /api/auth/forgot-password` — send reset token via email
- `POST /api/auth/reset-password` — validate token + update password
- Uses same OTP model with `purpose: "password-reset"`

**Step 4: Move JWT token to HTTP-only cookies**
- Update `authController.js` login response — set cookie instead of sending token in body
- Update `authMiddleware.js` — read token from cookie first, fallback to Authorization header
- Update CORS config — add `credentials: true`

**Step 5: Add API health check improvements**
```javascript
app.get("/health", async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ status: "ok", db: dbStatus, uptime: process.uptime(), timestamp: new Date() });
});
```

**Step 6: Mount error handler + logger in `app.js`**

**Step 7: Commit**
```bash
git add -A && git commit -m "feat: add password reset, error handling, request logging, cookie-based auth"
```

---

### Task 3: Setup Monorepo Structure

**Step 1: Create workspace structure**
```bash
cd "D:\Workspace\Avir Trekkers"
mkdir -p apps packages/shared docker
```

**Step 2: Move existing apps**
```bash
mv avirtrekkersBackend apps/api
mv avirtrekkersFrontend apps/user-site-legacy  # keep as reference
```

**Step 3: Create root `package.json`** with npm workspaces
```json
{
  "name": "avir-trekkers",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev:api": "cd apps/api && npm run dev",
    "dev:user": "cd apps/user-site && npm start",
    "dev:admin": "cd apps/admin-portal && npm start",
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:user\" \"npm run dev:admin\"",
    "build:user": "cd apps/user-site && npm run build",
    "build:admin": "cd apps/admin-portal && npm run build"
  }
}
```

**Step 4: Create `packages/shared/`** with shared constants, API types, and utility functions extracted from both apps.

**Step 5: Commit**
```bash
git add -A && git commit -m "chore: restructure to monorepo with npm workspaces"
```

---

### Task 4: Scaffold User Site (New React App with Vite + Tailwind)

**Step 1: Create new React app with Vite** (replaces Create React App)
```bash
cd apps
npm create vite@latest user-site -- --template react
cd user-site
npm install tailwindcss @tailwindcss/vite react-router-dom axios framer-motion swiper lucide-react clsx tailwind-merge
npx shadcn@latest init
```

**Step 2: Setup Tailwind with Avir Trekkers design tokens**
- Colors: primary (#2D6A4F), secondary (#E76F51), accent (#F4A261)
- Fonts: Inter (headings), Lato (body)

**Step 3: Port components from legacy app** (one by one):
```
PRIORITY ORDER (port these first):
1. Navbar + Footer + WhatsAppButton (layout)
2. Home page (Hero, FeaturedTreks, Stats, Reviews)
3. AllTreks page (listing + filters)
4. TrekDetails page (detail + itinerary)
5. Enrollment/Booking form (multi-participant — THIS IS THE KEY FEATURE)
6. Gallery page (with lightbox)
7. About, OurWork, Impact, Contact, Donate pages
8. ReviewSubmission page
9. User Login/Register/Dashboard/Profile
```

**Step 4: For each component ported:**
- Copy business logic from legacy
- Rewrite JSX with Tailwind CSS (replace inline styles / CSS modules)
- Replace Formik → React Hook Form + Zod
- Replace SweetAlert2 → Shadcn Toast
- Replace React Modal → Shadcn Dialog
- Add Framer Motion animations
- Add skeleton loading states
- Test on mobile (375px)

**Step 5: Update API calls** — point to `/api` prefix, same backend

**Step 6: Commit after each page group**

---

### Task 5: Scaffold Admin Portal (New React App with Vite + Tailwind)

**Step 1: Create admin app**
```bash
cd apps
npm create vite@latest admin-portal -- --template react
cd admin-portal
npm install tailwindcss @tailwindcss/vite react-router-dom axios react-hook-form @hookform/resolvers zod ag-grid-community ag-grid-react recharts lucide-react
npx shadcn@latest init
```

**Step 2: Create admin layout** — sidebar + header + main content area. Blue (#3B82F6) accent theme.

**Step 3: Port admin components from legacy app:**
```
PRIORITY ORDER:
1. Login page + AuthContext + ProtectedRoute
2. Dashboard (stats cards + recent activity + charts with Recharts)
3. Trek Management (table + create/edit form + itinerary builder)
4. Enrollment Management (table + detail modal + PDF/Excel export)
5. Category Management (CRUD + sort order)
6. Gallery Management (trek photos + social activities)
7. Review Management (approval queue + featured toggle)
8. Settings / Admin user management
```

**Step 4: For each component ported:**
- Keep ag-Grid for data tables (already great)
- Replace Formik → React Hook Form + Zod
- Add Shadcn UI components (buttons, dialogs, toasts)
- Add Recharts for dashboard charts
- Better loading/error states
- Responsive sidebar (collapsible on mobile)

**Step 5: Commit after each module**

---

### Task 6: MinIO Image Storage Setup

**Files:**
- Create: `apps/api/utils/storageService.js`
- Create: `apps/api/routes/uploadRoutes.js`
- Modify: gallery/trek controllers to use MinIO URLs

**Step 1: Install MinIO client**
```bash
cd apps/api
npm install minio
```

**Step 2: Create storage service**
```javascript
// utils/storageService.js
const Minio = require("minio");
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

async function uploadFile(bucket, fileName, fileBuffer, contentType) {
  await minioClient.putObject(bucket, fileName, fileBuffer, { "Content-Type": contentType });
  return `/${bucket}/${fileName}`;
}

async function deleteFile(bucket, fileName) {
  await minioClient.removeObject(bucket, fileName);
}

module.exports = { minioClient, uploadFile, deleteFile };
```

**Step 3: Create upload route** — accepts multipart form data, resizes with Sharp, stores in MinIO.

**Step 4: Update gallery & trek controllers** to use MinIO URLs instead of whatever they use now.

**Step 5: Configure Nginx to proxy `/storage/*` → MinIO for public image serving with cache headers.

**Step 6: Commit**

---

### Task 7: Docker Compose — Full Stack

**Files:**
- Create: `docker/Dockerfile.api`
- Create: `docker/Dockerfile.user`
- Create: `docker/Dockerfile.admin`
- Create: `docker/nginx/nginx.conf`
- Create: `docker-compose.yml`
- Create: `docker-compose.prod.yml`
- Create: `docker/backup.sh`

**Step 1: Create Dockerfile for API** (Node 20 Alpine, PM2)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY apps/api/package*.json ./
RUN npm ci --production
COPY apps/api/ .
EXPOSE 4001
CMD ["node", "app.js"]
```

**Step 2: Create Dockerfile for user-site** (multi-stage: build → Nginx serve)
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY apps/user-site/package*.json ./
RUN npm ci
COPY apps/user-site/ .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf
```

**Step 3: Create Dockerfile for admin-portal** (same pattern)

**Step 4: Create `docker-compose.yml`**
```yaml
services:
  api:
    build: { context: ., dockerfile: docker/Dockerfile.api }
    ports: ["4001:4001"]
    env_file: .env.production
    depends_on: [minio]
    restart: unless-stopped

  user-site:
    build: { context: ., dockerfile: docker/Dockerfile.user }
    restart: unless-stopped

  admin-portal:
    build: { context: ., dockerfile: docker/Dockerfile.admin }
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    volumes: [minio-data:/data]
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    ports: ["9000:9000", "9001:9001"]
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - certs:/etc/letsencrypt
    depends_on: [api, user-site, admin-portal]
    restart: unless-stopped

  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    environment:
      DATABASE_URL: postgresql://umami:umami_pass@umami-db:5432/umami
    ports: ["3001:3000"]
    depends_on: [umami-db]
    restart: unless-stopped

  umami-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami_pass
    volumes: [umami-data:/var/lib/postgresql/data]
    restart: unless-stopped

  uptime-kuma:
    image: louislam/uptime-kuma
    ports: ["3002:3001"]
    volumes: [kuma-data:/app/data]
    restart: unless-stopped

volumes:
  minio-data:
  certs:
  umami-data:
  kuma-data:
```

**Step 5: Create Nginx config** — routes avirtrekkers.com → user-site, admin.avirtrekkers.com → admin-portal, /api → api server, /storage → MinIO.

**Step 6: Create backup script** for MongoDB (mongodump cron)

**Step 7: Commit**

---

### Task 8: GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/deploy.yml`

**Step 1: Create CI/CD pipeline**
```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build API image
        run: docker build -f docker/Dockerfile.api -t ghcr.io/${{ github.repository }}/api:latest .

      - name: Build User Site image
        run: docker build -f docker/Dockerfile.user -t ghcr.io/${{ github.repository }}/user:latest .

      - name: Build Admin Portal image
        run: docker build -f docker/Dockerfile.admin -t ghcr.io/${{ github.repository }}/admin:latest .

      - name: Push to GHCR
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/${{ github.repository }}/api:latest
          docker push ghcr.io/${{ github.repository }}/user:latest
          docker push ghcr.io/${{ github.repository }}/admin:latest

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/avir-trekkers
            docker compose pull
            docker compose up -d --remove-orphans
```

**Step 2: Commit**

---

### Task 9: Testing — Critical Paths Only

**Files:**
- Create: `apps/api/__tests__/auth.test.js`
- Create: `apps/api/__tests__/enrollment.test.js`
- Create: `apps/api/__tests__/treks.test.js`

**Step 1: Add critical API tests** (not 100% coverage — just the flows that must never break):
1. Auth: register → login → get token → access protected route
2. Treks: create trek → list treks → get by ID → update → delete
3. Enrollment: send OTP → verify → enroll with 3 participants → verify slots decremented
4. Reviews: submit → list pending → approve → list public

**Step 2: Add test script to package.json**
```json
"test": "jest --forceExit --detectOpenHandles"
```

**Step 3: Commit**

---

### Task 10: Final Polish & Production Checklist

**Step 1: SEO for user site** — meta tags, Open Graph, sitemap, robots.txt

**Step 2: Performance** — lazy loading images, code splitting routes, gzip via Nginx

**Step 3: Error boundaries** — React error boundaries on both apps

**Step 4: Loading states** — skeleton loaders on all data-fetching pages

**Step 5: Mobile audit** — every page tested at 375px, 768px, 1024px

**Step 6: Security audit**
```
[ ] All secrets in env vars (not committed)
[ ] JWT in HTTP-only cookies
[ ] CORS locked to production domains
[ ] Rate limiting on auth + enrollment endpoints
[ ] Input sanitization active
[ ] CSP headers set
[ ] SSL configured
```

**Step 7: Production deploy**
```
[ ] Domain DNS → VPS IP
[ ] admin.avirtrekkers.com DNS → same VPS
[ ] docker compose up -d
[ ] SSL via certbot
[ ] MinIO bucket created
[ ] MongoDB Atlas IP whitelist updated
[ ] Smoke test: homepage, trek detail, booking, admin login
[ ] Backup cron configured
[ ] Uptime Kuma monitors set
```

---

## Summary: What We Keep vs What We Change

| Area | Keep (Already Built) | Change/Improve |
|------|---------------------|----------------|
| **Backend** | All 30+ API endpoints, Mongoose models, JWT auth, OTP flow, enrollment logic | Add security middleware, password reset, error handling, cookie auth, MinIO storage |
| **Database** | MongoDB Atlas, all schemas, indexes | Add OTP model (replace in-memory), add TTL indexes |
| **Frontend Logic** | Trek browsing, booking flow, admin CRUD, export utils, filters | Port to Vite, separate into 2 apps |
| **Frontend UI** | — | Complete revamp with Tailwind + Shadcn/ui + Framer Motion |
| **Deployment** | Basic Dockerfile | Full Docker Compose (6 containers) + GitHub Actions CI/CD |
| **Monitoring** | Basic performance hooks | Umami analytics + Uptime Kuma + request logging |

**Estimated Timeline:** 6-8 weeks (vs 12 weeks for full rebuild)
**Effort Saved:** ~50% by keeping the entire backend + business logic

---

*Reference: `docs/PRD.md` for full requirements. Legacy code in `apps/user-site-legacy/` for porting reference.*
