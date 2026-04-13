# Development Execution Plan & Roadmap

## Avir Trekkers Web Platform

---

| Field               | Details                          |
|---------------------|----------------------------------|
| **Document Version**| 1.0                              |
| **Date**            | 2026-04-12                       |
| **Estimated Duration** | 10-12 Weeks                   |

---

## 1. Development Methodology

- **Approach**: Agile (2-week sprints)
- **Total Sprints**: 5-6 sprints
- **Sprint Duration**: 2 weeks each
- **Daily Standups**: 15-min sync
- **Sprint Reviews**: End of each sprint with client demo
- **Tools**: GitHub (code), GitHub Projects (task tracking), Figma (design), Vercel (deployment)

---

## 2. Phase Breakdown

---

### PHASE 0: Project Setup & Design (Week 1-2) — Sprint 0

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 0.1 | Finalize requirements with client | PM | 2 days | Signed-off BRD & FRS |
| 0.2 | Create UI/UX wireframes (Figma) | Designer | 4 days | Wireframe screens for all pages |
| 0.3 | Design high-fidelity mockups | Designer | 4 days | Pixel-perfect designs for homepage, trek detail, booking form, admin dashboard |
| 0.4 | Client design review & approval | PM + Client | 1 day | Approved designs |
| 0.5 | Setup development environment | Dev | 1 day | GitHub repo, Next.js project, Prisma, Tailwind, ESLint, Prettier |
| 0.6 | Setup cloud services | Dev | 1 day | NeonDB database, Cloudinary account, SendGrid account, Vercel project |
| 0.7 | Setup CI/CD pipeline | Dev | 0.5 day | GitHub Actions for lint, test, deploy |
| 0.8 | Create database schema (Prisma) | Dev | 1 day | schema.prisma with all models, initial migration |
| 0.9 | Seed database with test data | Dev | 0.5 day | Seed script with sample treks, bookings, reviews |

**Sprint 0 Deliverables:**
- Approved wireframes and mockups
- Running development environment
- Database schema deployed
- CI/CD pipeline working
- Preview deployment URL

---

### PHASE 1: Core Public Website (Week 3-4) — Sprint 1

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 1.1 | Global layout: Navbar + Footer | Dev | 1 day | Responsive navbar with mobile menu, footer with links |
| 1.2 | Home page: Hero Section | Dev | 1.5 days | Dynamic hero slider with admin-editable content |
| 1.3 | Home page: Featured Treks | Dev | 1 day | Trek cards grid with upcoming treks |
| 1.4 | Home page: Stats Section | Dev | 0.5 day | Animated counters section |
| 1.5 | Home page: Social Impact Highlight | Dev | 0.5 day | Brief charity section with CTA |
| 1.6 | Home page: Reviews Carousel | Dev | 1 day | Swiper carousel with featured reviews |
| 1.7 | Trek Listing Page | Dev | 1.5 days | Grid view, filters, search, pagination |
| 1.8 | Trek Detail Page | Dev | 1.5 days | Full detail page with image gallery, itinerary, share buttons |
| 1.9 | API routes: Treks (GET) | Dev | 1 day | GET /api/treks, GET /api/treks/[slug] with pagination/filters |
| 1.10 | WhatsApp floating button | Dev | 0.5 day | Persistent WhatsApp CTA |

**Sprint 1 Deliverables:**
- Fully functional homepage with all sections
- Trek listing with filters
- Trek detail page
- WhatsApp integration
- Preview deployment for client review

---

### PHASE 2: Booking System & Contact (Week 5-6) — Sprint 2

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 2.1 | Booking form: Primary registrant | Dev | 1.5 days | Step 1 of booking with validation |
| 2.2 | Booking form: Multi-participant | Dev | 2 days | Add/remove participant UI, dynamic form fields, slot validation |
| 2.3 | Booking form: Summary & Confirm | Dev | 1 day | Summary step with total cost, confirm button |
| 2.4 | Booking API: Create booking | Dev | 1 day | POST /api/bookings with participants, slot check, reference generation |
| 2.5 | Booking confirmation email | Dev | 1 day | Email template with booking details, participant list |
| 2.6 | Contact page | Dev | 1 day | Contact form, phone/email/WhatsApp display, CAPTCHA |
| 2.7 | Contact form API | Dev | 0.5 day | POST /api/inquiries with email notification to admin |
| 2.8 | About Us page | Dev | 0.5 day | Rich text content page, team section |
| 2.9 | Social Impact page | Dev | 1 day | Initiative cards, impact counters, timeline |
| 2.10 | Review submission form | Dev | 0.5 day | Submit review form with star rating |

