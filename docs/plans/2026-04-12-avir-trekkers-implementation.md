# Avir Trekkers — Full Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dynamic trekking website with multi-participant booking and admin portal for Avir Trekkers, Maharashtra.

**Architecture:** Next.js 14 App Router monolith. Public site with SSR for SEO. Admin portal behind JWT auth. PostgreSQL via Prisma. Cloudinary for images. SendGrid for email.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui, Prisma, PostgreSQL (NeonDB), NextAuth.js, Cloudinary, React Hook Form, Zod, Framer Motion, Swiper.js

**Reference:** `docs/PRD.md` for full requirements, schema, and API design.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `.env.example`, `src/app/layout.tsx`, `src/app/globals.css`

**Step 1: Initialize Next.js project**

```bash
cd "D:\Workspace\Avir Trekkers"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client next-auth @auth/prisma-adapter bcryptjs jsonwebtoken zod react-hook-form @hookform/resolvers framer-motion swiper lucide-react clsx tailwind-merge class-variance-authority nodemailer xlsx
npm install -D @types/bcryptjs @types/jsonwebtoken @types/nodemailer prisma
```

**Step 3: Install and init Shadcn/ui**

```bash
npx shadcn@latest init
```

Select: New York style, Slate base color, CSS variables: yes.

**Step 4: Add essential Shadcn components**

```bash
npx shadcn@latest add button card input label textarea select dialog sheet table badge tabs avatar dropdown-menu separator toast form carousel skeleton switch command popover calendar checkbox
```

**Step 5: Create `.env.example`**

