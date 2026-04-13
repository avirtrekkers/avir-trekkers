# Avir Trekkers — Product Requirements Document

> Single source of truth. Everything a developer needs to build this project.

**Client:** Avir Trekkers, Maharashtra, India
**What they do:** Organize treks (forts, nature, night treks) + social work (school support, cycle donations)
**What we build:** Dynamic website with trek booking + admin portal

---

## Pages & Features

### Public Site

| Page | Route | Core Features |
|------|-------|---------------|
| Home | `/` | Hero slider (admin-editable), 4 upcoming trek cards, animated stats counters, social impact highlight, reviews carousel, WhatsApp float button |
| Treks | `/treks` | Grid of published treks, filter by difficulty/type/date, search, pagination |
| Trek Detail | `/treks/[slug]` | Image carousel, full info (itinerary, inclusions/exclusions, meeting point), sticky booking card with price + slots, share buttons |
| Booking | `/book/[slug]` | **Multi-step form:** Step 1: registrant info → Step 2: add/remove multiple participants → Step 3: summary + total cost → Step 4: confirmation + ref number. Email sent on confirm. |
| Gallery | `/gallery` | Category tabs (Trek Photos, Social Activities, Events), masonry grid, lightbox viewer, lazy loading |
| Social Impact | `/social-impact` | Initiative cards with images + metrics, animated impact counters, timeline |
| About | `/about` | Rich text content, team member cards |
| Reviews | `/reviews` | All approved reviews + submit review form (name, stars, text, trek dropdown) |
| Contact | `/contact` | Form (name, email, phone, subject, message) + WhatsApp click-to-chat + phone + email. reCAPTCHA. |

### Admin Portal (`/admin/*` — protected)

| Page | Route | Core Features |
|------|-------|---------------|
| Dashboard | `/admin` | Stats cards (bookings/month, upcoming treks, pending reviews, unread inquiries), recent activity, quick actions |
| Treks | `/admin/treks` | Data table (sort, search, paginate). Create/Edit form with rich text, image upload, itinerary builder. Duplicate trek. Status: Draft→Published→FullyBooked→Completed→Cancelled |
| Bookings | `/admin/bookings` | Filterable table by trek/date. Detail view with all participants. **Export as .xlsx** |
| Gallery | `/admin/gallery` | Drag-drop bulk upload, manage categories, assign/delete images |
| Content | `/admin/content` | Edit hero slides, about page, social impact initiatives, homepage stats, FAQ |
| Reviews | `/admin/reviews` | Pending queue, approve/reject, feature toggle for homepage |
| Inquiries | `/admin/inquiries` | List with read/unread, view detail, reply via email |
| Settings | `/admin/settings` | Admin user management (add/edit/deactivate), role-based (Super Admin, Admin, Moderator) |

---

## Critical Business Rules

1. **Multi-participant booking:** One user enrolls N participants. Each needs: name, age, phone, emergency contact. Slots decrement by N.
2. **Trek capacity:** Bookings stop at max. Show "Fully Booked" badge, "Few Slots Left" when <5.
3. **Review moderation:** All reviews need admin approval before appearing on site.
4. **Reference numbers:** Format `AVT-{YEAR}-{00001}` — sequential per year.
5. **Trek statuses:** Draft → Published → Fully Booked (auto) → Completed / Cancelled.
6. **Contact channels:** WhatsApp (click-to-chat), email (mailto), phone (tel), in-site form.

---

## Tech Stack (All Free / Open-Source — Self-Hosted on VPS via Docker)

| Layer | Choice | Cost | Why |
|-------|--------|------|-----|
| Framework | **Next.js 14+ (App Router)** | FREE | SSR for SEO, API routes, image optimization |
| Language | **TypeScript** | FREE | Type safety across stack |
| Styling | **Tailwind CSS + Shadcn/ui** | FREE | Rapid dev, accessible components |
| Forms | **React Hook Form + Zod** | FREE | Performance + shared validation |
| Database | **PostgreSQL 16 (Docker)** | FREE | Self-hosted on VPS, full control |
| ORM | **Prisma** | FREE | Type-safe queries, migrations |
| Auth | **NextAuth.js (Credentials)** | FREE | JWT sessions, admin-only |
| Images | **MinIO (Docker)** | FREE | Self-hosted S3-compatible storage, serves images via Nginx |
| Image Processing | **Sharp (built-in Next.js)** | FREE | Auto WebP/AVIF, resize, optimize on-the-fly |
| Email | **Resend** (free 3K emails/mo) | FREE | Modern email API, generous free tier |
| Animations | **Framer Motion** | FREE | Hero, counters, transitions |
| Carousel | **Swiper.js** | FREE | Hero slider, review carousel |
| Reverse Proxy | **Nginx (Docker)** | FREE | SSL termination, static file serving, gzip |
| SSL | **Let's Encrypt (Certbot)** | FREE | Auto-renewing SSL certificates |
| Deploy | **Docker + Docker Compose on VPS** | FREE | Full control, single command deploy |
| CI/CD | **GitHub Actions** | FREE | Auto build → push Docker image → deploy to VPS |
| Analytics | **Umami (Docker)** | FREE | Privacy-friendly, self-hosted, open-source |
| Error Tracking | **GlitchTip (Docker)** or Sentry free tier | FREE | Self-hosted error monitoring |
| CAPTCHA | **Cloudflare Turnstile** | FREE | Privacy-friendly, no user friction |
| Monitoring | **Uptime Kuma (Docker)** | FREE | Self-hosted uptime monitoring + alerts |
| DB Admin | **pgAdmin (Docker)** | FREE | Visual database management |
| Backups | **pg_dump cron job** | FREE | Automated daily DB backups |