**Sprint 2 Deliverables:**
- Complete booking flow with multi-participant enrollment
- Booking confirmation emails working
- Contact page with all channels
- About Us and Social Impact pages
- Review submission form

---

### PHASE 3: Gallery & Reviews (Week 7-8) — Sprint 3

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 3.1 | Gallery page: Grid layout | Dev | 1.5 days | Responsive masonry grid with lazy loading |
| 3.2 | Gallery: Category tabs/filters | Dev | 1 day | Category-based filtering with tab UI |
| 3.3 | Gallery: Lightbox viewer | Dev | 1 day | Full-size image modal with prev/next, captions |
| 3.4 | Gallery API endpoints | Dev | 0.5 day | GET /api/gallery with category filter |
| 3.5 | Reviews page | Dev | 1 day | All approved reviews with pagination |
| 3.6 | Reviews API | Dev | 0.5 day | GET /api/reviews, POST /api/reviews |
| 3.7 | SEO optimization | Dev | 1 day | Meta tags, OG tags, structured data, sitemap, robots.txt |
| 3.8 | Performance optimization | Dev | 1 day | Image optimization, lazy loading, code splitting audit |
| 3.9 | 404 & Error pages | Dev | 0.5 day | Custom error pages |
| 3.10 | FAQ section | Dev | 0.5 day | Accordion FAQ component (optional) |
| 3.11 | Mobile responsiveness audit | Dev | 1 day | Test and fix all pages across devices |

**Sprint 3 Deliverables:**
- Complete gallery with categories and lightbox
- Reviews display page
- SEO and performance optimized
- Mobile-responsive across all pages
- Public website feature-complete

---

### PHASE 4: Admin Portal (Week 9-10) — Sprint 4

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 4.1 | Admin auth: Login page | Dev | 1 day | Login form, JWT auth, protected routes middleware |
| 4.2 | Admin auth: Password reset | Dev | 0.5 day | Forgot password flow via email |
| 4.3 | Admin layout: Sidebar + Header | Dev | 1 day | Admin shell with sidebar navigation, responsive |
| 4.4 | Dashboard page | Dev | 1 day | Stats cards, recent activity, quick actions |
| 4.5 | Trek management: List | Dev | 1 day | Data table with sort, search, pagination, status badges |
| 4.6 | Trek management: Create/Edit | Dev | 2 days | Full form with rich text editor, image upload, itinerary builder |
| 4.7 | Trek management: Delete/Cancel | Dev | 0.5 day | Soft delete, cancel with email notification |
| 4.8 | Booking management: List | Dev | 1 day | Filterable booking table |
| 4.9 | Booking management: Detail | Dev | 0.5 day | Full booking detail with participant list |
| 4.10 | Booking export: Excel | Dev | 1 day | Export as .xlsx with all participant data |

**Sprint 4 Deliverables:**
- Admin authentication working
- Dashboard with stats
- Full trek CRUD management
- Booking viewing and Excel export
- Preview deployment for client admin testing

---

### PHASE 5: Admin Portal Completion & Polish (Week 11-12) — Sprint 5

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 5.1 | Gallery management | Dev | 1.5 days | Upload, categorize, delete images from admin |
| 5.2 | Content management: Hero | Dev | 1 day | Edit hero slides from admin |
| 5.3 | Content management: About, Social Impact, Stats | Dev | 1 day | Rich text editors for all content sections |
| 5.4 | Review management | Dev | 1 day | Review queue, approve/reject, feature toggle |
| 5.5 | Inquiry management | Dev | 0.5 day | View, read/unread, reply to inquiries |
| 5.6 | Admin user management | Dev | 0.5 day | Add/edit/deactivate admin users with roles |
| 5.7 | End-to-end testing | QA | 2 days | Test all flows: booking, admin CRUD, gallery, reviews |
| 5.8 | Bug fixes & polish | Dev | 2 days | Fix all bugs found in testing |
| 5.9 | Security audit | Dev | 0.5 day | OWASP checks, input validation, rate limiting |
| 5.10 | Performance audit | Dev | 0.5 day | Lighthouse scores, Core Web Vitals optimization |
| 5.11 | Client UAT (User Acceptance Testing) | Client + PM | 2 days | Client tests all features, provides feedback |
| 5.12 | Final fixes from UAT | Dev | 1 day | Address UAT feedback |

