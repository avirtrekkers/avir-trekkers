# Technical Architecture Document

## Avir Trekkers Web Platform

---

| Field               | Details                          |
|---------------------|----------------------------------|
| **Document Version**| 1.0                              |
| **Date**            | 2026-04-12                       |

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Public Site  │  │ Admin Portal │  │   Mobile     │          │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Responsive)│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼─────────────────┼─────────────────┼──────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CDN (Vercel Edge / Cloudflare)              │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Next.js Application (App Router)            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │   │
│  │  │  SSR     │ │  API     │ │  Auth    │ │  File     │  │   │
│  │  │  Pages   │ │  Routes  │ │  (JWT)   │ │  Upload   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   PostgreSQL    │ │  Cloudinary     │ │  Email Service  │
│   (NeonDB /    │ │  (Image CDN)    │ │  (SendGrid /   │
│    Supabase)   │ │                 │ │   AWS SES)     │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 2. Recommended Tech Stack

### 2.1 Frontend
| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js 14+ (App Router)** | Full-stack React framework | SSR for SEO, API routes, file-based routing, image optimization |
| **TypeScript** | Type safety | Reduces bugs, better DX, self-documenting code |
| **Tailwind CSS** | Styling | Rapid development, responsive-first, small bundle size |
| **Shadcn/ui** | UI Components | High-quality, accessible, customizable components |
| **React Hook Form** | Form handling | Performance-optimized forms with validation |
| **Zod** | Schema validation | Type-safe validation shared between client and server |
| **Framer Motion** | Animations | Hero slider, counter animations, page transitions |
| **Swiper.js** | Carousels/Sliders | Hero banners, review carousel, trek image gallery |
| **Lucide React** | Icons | Consistent, lightweight icon library |

### 2.2 Backend
| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Next.js API Routes** | REST API | Co-located with frontend, serverless-ready |
| **Prisma ORM** | Database access | Type-safe queries, migrations, auto-generated client |
| **NextAuth.js / Auth.js** | Authentication | Secure admin auth with JWT sessions |
| **Nodemailer + SendGrid** | Email | Transactional emails for bookings & notifications |
| **Zod** | Server validation | Shared validation schemas with frontend |

### 2.3 Database
| Technology | Purpose | Justification |
|------------|---------|---------------|
| **PostgreSQL** | Primary database | Relational data, ACID compliance, proven reliability |
| **NeonDB** (recommended) | Hosting | Serverless Postgres, auto-scaling, generous free tier |
| **Prisma Migrate** | Schema migrations | Version-controlled database changes |

### 2.4 Storage & Media
| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Cloudinary** | Image storage & CDN | Auto-optimization, WebP delivery, transformations, generous free tier |
| **UploadThing** (alternative) | File uploads | Next.js native, simple API |

### 2.5 Deployment & Infrastructure
| Technology | Purpose | Justification |
|------------|---------|---------------|
| **Vercel** | Hosting & deployment | Native Next.js support, edge network, CI/CD, preview deployments |
| **GitHub** | Source control | Version control, collaboration, CI/CD triggers |
| **GitHub Actions** | CI/CD | Automated testing, linting, deployment |

### 2.6 Monitoring & Analytics
| Technology | Purpose |
|------------|---------|
| **Google Analytics 4** | User behavior tracking |
| **Vercel Analytics** | Performance monitoring |
| **Sentry** | Error tracking & monitoring |

---

## 3. Project Structure