---

## Database Schema (Prisma)

```prisma
// 16 models — see docs/archive/07-Database-Schema-Design.md for full detail

model AdminUser { id, email (unique), password (bcrypt), name, role (SUPER_ADMIN|ADMIN|MODERATOR), isActive, lastLoginAt, timestamps }

model Trek { id, name, slug (unique), description (text), coverImage, date, meetingPoint, meetingTime, difficulty (EASY|MODERATE|HARD), trekType (FORT|NATURE|NIGHT|MONSOON|WATERFALL|CAMPING), distance, duration, pricePerPerson (int), maxParticipants (int), inclusions (string[]), exclusions (string[]), itinerary (json), importantNotes, status (DRAFT|PUBLISHED|FULLY_BOOKED|COMPLETED|CANCELLED), timestamps → has many TrekImage, Booking }

model TrekImage { id, url, caption, sortOrder, trekId → belongs to Trek (cascade) }

model Booking { id, referenceNumber (unique, AVT-YYYY-NNNNN), trekId, status (CONFIRMED|CANCELLED|ATTENDED), registrantName, registrantEmail, registrantPhone, registrantAge, registrantGender, registrantCity, totalParticipants, totalAmount, timestamps → belongs to Trek, has many Participant }

model Participant { id, bookingId, name, age, phone, emergencyContactName, emergencyContactPhone, isPrimary (bool), timestamp → belongs to Booking (cascade) }

model GalleryCategory { id, name (unique), slug (unique), sortOrder → has many GalleryImage }
model GalleryImage { id, url, thumbnailUrl, caption, altText, categoryId, sortOrder → belongs to GalleryCategory }

model Review { id, name, rating (1-5), text, trekName, photoUrl, status (PENDING|APPROVED|REJECTED), isFeatured (bool), timestamps }
model Inquiry { id, name, email, phone, subject, message, isRead (bool), repliedAt, timestamp }

model HeroSlide { id, imageUrl, headline, subtitle, ctaText, ctaLink, isActive (bool), sortOrder, timestamps }
model SocialInitiative { id, title, description, images (string[]), metrics (json), sortOrder, timestamps }
model SiteSettings { id, key (unique), value (json) }
model TeamMember { id, name, role, bio, photoUrl, sortOrder }
model FAQ { id, question, answer, sortOrder, isActive (bool) }
model ActivityLog { id, adminUserId, action, entity, entityId, details (json), timestamp → belongs to AdminUser }
```

**Key indexes:** treks(status,date), treks(slug), bookings(trekId), bookings(referenceNumber), participants(bookingId), reviews(status), inquiries(isRead)

**Available slots query:** `trek.maxParticipants - SUM(non-cancelled bookings.totalParticipants)`

---

## API Endpoints

### Public
```
GET    /api/treks                    # list published (pagination, filters)
GET    /api/treks/[slug]             # detail
POST   /api/bookings                 # create booking + participants
GET    /api/gallery?category=X       # images by category
GET    /api/gallery/categories       # list categories
GET    /api/reviews?featured=true    # approved reviews
POST   /api/reviews                  # submit review
POST   /api/inquiries                # contact form
GET    /api/content/hero             # hero slides
GET    /api/content/stats            # homepage numbers
GET    /api/content/about            # about content
GET    /api/content/social-impact    # initiatives
```

### Admin (protected by middleware)
```
POST   /api/auth/[...nextauth]       # login/session
GET    /api/admin/dashboard          # stats
CRUD   /api/admin/treks              # trek management
GET    /api/admin/bookings           # list (filterable)
GET    /api/admin/bookings/[id]      # detail + participants
GET    /api/admin/export/bookings    # xlsx download
POST   /api/admin/upload             # MinIO upload (S3-compatible)
CRUD   /api/admin/gallery            # image management
CRUD   /api/admin/gallery/categories # category management
CRUD   /api/admin/reviews            # moderation
CRUD   /api/admin/inquiries          # inquiry management
CRUD   /api/admin/content/*          # hero, about, social, stats, faq
CRUD   /api/admin/users              # admin user management
```

---

## Project Structure