**Sprint 5 Deliverables:**
- Complete admin portal
- All features tested and polished
- Security and performance audited
- Client UAT completed
- Ready for production deployment

---

### PHASE 6: Deployment & Launch (Week 12+)

| # | Task | Owner | Duration | Deliverable |
|---|------|-------|----------|-------------|
| 6.1 | Domain setup & DNS configuration | Dev + Client | 0.5 day | Custom domain pointed to Vercel |
| 6.2 | Production environment setup | Dev | 0.5 day | Production database, env variables, secrets |
| 6.3 | SSL certificate verification | Dev | 0.5 day | HTTPS working on custom domain |
| 6.4 | Production deployment | Dev | 0.5 day | Deploy to production |
| 6.5 | Smoke testing on production | QA | 0.5 day | Verify all features on live site |
| 6.6 | Google Analytics setup | Dev | 0.5 day | GA4 tracking configured |
| 6.7 | Initial content upload | Client + Dev | 1 day | Upload real treks, images, content |
| 6.8 | Admin training | Dev + PM | 0.5 day | Train client on admin portal usage |
| 6.9 | Documentation handover | Dev | 0.5 day | Admin guide, technical docs, env setup guide |
| 6.10 | Go Live | All | - | Website launched |

---

## 3. Sprint Calendar

```
Week 1-2:   Sprint 0 — Setup & Design
Week 3-4:   Sprint 1 — Core Public Website (Home, Treks)
Week 5-6:   Sprint 2 — Booking System, Contact, About, Social Impact
Week 7-8:   Sprint 3 — Gallery, Reviews, SEO, Performance
Week 9-10:  Sprint 4 — Admin Portal Core (Auth, Treks, Bookings)
Week 11-12: Sprint 5 — Admin Completion, Testing, UAT
Week 12+:   Deployment & Launch
```

---

## 4. Team Requirements

| Role | Count | Responsibilities |
|------|-------|-----------------|
| **Fullstack Developer** | 1-2 | Build frontend + backend + database |
| **UI/UX Designer** | 1 | Wireframes, mockups, design system |
| **Project Manager** | 1 | Client communication, sprint planning, tracking |
| **QA Tester** | 1 (part-time) | Testing in Sprint 5 |

---

## 5. Milestone Tracker

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| M1: Requirements Finalized | Week 1 | Pending |
| M2: Designs Approved | Week 2 | Pending |
| M3: Public Website Demo | Week 4 | Pending |
| M4: Booking System Working | Week 6 | Pending |
| M5: Public Site Complete | Week 8 | Pending |
| M6: Admin Portal Demo | Week 10 | Pending |
| M7: UAT Complete | Week 12 | Pending |
| M8: Go Live | Week 12+ | Pending |

---

## 6. Risk Mitigation During Development

| Risk | Mitigation |
|------|------------|
| Delayed content from client | Start with placeholder content, request real content by Sprint 3 |
| Design changes mid-development | Freeze designs after Sprint 0 approval. Changes via formal CR process |
| Scope creep | Strict sprint scope. New requests go to backlog for future sprints |
| Developer unavailability | Document code thoroughly, use PR reviews |
| Third-party service issues | Have fallback options (e.g., UploadThing if Cloudinary fails) |

---

## 7. Post-Launch Support Plan

| Activity | Duration | Details |
|----------|----------|---------|
| Bug fixes | 2 weeks | Fix any bugs found post-launch |
| Monitoring | 4 weeks | Monitor performance, errors (Sentry) |
| Knowledge transfer | 1 session | Ensure client can manage content independently |
| Phase 2 Planning | As needed | Payment gateway, mobile app, blog, multilingual |

---

## 8. Phase 2 Backlog (Future Enhancements)

| # | Feature | Priority |
|---|---------|----------|
| P2-01 | Online payment gateway (Razorpay) | HIGH |
| P2-02 | Multilingual support (Marathi, Hindi) | MEDIUM |
| P2-03 | Blog / Articles section | MEDIUM |
| P2-04 | Push notifications for trek updates | LOW |
| P2-05 | Mobile app (React Native) | LOW |
| P2-06 | Advanced analytics dashboard | MEDIUM |
| P2-07 | Automated WhatsApp booking notifications | MEDIUM |
| P2-08 | Waitlist feature for fully booked treks | MEDIUM |
| P2-09 | Trek difficulty quiz/recommender | LOW |
| P2-10 | Volunteer registration portal | LOW |

---

*End of Development Execution Plan*
