# Quick Reference — Avir Trekkers Dev Cheatsheet

## Development Commands

```bash
npm run dev                        # start dev server (localhost:3000)
npm run build                      # production build
npm run lint                       # run eslint
npx prisma studio                  # visual DB browser (localhost:5555)
npx prisma migrate dev --name X    # create migration
npx prisma db seed                 # run seed script
npx prisma generate                # regenerate client after schema change
```

## Docker Commands

```bash
docker compose up -d               # start full stack (dev)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d  # production
docker compose logs -f app         # tail app logs
docker compose logs -f postgres    # tail DB logs
docker compose down                # stop all services
docker compose exec postgres psql -U avir -d avir_trekkers  # DB shell
docker compose exec app npx prisma migrate deploy           # run migrations in container
docker compose exec app npx prisma db seed                  # seed in container
```

## Docker Services (localhost)

| Service | URL | Purpose |
|---------|-----|---------|
| Next.js App | `http://localhost:3000` | Main application |
| PostgreSQL | `localhost:5432` | Database (user: avir) |
| MinIO Console | `http://localhost:9001` | File storage admin |
| MinIO API | `http://localhost:9000` | S3-compatible API |
| Umami | `http://localhost:3001` | Analytics dashboard |
| Uptime Kuma | `http://localhost:3002` | Uptime monitoring |
| Prisma Studio | `http://localhost:5555` | Visual DB browser |

## Seed Admin Credentials

```
Email: admin@avirtrekkers.com
Password: admin123
```

## Key File Locations

| What | Where |
|------|-------|
| Prisma schema | `prisma/schema.prisma` |
| DB client singleton | `src/lib/prisma.ts` |
| Auth config | `src/lib/auth.ts` |
| Zod validations | `src/lib/validations.ts` |
| Email service | `src/lib/email.ts` |
| MinIO/S3 storage | `src/lib/storage.ts` |
| Shadcn components | `src/components/ui/` |
| Public components | `src/components/public/` |
| Admin components | `src/components/admin/` |
| Public pages | `src/app/(public)/` |
| Admin pages | `src/app/admin/` |
| API routes | `src/app/api/` |
| Middleware (auth) | `src/middleware.ts` |
| Dockerfile | `docker/Dockerfile` |
| Nginx config | `docker/nginx/nginx.conf` |
| Docker Compose | `docker-compose.yml` |
| CI/CD Pipeline | `.github/workflows/deploy.yml` |
| DB backup script | `docker/backup.sh` |

## Tech Stack — All FREE / Open-Source

| Service | What | Cost |
|---------|------|------|
| Next.js 14 | App framework | FREE |
| PostgreSQL 16 (Docker) | Database | FREE |
| MinIO (Docker) | Image/file storage (S3-compatible) | FREE |
| Sharp (Next.js built-in) | Image optimization (WebP/AVIF) | FREE |
| Resend | Email (3K/month free) | FREE |
| Nginx (Docker) | Reverse proxy + SSL | FREE |
| Let's Encrypt | SSL certificates | FREE |
| Cloudflare Turnstile | CAPTCHA (no friction) | FREE |
| Umami (Docker) | Analytics | FREE |
| Uptime Kuma (Docker) | Uptime monitoring | FREE |
| GitHub Actions | CI/CD (2K min/month free) | FREE |

## Available Slots Calculation

```typescript
const availableSlots = trek.maxParticipants - bookings
  .filter(b => b.status !== "CANCELLED")
  .reduce((sum, b) => sum + b.totalParticipants, 0);
```

## Reference Number Format

```
AVT-{YEAR}-{5-digit-sequential}
Example: AVT-2026-00042
```

## Design Tokens (Tailwind)

```
primary:    #2D6A4F  →  text-[#2D6A4F] bg-[#2D6A4F]
secondary:  #E76F51  →  text-[#E76F51] bg-[#E76F51]
accent:     #F4A261  →  text-[#F4A261] bg-[#F4A261]
background: #FAFAF8
text:       #2D3436
admin-blue: #3B82F6
```

## Status Flows

```
Trek:    DRAFT → PUBLISHED → FULLY_BOOKED (auto) → COMPLETED / CANCELLED
Booking: CONFIRMED → ATTENDED / CANCELLED
Review:  PENDING → APPROVED (visible) / REJECTED (archived)
```

## VPS Deployment Checklist

```
[ ] Docker + Docker Compose installed on VPS
[ ] .env.production configured with real values
[ ] Domain DNS A record → VPS IP
[ ] docker compose up -d (first deploy)
[ ] Certbot SSL: certbot --nginx -d avirtrekkers.com
[ ] Prisma migrate deploy
[ ] Seed admin user
[ ] MinIO bucket created (avir-trekkers)
[ ] Umami tracking code added
[ ] Uptime Kuma monitors configured
[ ] Backup cron job: 0 2 * * * /opt/avir/backup.sh
[ ] Smoke test all critical flows
```