```
avir-trekkers/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/images/
├── src/
│   ├── app/
│   │   ├── (public)/           # route group
│   │   │   ├── page.tsx        # home
│   │   │   ├── treks/page.tsx + [slug]/page.tsx
│   │   │   ├── book/[slug]/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── social-impact/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── admin/              # protected
│   │   │   ├── layout.tsx      # sidebar shell
│   │   │   ├── page.tsx        # dashboard
│   │   │   ├── treks/          # list + new + [id]/edit
│   │   │   ├── bookings/       # list + [id]
│   │   │   ├── gallery/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   ├── inquiries/page.tsx
│   │   │   ├── content/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/                # all API routes
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn
│   │   ├── public/             # HeroSection, TrekCard, BookingForm, etc.
│   │   └── admin/              # AdminSidebar, TrekForm, BookingTable, etc.
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── storage.ts          # MinIO S3 client
│   │   ├── email.ts
│   │   ├── validations.ts      # zod schemas
│   │   └── utils.ts
│   ├── hooks/
│   └── types/index.ts
├── docker/
│   ├── Dockerfile              # Multi-stage Next.js build
│   ├── nginx/
│   │   └── nginx.conf          # Reverse proxy + SSL + static files
│   └── backup.sh               # DB backup script
├── docker-compose.yml          # Full stack orchestration
├── docker-compose.prod.yml     # Production overrides
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: build → push → deploy to VPS
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Docker Architecture (VPS Deployment)

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR VPS SERVER                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Docker Compose Stack                     │   │
│  │                                                       │   │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐             │   │
│  │  │  Nginx  │  │  Next.js  │  │ Postgres│             │   │
│  │  │  :80    │─▶│  :3000   │  │  :5432  │             │   │
│  │  │  :443   │  │  (app)   │──│  (data) │             │   │
│  │  └─────────┘  └──────────┘  └─────────┘             │   │
│  │       │                                               │   │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐             │   │
│  │  │  MinIO  │  │  Umami   │  │ Uptime  │             │   │
│  │  │  :9000  │  │  :3001   │  │  Kuma   │             │   │
│  │  │ (files) │  │(analytics)│  │  :3002  │             │   │
│  │  └─────────┘  └──────────┘  └─────────┘             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Let's Encrypt (Certbot) → Auto SSL renewal                 │
│  pg_dump cron → Daily DB backups                            │
└─────────────────────────────────────────────────────────────┘
```

### Docker Compose Services

| Service | Image | Port | Purpose | Data Volume |
|---------|-------|------|---------|-------------|
| **app** | Custom (Dockerfile) | 3000 | Next.js application | — |
| **postgres** | `postgres:16-alpine` | 5432 | Database | `pgdata:/var/lib/postgresql/data` |
| **minio** | `minio/minio` | 9000, 9001 | S3-compatible file storage | `minio-data:/data` |
| **nginx** | `nginx:alpine` | 80, 443 | Reverse proxy, SSL, gzip | `certs:/etc/letsencrypt` |
| **umami** | `ghcr.io/umami-software/umami` | 3001 | Analytics dashboard | Uses postgres |
| **uptime-kuma** | `louislam/uptime-kuma` | 3002 | Uptime monitoring | `kuma-data:/app/data` |

### GitHub Actions CI/CD Flow

```
Push to main → GitHub Actions:
  1. Lint + Type-check
  2. Build Docker image
  3. Push to GitHub Container Registry (ghcr.io)
  4. SSH into VPS → docker compose pull → docker compose up -d
```

---

## Environment Variables (.env.example)

```env
# Database (Docker internal network)
DATABASE_URL="postgresql://avir:secure_password@postgres:5432/avir_trekkers"

# Auth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://avirtrekkers.com"

# MinIO (S3-compatible storage)
MINIO_ENDPOINT="minio"
MINIO_PORT=9000
MINIO_ACCESS_KEY="avir-access-key"
MINIO_SECRET_KEY="avir-secret-key-change-this"
MINIO_BUCKET="avir-trekkers"
NEXT_PUBLIC_STORAGE_URL="https://avirtrekkers.com/storage"

# Email (Resend — free 3K emails/month)
RESEND_API_KEY=""
EMAIL_FROM="noreply@avirtrekkers.com"
ADMIN_EMAIL="admin@avirtrekkers.com"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER="+91XXXXXXXXXX"
NEXT_PUBLIC_WHATSAPP_MESSAGE="Hi Avir Trekkers! I'd like to know about upcoming treks."

# Cloudflare Turnstile (free CAPTCHA)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""

# Umami Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=""
NEXT_PUBLIC_UMAMI_URL="https://avirtrekkers.com/analytics"

# App
NEXT_PUBLIC_APP_URL="https://avirtrekkers.com"
NODE_ENV="production"
```

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2D6A4F` (Forest Green) | CTAs, nav, brand |
| Secondary | `#E76F51` (Earthy Orange) | Highlights, badges |
| Accent | `#F4A261` (Golden Yellow) | Warmth, counters |
| Background | `#FAFAF8` (Off-white) | Page bg |
| Text | `#2D3436` (Charcoal) | Body text |
| Admin Primary | `#3B82F6` (Slate Blue) | Admin UI |
| Font Headings | Inter | H1-H6 |
| Font Body | Lato | Paragraphs, forms |

---

*Full detailed docs available in `docs/archive/` for reference.*