```
avir-trekkers/
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI/CD pipeline
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                  # Migration files
│   └── seed.ts                      # Seed data
├── public/
│   ├── images/                      # Static images
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── (public)/                # Public routes group
│   │   │   ├── page.tsx             # Home page
│   │   │   ├── treks/
│   │   │   │   ├── page.tsx         # Trek listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Trek detail
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx         # Gallery page
│   │   │   ├── about/
│   │   │   │   └── page.tsx         # About page
│   │   │   ├── social-impact/
│   │   │   │   └── page.tsx         # Social impact page
│   │   │   ├── contact/
│   │   │   │   └── page.tsx         # Contact page
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx         # Reviews page
│   │   │   └── book/
│   │   │       └── [trekSlug]/
│   │   │           └── page.tsx     # Booking page
│   │   ├── admin/                   # Admin routes (protected)
│   │   │   ├── layout.tsx           # Admin layout with sidebar
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── treks/
│   │   │   │   ├── page.tsx         # Trek management
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx     # Create trek
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit trek
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx         # Bookings list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Booking detail
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx         # Gallery management
│   │   │   ├── reviews/
│   │   │   │   └── page.tsx         # Review management
│   │   │   ├── inquiries/
│   │   │   │   └── page.tsx         # Inquiry management
│   │   │   ├── content/
│   │   │   │   └── page.tsx         # Content management
│   │   │   └── settings/
│   │   │       └── page.tsx         # Admin settings
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts     # Auth API
│   │   │   ├── treks/
│   │   │   │   ├── route.ts         # GET/POST treks
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET/PUT/DELETE trek
│   │   │   ├── bookings/
│   │   │   │   ├── route.ts         # GET/POST bookings
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts     # GET/PUT booking
│   │   │   ├── gallery/
│   │   │   │   └── route.ts         # Gallery CRUD
│   │   │   ├── reviews/
│   │   │   │   └── route.ts         # Reviews CRUD
│   │   │   ├── inquiries/
│   │   │   │   └── route.ts         # Inquiries CRUD
│   │   │   ├── content/
│   │   │   │   └── route.ts         # Content CRUD
│   │   │   ├── upload/
│   │   │   │   └── route.ts         # Image upload
│   │   │   └── export/
│   │   │       └── route.ts         # Data export (xlsx)
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ui/                      # Shadcn/ui components
│   │   ├── public/                  # Public site components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── TrekCard.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── ParticipantForm.tsx
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── ReviewCarousel.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── WhatsAppButton.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   └── admin/                   # Admin components
│   │       ├── AdminSidebar.tsx
│   │       ├── DashboardStats.tsx
│   │       ├── TrekForm.tsx
│   │       ├── BookingTable.tsx
│   │       ├── GalleryUploader.tsx
│   │       ├── ReviewQueue.tsx
│   │       └── RichTextEditor.tsx
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client
│   │   ├── auth.ts                  # Auth configuration
│   │   ├── cloudinary.ts            # Cloudinary config
│   │   ├── email.ts                 # Email service
│   │   ├── validations.ts           # Zod schemas
│   │   └── utils.ts                 # Utility functions
│   ├── hooks/
│   │   ├── useBookingForm.ts
│   │   └── useGallery.ts
│   └── types/
│       └── index.ts                 # TypeScript types
├── .env.example                     # Environment variables template
├── .env.local                       # Local env (gitignored)
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. API Design

### 4.1 Public API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/treks` | List published treks (with pagination, filters) |
| GET | `/api/treks/[slug]` | Get trek details by slug |
| POST | `/api/bookings` | Create a new booking with participants |
| GET | `/api/gallery?category=X` | Get gallery images by category |
| GET | `/api/gallery/categories` | List gallery categories |
| POST | `/api/reviews` | Submit a new review |
| GET | `/api/reviews?featured=true` | Get approved/featured reviews |
| POST | `/api/inquiries` | Submit contact form inquiry |
| GET | `/api/content/hero` | Get hero section content |
| GET | `/api/content/stats` | Get homepage stats |
| GET | `/api/content/about` | Get about page content |
| GET | `/api/content/social-impact` | Get social impact content |

### 4.2 Admin API Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/dashboard` | Dashboard statistics |
| CRUD | `/api/admin/treks` | Full trek management |
| GET | `/api/admin/bookings` | List all bookings (filtered) |
| GET | `/api/admin/bookings/[id]` | Booking detail |
| PUT | `/api/admin/bookings/[id]` | Update booking status |
| GET | `/api/admin/export/bookings` | Export bookings as XLSX |
| CRUD | `/api/admin/gallery` | Gallery management |
| CRUD | `/api/admin/gallery/categories` | Category management |
| POST | `/api/admin/upload` | Image upload to Cloudinary |
| GET | `/api/admin/reviews` | List all reviews (pending/approved) |
| PUT | `/api/admin/reviews/[id]` | Approve/reject/feature review |
| GET | `/api/admin/inquiries` | List inquiries |
| PUT | `/api/admin/inquiries/[id]` | Mark read, reply |
| CRUD | `/api/admin/content/*` | Content management |
| CRUD | `/api/admin/users` | Admin user management |

---

## 5. Security Architecture

### 5.1 Authentication Flow
```
Admin Login → Credentials Validation → JWT Token Generation
    → Token stored in HTTP-only cookie → Middleware validates on protected routes
```

### 5.2 Security Measures
- **Password Hashing**: bcrypt with salt rounds >= 12
- **JWT Tokens**: Short-lived access tokens (15 min) + refresh tokens (7 days)
- **HTTP-Only Cookies**: Prevent XSS token theft
- **CSRF Protection**: Built-in Next.js CSRF tokens
- **Rate Limiting**: On auth endpoints (5 attempts/min), forms (10/min)
- **Input Sanitization**: Zod validation on all inputs
- **SQL Injection Prevention**: Prisma parameterized queries
- **XSS Prevention**: React auto-escaping + DOMPurify for rich text
- **CORS**: Restricted to known origins
- **Content Security Policy**: Strict CSP headers
- **HTTPS**: Enforced via Vercel

---

## 6. Performance Strategy

| Strategy | Implementation |
|----------|---------------|
| **SSR/SSG** | Static generation for info pages, SSR for dynamic trek listings |
| **Image Optimization** | Cloudinary auto-format (WebP/AVIF), responsive sizes, lazy loading |
| **Code Splitting** | Next.js automatic code splitting per route |
| **Caching** | ISR (Incremental Static Regeneration) for semi-static pages |
| **CDN** | Vercel Edge Network for global distribution |
| **Database** | Connection pooling, indexed queries, pagination |
| **Bundle Size** | Tree shaking, dynamic imports for heavy components |

---

## 7. Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/avir_trekkers"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://avirtrekkers.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-key"
EMAIL_FROM="noreply@avirtrekkers.com"
ADMIN_EMAIL="admin@avirtrekkers.com"

# WhatsApp
WHATSAPP_NUMBER="+91XXXXXXXXXX"

# Google
GOOGLE_RECAPTCHA_SITE_KEY="your-key"
GOOGLE_RECAPTCHA_SECRET_KEY="your-secret"
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# App
NEXT_PUBLIC_APP_URL="https://avirtrekkers.com"
```

---

*End of Technical Architecture Document*