```env
DATABASE_URL="postgresql://user:pass@host:5432/avir_trekkers"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
SENDGRID_API_KEY=""
EMAIL_FROM="noreply@avirtrekkers.com"
ADMIN_EMAIL="admin@avirtrekkers.com"
NEXT_PUBLIC_WHATSAPP_NUMBER="+91XXXXXXXXXX"
NEXT_PUBLIC_WHATSAPP_MESSAGE="Hi Avir Trekkers! I'd like to know about upcoming treks."
GOOGLE_RECAPTCHA_SITE_KEY=""
GOOGLE_RECAPTCHA_SECRET_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Step 6: Create `src/lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateReferenceNumber(lastRef: string | null): string {
  const year = new Date().getFullYear();
  if (!lastRef || !lastRef.startsWith(`AVT-${year}`)) {
    return `AVT-${year}-00001`;
  }
  const lastNum = parseInt(lastRef.split("-")[2], 10);
  return `AVT-${year}-${String(lastNum + 1).padStart(5, "0")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
```

**Step 7: Verify dev server runs**

```bash
npm run dev
```

Expected: App running at `http://localhost:3000`

**Step 8: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with dependencies"
```

---

## Task 2: Database Schema & Prisma Setup

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`, `prisma/seed.ts`

**Step 1: Initialize Prisma**

```bash
npx prisma init
```

**Step 2: Write the full schema in `prisma/schema.prisma`**

Copy the complete Prisma schema from `docs/PRD.md` — all 16 models with enums, relations, and indexes. Key models: AdminUser, Trek, TrekImage, Booking, Participant, GalleryCategory, GalleryImage, Review, Inquiry, HeroSlide, SocialInitiative, SiteSettings, TeamMember, FAQ, ActivityLog.

**Step 3: Create `src/lib/prisma.ts`** (singleton)

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
```

**Step 4: Create `prisma/seed.ts`** with:
- 1 Super Admin user (password: `admin123` hashed with bcrypt)
- 4 Gallery categories (Trek Photos, Social Activities, Events, Team)
- 3 sample treks (one PUBLISHED, one DRAFT, one FULLY_BOOKED)
- 2 hero slides
- 3 sample reviews (1 APPROVED featured, 1 APPROVED, 1 PENDING)
- 2 social initiatives
- SiteSettings entries for: stats, contact, footer
- 2 FAQ entries

**Step 5: Add seed script to `package.json`**

```json
"prisma": { "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts" }
```

**Step 6: Run migration + seed** (requires DATABASE_URL in `.env.local`)

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

**Step 7: Verify with Prisma Studio**

```bash
npx prisma studio
```

Expected: All tables visible with seed data at `http://localhost:5555`

**Step 8: Commit**

```bash
git add prisma/ src/lib/prisma.ts && git commit -m "feat: add Prisma schema with 16 models and seed data"
```

---

## Task 3: Auth Setup (Admin Login)

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/admin/login/page.tsx`, `src/middleware.ts`

**Step 1: Create `src/lib/auth.ts`** — NextAuth config with CredentialsProvider. Validate email+password against AdminUser table using bcrypt.compare. Return user with id, name, email, role in JWT token.

**Step 2: Create `src/app/api/auth/[...nextauth]/route.ts`** — export GET/POST handlers from auth config.

**Step 3: Create `src/middleware.ts`** — protect all `/admin/*` routes (except `/admin/login`). Redirect to `/admin/login` if no valid session.

**Step 4: Create `src/app/admin/login/page.tsx`** — clean login form with email + password. Use signIn from next-auth/react. Redirect to `/admin` on success. Show error on invalid credentials.

**Step 5: Test login** — navigate to `/admin`, verify redirect to login. Login with seeded admin credentials. Verify redirect to dashboard.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add admin authentication with NextAuth.js"
```

---

## Task 4: Public Layout (Navbar + Footer + WhatsApp)

**Files:**
- Create: `src/components/public/Navbar.tsx`, `src/components/public/Footer.tsx`, `src/components/public/WhatsAppButton.tsx`, `src/app/(public)/layout.tsx`

**Step 1: Create `Navbar.tsx`** — sticky top navbar. Logo "Avir Trekkers" left. Links: Home, Treks, Gallery, About Us, Social Impact, Contact. Mobile hamburger menu using Sheet component. Active link highlighting.

**Step 2: Create `Footer.tsx`** — 4-column grid: Brand (logo + tagline), Quick Links, Contact Info (phone tel:, email mailto:, WhatsApp), Social Media (Instagram, Facebook, YouTube icons). Copyright line.

**Step 3: Create `WhatsAppButton.tsx`** — fixed bottom-right green circular button. Links to `https://wa.me/{WHATSAPP_NUMBER}?text={encoded message}`. Uses env variable `NEXT_PUBLIC_WHATSAPP_NUMBER`.

**Step 4: Create `src/app/(public)/layout.tsx`** — wraps children with Navbar (top) + WhatsAppButton (float) + Footer (bottom).

**Step 5: Verify** — all pages should now have consistent nav/footer. WhatsApp button visible. Nav links work. Mobile menu works.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add public layout with navbar, footer, WhatsApp button"
```

---

## Task 5: Home Page

**Files:**
- Create: `src/app/(public)/page.tsx`, `src/components/public/HeroSection.tsx`, `src/components/public/TrekCard.tsx`, `src/components/public/StatsSection.tsx`, `src/components/public/SocialHighlight.tsx`, `src/components/public/ReviewCarousel.tsx`
- Create: `src/app/api/treks/route.ts`, `src/app/api/content/hero/route.ts`, `src/app/api/content/stats/route.ts`, `src/app/api/reviews/route.ts`

**Step 1: Create API route `GET /api/content/hero`** — fetch active hero slides from DB, ordered by sortOrder.

**Step 2: Create API route `GET /api/treks`** — fetch published treks with future dates. Support query params: `difficulty`, `trekType`, `limit`, `offset`. Calculate available slots via booking aggregation.

**Step 3: Create API route `GET /api/content/stats`** — fetch site settings where key = "stats".

**Step 4: Create API route `GET /api/reviews?featured=true`** — fetch approved reviews. If `featured=true`, only featured ones.

**Step 5: Create `HeroSection.tsx`** — full-width Swiper slider. Each slide: background image, headline, subtitle, CTA button. Auto-play with pagination dots.

**Step 6: Create `TrekCard.tsx`** — reusable card component. Props: trek data. Shows: cover image, name, date, difficulty badge, price, available slots, "Book Now" button. "Fully Booked" badge when slots=0. "Few Slots Left" when <5.

**Step 7: Create `StatsSection.tsx`** — 4 animated counters using Framer Motion. Numbers animate when scrolled into view (useInView). Labels: Trekkers, Treks Completed, Schools Helped, Cycles Donated.

**Step 8: Create `SocialHighlight.tsx`** — two-column: image left, text right. Brief charity description. "Learn More" link to `/social-impact`.

**Step 9: Create `ReviewCarousel.tsx`** — Swiper carousel. Each card: 5-star rating, review text (truncated), reviewer name, trek name.

**Step 10: Create `src/app/(public)/page.tsx`** — server component. Fetch hero, treks (limit 4), stats, featured reviews. Render: HeroSection → Upcoming Treks grid → StatsSection → SocialHighlight → ReviewCarousel.

**Step 11: Verify** — homepage renders all sections with seed data. Hero slider works. Trek cards show correct data. Stats animate. Reviews scroll.

**Step 12: Commit**

```bash
git add -A && git commit -m "feat: build complete homepage with hero, treks, stats, reviews"
```

---

## Task 6: Trek Listing + Detail Pages

**Files:**
- Create: `src/app/(public)/treks/page.tsx`, `src/app/(public)/treks/[slug]/page.tsx`, `src/components/public/TrekFilters.tsx`, `src/components/public/TrekGallery.tsx`
- Create: `src/app/api/treks/[slug]/route.ts`

**Step 1: Create `GET /api/treks/[slug]`** — fetch single trek by slug with images. Calculate available slots. Return 404 if not found or not published.

**Step 2: Create `TrekFilters.tsx`** — filter bar: Difficulty dropdown (Easy/Moderate/Hard), Trek Type dropdown (Fort/Nature/Night/Monsoon), Date range. Uses URL search params for state. "Clear Filters" button.

**Step 3: Create treks listing page** — server component. Fetch treks with filters from search params. Grid of TrekCard components. Pagination at bottom.

**Step 4: Create `TrekGallery.tsx`** — image carousel/gallery for trek detail page. Thumbnails strip below main image.

**Step 5: Create trek detail page** — server component with `generateMetadata` for SEO. Layout: image gallery top, two-column below (info left 65%, booking card right 35%). Info: name, badges, description (dangerouslySetInnerHTML for rich text), meeting point, distance, duration, itinerary timeline, inclusions/exclusions lists. Booking card: price, date, slots, "Book Now" link to `/book/[slug]`, share buttons (WhatsApp, copy link).

**Step 6: Verify** — listing page shows filtered treks. Detail page shows all trek info. "Fully Booked" state works. Share buttons work.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add trek listing with filters and detail page"
```

---

## Task 7: Booking System (Multi-Participant)

**Files:**
- Create: `src/app/(public)/book/[slug]/page.tsx`, `src/components/public/BookingForm.tsx`, `src/components/public/ParticipantForm.tsx`, `src/components/public/BookingSummary.tsx`, `src/components/public/BookingConfirmation.tsx`
- Create: `src/lib/validations.ts`, `src/app/api/bookings/route.ts`, `src/lib/email.ts`

**Step 1: Create Zod schemas in `src/lib/validations.ts`**

```typescript
import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(5).max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  emergencyContactName: z.string().min(2, "Emergency contact required"),
  emergencyContactPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone"),
});

export const bookingSchema = z.object({
  trekSlug: z.string(),
  registrantName: z.string().min(2),
  registrantEmail: z.string().email(),
  registrantPhone: z.string().regex(/^[6-9]\d{9}$/),
  registrantAge: z.coerce.number().min(5).max(80),
  registrantGender: z.string().optional(),
  registrantCity: z.string().optional(),
  participants: z.array(participantSchema).min(0),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: "You must accept terms" }) }),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
```

**Step 2: Create `src/lib/email.ts`** — sendBookingConfirmation function. Uses Nodemailer + SendGrid. HTML email template with: reference number, trek name/date/meeting point, participant table, payment instructions note.

**Step 3: Create `POST /api/bookings`** — validate with bookingSchema. Check trek exists + published. Check available slots >= totalParticipants. Generate reference number. Create Booking + Participant records in transaction. Send confirmation email. Return reference number.

**Step 4: Create `ParticipantForm.tsx`** — single participant fieldset: name, age, phone, emergency contact name, emergency phone. Remove button (X). Index-based for React Hook Form `useFieldArray`.

**Step 5: Create `BookingForm.tsx`** — multi-step form using React Hook Form.

- **Step state:** currentStep (1-4)
- **Step 1:** Registrant fields (name, email, phone, age, gender, city). "Next" validates step 1 fields.
- **Step 2:** Shows registrant as Participant 1 (read-only). "Add Participant" button adds ParticipantForm via `useFieldArray`. Shows participant count and available slots. "Remove" on each. "Next" validates all participants.
- **Step 3:** BookingSummary — table of all participants, total cost = (1 + participants.length) * pricePerPerson, terms checkbox.
- **Step 4:** BookingConfirmation — reference number, success message, action buttons.
- Step indicator bar at top showing progress.

**Step 6: Create `BookingSummary.tsx`** — renders trek info, participant table, total cost calculation, T&C checkbox, "Confirm Booking" button.

**Step 7: Create `BookingConfirmation.tsx`** — success state with checkmark, reference number, email sent notice, buttons: View Trek, WhatsApp Us, Back to Home.

**Step 8: Create booking page `src/app/(public)/book/[slug]/page.tsx`** — fetch trek by slug (must be published, has slots). Pass to BookingForm.

**Step 9: Test the full flow** — go to trek detail → click Book Now → fill registrant → add 2 participants → review summary → confirm → see confirmation + reference number. Check database for booking + participants. Check email delivery.

**Step 10: Commit**

```bash
git add -A && git commit -m "feat: implement multi-participant booking system with email confirmation"
```

---

## Task 8: Gallery Page

**Files:**
- Create: `src/app/(public)/gallery/page.tsx`, `src/components/public/GalleryGrid.tsx`, `src/components/public/Lightbox.tsx`
- Create: `src/app/api/gallery/route.ts`, `src/app/api/gallery/categories/route.ts`

**Step 1: Create `GET /api/gallery/categories`** — fetch all categories ordered by sortOrder.

**Step 2: Create `GET /api/gallery?category=slug`** — fetch images. If category param, filter by category slug. Paginate (limit/offset). Include category name.

**Step 3: Create `GalleryGrid.tsx`** — responsive grid (2 cols mobile, 3 tablet, 4 desktop). Each image: thumbnail with hover effect (slight zoom + caption overlay). Click opens Lightbox. Lazy loading with Next.js Image or loading="lazy".

**Step 4: Create `Lightbox.tsx`** — full-screen overlay/modal. Current image full-size. Prev/Next arrows. Close button (X) + ESC key. Caption at bottom. Keyboard nav (arrow keys).

**Step 5: Create gallery page** — Tabs component at top for categories (All + each category). GalleryGrid below. "Load More" button for pagination.

**Step 6: Verify** — categories filter works. Images display. Lightbox opens/closes. Keyboard nav works.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add gallery with category filters and lightbox viewer"
```

---

## Task 9: Remaining Public Pages (About, Social Impact, Reviews, Contact)

**Files:**
- Create pages: `about/page.tsx`, `social-impact/page.tsx`, `reviews/page.tsx`, `contact/page.tsx`
- Create components: `ContactForm.tsx`, `ReviewForm.tsx`, `InitiativeCard.tsx`
- Create APIs: `POST /api/inquiries`, `POST /api/reviews`, `GET /api/content/about`, `GET /api/content/social-impact`

**Step 1: About page** — fetch about content from SiteSettings + team members. Render rich text + team cards grid.

**Step 2: Social Impact page** — fetch initiatives. Render: impact counters (animated), initiative cards (image + title + description + metrics), optional timeline.

**Step 3: Reviews page** — fetch all approved reviews. Display in grid. ReviewForm at bottom: name, star rating (clickable stars), review text, trek dropdown (fetch published treks), optional photo. Submit calls `POST /api/reviews` (goes to PENDING).

**Step 4: Contact page** — ContactForm (name, email, phone, subject, message) with reCAPTCHA. On submit: `POST /api/inquiries` → saves to DB + sends email notification to admin. Also display: WhatsApp click-to-chat, clickable phone, clickable email, social media links.

**Step 5: Verify** — all pages render. Review submit works (check DB for PENDING review). Contact form submits + email sends.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add about, social impact, reviews, and contact pages"
```

---

## Task 10: SEO + Performance + Error Pages

**Files:**
- Modify: all page files (add `generateMetadata`)
- Create: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

**Step 1: Add `generateMetadata`** to every page — title, description, Open Graph image, canonical URL.

**Step 2: Create `sitemap.ts`** — dynamic sitemap listing all published trek URLs, static pages.

**Step 3: Create `robots.ts`** — allow all crawlers, reference sitemap URL, disallow `/admin/*`.

**Step 4: Create `not-found.tsx`** — friendly 404 page with illustration, message, "Go Home" button.

**Step 5: Create `error.tsx`** — client error boundary with retry button.

**Step 6: Performance audit** — ensure all images use `next/image` or lazy loading. Verify no layout shift. Check Lighthouse score target: 90+.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add SEO metadata, sitemap, error pages, performance optimization"
```

---

## Task 11: Admin Layout + Dashboard

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/page.tsx`, `src/components/admin/AdminSidebar.tsx`, `src/components/admin/DashboardStats.tsx`
- Create: `src/app/api/admin/dashboard/route.ts`

**Step 1: Create `GET /api/admin/dashboard`** — return: bookingsThisMonth (count), upcomingTreks (count), pendingReviews (count), unreadInquiries (count), recentBookings (last 5), recentInquiries (last 5).

**Step 2: Create `AdminSidebar.tsx`** — left sidebar with links: Dashboard, Treks, Bookings, Gallery, Reviews, Inquiries, Content, Settings. Active state. Collapse on mobile. Logout button at bottom.

**Step 3: Create admin layout** — sidebar left + main content area right. Top header with page title + admin name dropdown (profile, logout).

**Step 4: Create `DashboardStats.tsx`** — 4 stat cards. Recent bookings table (5 rows). Recent inquiries list.

**Step 5: Create dashboard page** — fetch dashboard data, render stats + recent activity.

**Step 6: Verify** — login → see dashboard with correct counts from seed data. Sidebar navigation works.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add admin layout with sidebar and dashboard"
```

---

## Task 12: Admin Trek Management

**Files:**
- Create: `src/app/admin/treks/page.tsx`, `src/app/admin/treks/new/page.tsx`, `src/app/admin/treks/[id]/edit/page.tsx`
- Create: `src/components/admin/TrekForm.tsx`, `src/components/admin/TrekTable.tsx`, `src/components/admin/RichTextEditor.tsx`, `src/components/admin/ImageUploader.tsx`
- Create: `src/app/api/admin/treks/route.ts`, `src/app/api/admin/treks/[id]/route.ts`, `src/app/api/admin/upload/route.ts`

**Step 1: Create `POST /api/admin/upload`** — upload image to Cloudinary. Return URL + thumbnail URL. Accept multipart form data.

**Step 2: Create admin treks CRUD API** — GET (list with search/sort/pagination), POST (create), GET by id, PUT (update), DELETE (soft delete). Auto-set FULLY_BOOKED when slots fill. Cannot delete trek with active bookings.

**Step 3: Create `ImageUploader.tsx`** — drag-drop zone. Preview uploaded images. Multiple file support. Calls upload API.

**Step 4: Create `RichTextEditor.tsx`** — simple rich text editor (can use a lightweight lib like `react-quill` or `tiptap` minimal). Bold, italic, headings, lists, links.

**Step 5: Create `TrekForm.tsx`** — comprehensive form: name, slug (auto-generated), description (RichTextEditor), cover image (ImageUploader), date picker, meeting point, meeting time, difficulty dropdown, trek type dropdown, distance, duration, price, max participants, inclusions (dynamic list — add/remove items), exclusions (dynamic list), itinerary (dynamic list of time + activity), important notes, gallery images (multi ImageUploader), status dropdown. Save as Draft or Publish.

**Step 6: Create `TrekTable.tsx`** — data table with columns: Name, Date, Status (badge), Bookings count, Available slots, Actions (Edit, Duplicate, Delete). Searchable. Sortable by date/name. Paginated.

**Step 7: Create trek list page** — TrekTable + "Create New Trek" button.

**Step 8: Create new trek page** — TrekForm in create mode.

**Step 9: Create edit trek page** — TrekForm pre-filled with existing trek data.

**Step 10: Verify** — create a trek → appears in list → edit it → changes reflect on public site → duplicate creates a draft copy.

**Step 11: Commit**

```bash
git add -A && git commit -m "feat: add admin trek management with CRUD, rich text, image upload"
```

---

## Task 13: Admin Booking Management + Excel Export

**Files:**
- Create: `src/app/admin/bookings/page.tsx`, `src/app/admin/bookings/[id]/page.tsx`, `src/components/admin/BookingTable.tsx`, `src/components/admin/BookingDetail.tsx`
- Create: `src/app/api/admin/bookings/route.ts`, `src/app/api/admin/bookings/[id]/route.ts`, `src/app/api/admin/export/bookings/route.ts`

**Step 1: Create admin bookings API** — GET list (filter by trekId, dateRange, status, search by name/phone). GET by id (include all participants). PUT (update status).

**Step 2: Create `GET /api/admin/export/bookings`** — query params: `trekId`, `dateFrom`, `dateTo`. Generate .xlsx using `xlsx` package. Columns: Participant Name, Age, Phone, Emergency Contact, Emergency Phone, Trek Name, Trek Date, Booking Ref, Booking Date, Status. Set response headers for file download.

**Step 3: Create `BookingTable.tsx`** — data table with filters (trek dropdown, date range, status). Columns: Ref#, Registrant, Trek, Participants count, Date, Status badge. "Export Excel" button triggers download.

**Step 4: Create `BookingDetail.tsx`** — registrant info card + participants table + trek info + status update dropdown.

**Step 5: Create bookings pages** — list page with BookingTable. Detail page with BookingDetail.

**Step 6: Verify** — filter bookings by trek → export Excel → open file → all participant data correct. Update booking status → reflects in list.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add admin booking management with Excel export"
```

---

## Task 14: Admin Gallery, Reviews, Inquiries, Content Management

**Files:**
- Create pages: `admin/gallery/page.tsx`, `admin/reviews/page.tsx`, `admin/inquiries/page.tsx`, `admin/content/page.tsx`, `admin/settings/page.tsx`
- Create APIs: `admin/gallery/*`, `admin/reviews/*`, `admin/inquiries/*`, `admin/content/*`, `admin/users/*`

**Step 1: Gallery management** — bulk image uploader with category assignment. Category CRUD (create/rename/delete). Image grid with select + bulk delete. Reorder via sortOrder.

**Step 2: Review management** — pending reviews queue at top. Each review: preview text, star rating, approve/reject buttons. Approved section below with "Feature" toggle. Delete option.

**Step 3: Inquiry management** — table with read/unread indicator (bold/normal). Click to view full message. Mark as read. Reply button opens email compose.

**Step 4: Content management** — tabbed interface: Hero Slides (CRUD, image + text + CTA), About (rich text editor), Social Initiatives (CRUD cards), Stats (number inputs for each counter), FAQ (CRUD).

**Step 5: Settings / Admin users** — list admin users. Add new admin (email + name + role). Edit role. Deactivate/activate.

**Step 6: Verify** — upload gallery images → appear on public gallery. Approve review → appears on public site. Update hero slide → homepage updates. Reply to inquiry → email sends.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add admin gallery, reviews, inquiries, and content management"
```

---

## Task 15: Final Polish + Testing + Deploy Prep

**Files:**
- Modify: various files for bug fixes
- Create: `.github/workflows/ci.yml`

**Step 1: Mobile responsiveness audit** — test every page on 375px, 768px, 1024px, 1280px. Fix any layout breaks.

**Step 2: Loading states** — add Skeleton loaders to all data-fetching components. Loading.tsx files for route-level loading.

**Step 3: Error handling** — API error responses are consistent JSON. Client shows toast notifications for success/error. Form validation errors are clear.

**Step 4: Security hardening** — rate limiting on public POST endpoints (bookings, reviews, inquiries). Input sanitization. CSRF protection verified. Admin routes fully protected.

**Step 5: CI pipeline** — GitHub Actions: install → lint → type-check → build. Run on push to main.

**Step 6: Lighthouse audit** — target 90+ on Performance, Accessibility, Best Practices, SEO.

**Step 7: Final commit**

```bash
git add -A && git commit -m "feat: final polish, responsive fixes, loading states, security hardening"
```

---

## Deployment Checklist

```
[ ] Production DATABASE_URL configured (NeonDB)
[ ] Cloudinary credentials set
[ ] SendGrid API key set
[ ] NEXTAUTH_SECRET generated (openssl rand -base64 32)
[ ] reCAPTCHA keys configured
[ ] WhatsApp number set
[ ] Domain DNS → Vercel
[ ] Vercel environment variables set
[ ] prisma migrate deploy on production DB
[ ] Seed production DB with initial admin user
[ ] SSL verified
[ ] Google Analytics connected
[ ] Sentry DSN configured
[ ] Smoke test all critical flows
[ ] Admin training session with client
```

---

*Reference: `docs/PRD.md` for complete requirements. `docs/archive/` for detailed breakdowns.*
