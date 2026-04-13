# Functional Requirements Specification (FRS)

## Avir Trekkers Web Platform

---

| Field               | Details                          |
|---------------------|----------------------------------|
| **Project Name**    | Avir Trekkers Web Platform       |
| **Document Version**| 1.0                              |
| **Date**            | 2026-04-12                       |

---

## 1. Public Website — Functional Requirements

---

### 1.1 Home Page / Hero Section

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-001 | Dynamic Hero Banner | HIGH | Rotating/sliding hero banners with image, headline text, subtitle, and CTA button. All content admin-editable. |
| PW-002 | Featured Upcoming Treks | HIGH | Display top 3-4 upcoming treks with image, name, date, price, and "Book Now" CTA. |
| PW-003 | Quick Stats Section | MEDIUM | Display stats like "500+ Trekkers", "50+ Treks", "20+ Schools Helped", "100+ Cycles Donated". Admin-editable numbers. |
| PW-004 | Social Impact Highlight | HIGH | Brief section highlighting charity work with image and "Learn More" link. |
| PW-005 | Recent Reviews Carousel | MEDIUM | Show 3-5 approved reviews as a scrollable carousel. |
| PW-006 | WhatsApp Floating Button | HIGH | Persistent floating WhatsApp icon (bottom-right) that opens WhatsApp chat with pre-filled message. |
| PW-007 | Navigation Bar | HIGH | Sticky nav with links: Home, Treks, Gallery, About Us, Social Impact, Contact Us. Mobile hamburger menu. |
| PW-008 | Footer | HIGH | Footer with contact info, quick links, social media icons, copyright notice. |

---

### 1.2 Treks Section

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-010 | Trek Listing Page | HIGH | Grid/list view of all published treks. Each card shows: image, trek name, date, difficulty level, price, available slots, and "Book Now" button. |
| PW-011 | Trek Filters | MEDIUM | Filter treks by: Difficulty (Easy, Moderate, Hard), Date Range, Price Range, Trek Type (Fort, Nature, Night Trek). |
| PW-012 | Trek Search | MEDIUM | Search bar to search treks by name or location. |
| PW-013 | Trek Detail Page | HIGH | Full page with: Image gallery/carousel, Trek name, Description (rich text), Date & time, Meeting point, Difficulty level, Distance/Duration, Price per person, Inclusions/Exclusions list, Itinerary (timeline), Important notes, Available slots counter, "Book Now" CTA, Share buttons (WhatsApp, Facebook, Copy Link). |
| PW-014 | Trek Status Badge | HIGH | Visual badges: "Upcoming", "Fully Booked", "Completed", "Few Slots Left" (when <5 slots). |
| PW-015 | Past Treks Archive | LOW | Section showing completed treks with photos (links to gallery). |

---

### 1.3 Trek Booking & Enrollment System

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-020 | Booking Form | HIGH | Multi-step form triggered by "Book Now" button. |
| PW-021 | Primary Registrant Info | HIGH | Fields: Full Name*, Email*, Phone Number*, Age*, Gender, City. (* = required) |
| PW-022 | Multi-Participant Enrollment | HIGH | "Add Participant" button to add additional participants under same booking. Each participant: Full Name*, Age*, Phone Number*, Emergency Contact Name*, Emergency Contact Phone*. Minimum 1 participant (the registrant). No upper limit but constrained by available slots. |
| PW-023 | Participant Counter | HIGH | Dynamic count of total participants in current booking. Real-time slot availability check. |
| PW-024 | Remove Participant | HIGH | Ability to remove added participants before submission. |
| PW-025 | Booking Summary | HIGH | Summary screen before submission showing: Trek name, date, total participants with names, total cost (participants × price), contact info. |
| PW-026 | Booking Confirmation | HIGH | On submission: Show success message with booking reference number. Send confirmation email to registrant with all details. Send WhatsApp notification (optional, Phase 2). |
| PW-027 | Booking Validation | HIGH | Validate: All required fields filled, Phone number format (Indian 10-digit), Email format valid, Age is numeric and reasonable (5-80), Available slots >= total participants in booking. |
| PW-028 | Terms & Conditions | MEDIUM | Checkbox to accept terms before booking submission. Link to T&C page. |
| PW-029 | Duplicate Booking Check | MEDIUM | Warn if same phone number already has a booking for the same trek. |

---

### 1.4 Gallery

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-030 | Gallery Landing Page | HIGH | Gallery page with category tabs/filters at the top. |
| PW-031 | Gallery Categories | HIGH | Categories: "Trek Photos", "Social Activities", "Events", "Team". Admin can add/edit/delete categories. |
| PW-032 | Image Grid | HIGH | Responsive masonry or grid layout with image thumbnails. |
| PW-033 | Lightbox View | HIGH | Click image to open full-size in lightbox/modal with prev/next navigation. |
| PW-034 | Image Captions | MEDIUM | Optional caption and date for each image, visible on hover or in lightbox. |
| PW-035 | Lazy Loading | HIGH | Images load progressively as user scrolls (infinite scroll or paginated). |
| PW-036 | Image Optimization | HIGH | Auto-compress and serve in WebP format. Generate thumbnails for grid view. |

---

### 1.5 Social Impact / Charity Section

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-040 | Social Impact Landing Page | HIGH | Dedicated page showcasing all social/charity initiatives. |
| PW-041 | Initiative Cards | HIGH | Each initiative displayed as a card with: Title, Description, Images, Impact metrics (e.g., "50 cycles donated"). |
| PW-042 | Timeline/History | MEDIUM | Chronological timeline of social initiatives and milestones. |
| PW-043 | Impact Numbers | HIGH | Big, animated counters: Schools Helped, Cycles Donated, Students Supported, Villages Reached. |
| PW-044 | Photo/Video Evidence | HIGH | Photos from actual events (school visits, cycle donations, etc.). |
| PW-045 | Collaboration CTA | MEDIUM | "Want to contribute?" section with contact options. |

---

### 1.6 About Us

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-050 | About Page | HIGH | Organization story, mission, vision. Admin-editable rich text. |
| PW-051 | Team Section | MEDIUM | Team member cards with photo, name, role, short bio. |
| PW-052 | Journey Timeline | LOW | Visual timeline of the organization's journey and milestones. |

---

### 1.7 Reviews & Testimonials

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-060 | Reviews Display | HIGH | Approved reviews shown on homepage carousel and dedicated reviews page. |
| PW-061 | Submit Review | HIGH | Form: Name*, Rating (1-5 stars)*, Review text*, Trek attended (dropdown), Photo (optional). |
| PW-062 | Review Moderation | HIGH | Reviews go to admin queue. Only appear on site after admin approval. |
| PW-063 | Featured Reviews | MEDIUM | Admin can mark reviews as "featured" to show on homepage. |

---

### 1.8 Contact Us

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-070 | Contact Page | HIGH | Dedicated contact page with all communication channels. |
| PW-071 | Contact Form | HIGH | Fields: Name*, Email*, Phone, Subject*, Message*. Sends email to admin + stores in database. |
| PW-072 | WhatsApp Integration | HIGH | Click-to-chat button that opens WhatsApp with Avir Trekkers number and pre-filled greeting. |
| PW-073 | Email Display | HIGH | Clickable email address (mailto: link). |
| PW-074 | Phone Display | HIGH | Clickable phone number (tel: link). |
| PW-075 | Map Embed | LOW | Google Maps embed showing base location (optional). |
| PW-076 | CAPTCHA | HIGH | Google reCAPTCHA on contact form to prevent spam. |
| PW-077 | Social Media Links | MEDIUM | Links to Instagram, Facebook, YouTube profiles. |

---

### 1.9 Common/Shared Features

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| PW-080 | Mobile Responsive | HIGH | Fully responsive across mobile, tablet, and desktop. |
| PW-081 | SEO Optimization | HIGH | SSR, meta tags, OG tags, structured data, sitemap. |
| PW-082 | Loading States | HIGH | Skeleton loaders, spinners for async operations. |
| PW-083 | Error Handling | HIGH | User-friendly error pages (404, 500). Form validation error messages. |
| PW-084 | Cookie Consent | MEDIUM | Cookie consent banner for compliance. |
| PW-085 | Back to Top | LOW | Floating "back to top" button on scroll. |

---

## 2. Admin Portal — Functional Requirements

---

### 2.1 Authentication & Access

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-001 | Admin Login | HIGH | Email + password login with secure hashing (bcrypt). |
| AP-002 | Session Management | HIGH | JWT-based sessions with expiry. Auto-logout on inactivity. |
| AP-003 | Password Reset | HIGH | Forgot password flow via email OTP or reset link. |
| AP-004 | Role-Based Access | MEDIUM | Roles: Super Admin (full access), Admin (content + trek mgmt), Moderator (reviews + inquiries only). |

---

### 2.2 Dashboard

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-010 | Dashboard Overview | HIGH | At-a-glance view: Total bookings this month, Upcoming treks count, Pending reviews count, Unread inquiries count, Total participants this month. |
| AP-011 | Recent Activity Feed | MEDIUM | List of recent bookings, reviews, and inquiries. |
| AP-012 | Quick Actions | MEDIUM | Shortcuts to: Create new trek, View pending reviews, View unread inquiries. |

---

### 2.3 Trek Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-020 | Create Trek | HIGH | Form with fields: Trek Name, Description (rich text editor), Date & Time, Meeting Point, Difficulty Level (dropdown), Distance, Duration, Price per Person, Max Participants, Inclusions (list), Exclusions (list), Itinerary (timeline builder), Trek Type (Fort/Nature/Night/Monsoon), Cover Image upload, Gallery Images upload (multiple), Status (Draft/Published). |
| AP-021 | Edit Trek | HIGH | Edit all trek fields. Changes reflect on public site immediately. |
| AP-022 | Delete Trek | HIGH | Soft delete (archive). Confirm dialog before deletion. Cannot delete treks with active bookings. |
| AP-023 | Trek Listing | HIGH | Table view with columns: Name, Date, Status, Bookings count, Available slots, Actions (Edit/View/Delete). Sortable and searchable. |
| AP-024 | Duplicate Trek | MEDIUM | Clone an existing trek as a new draft (useful for recurring treks). |
| AP-025 | Trek Status Toggle | HIGH | Change status between Draft, Published, Cancelled. Auto-set to "Fully Booked" when slots filled. |

---

### 2.4 Booking & Enrollment Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-030 | Bookings List | HIGH | Table: Booking ID, Registrant Name, Trek Name, Participants Count, Booking Date, Status. Filterable by trek, date range. |
| AP-031 | Booking Detail View | HIGH | Full details: Registrant info, All participants with details, Trek info, Booking timestamp. |
| AP-032 | Export Bookings | HIGH | Export participant list as Excel (.xlsx) or CSV. Filters: By trek, by date range. Columns: Participant Name, Age, Phone, Emergency Contact, Trek Name, Booking Date. |
| AP-033 | Booking Status | MEDIUM | Status: Confirmed, Cancelled, Attended. Admin can update status. |
| AP-034 | Participant Count | HIGH | Real-time total participant count per trek. |
| AP-035 | Send Notification | LOW | Send email/SMS to all participants of a specific trek (for updates, cancellations). |

---

### 2.5 Gallery Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-040 | Upload Images | HIGH | Bulk upload with drag-and-drop. Auto-compression on upload. |
| AP-041 | Manage Categories | HIGH | Create, rename, delete gallery categories. |
| AP-042 | Assign Categories | HIGH | Assign/move images between categories. |
| AP-043 | Image Details | MEDIUM | Edit caption, date, alt text for each image. |
| AP-044 | Delete Images | HIGH | Delete single or bulk images with confirmation. |
| AP-045 | Reorder Images | LOW | Drag-and-drop reorder within categories. |

---

### 2.6 Content Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-050 | Hero Section Editor | HIGH | Update hero banners: Upload image, Edit headline, Edit subtitle, Edit CTA text & link. Support multiple slides. |
| AP-051 | About Us Editor | HIGH | Rich text editor for About Us content. |
| AP-052 | Social Impact Editor | HIGH | CRUD for social impact initiatives: Title, description, images, metrics. |
| AP-053 | Stats Editor | MEDIUM | Edit homepage stat numbers (Trekkers count, Treks count, Schools helped, etc.). |
| AP-054 | FAQ Management | LOW | CRUD for FAQ entries (question + answer). |
| AP-055 | Footer Editor | LOW | Edit footer content, social media links, contact info. |

---

### 2.7 Review Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-060 | Review Queue | HIGH | List of pending reviews awaiting approval. |
| AP-061 | Approve/Reject | HIGH | Approve or reject reviews. Rejected reviews are deleted or archived. |
| AP-062 | Feature Review | MEDIUM | Mark review as "featured" to show on homepage carousel. |
| AP-063 | Delete Review | HIGH | Remove published reviews. |

---

### 2.8 Inquiry Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-070 | Inquiries List | HIGH | Table: Name, Email, Subject, Date, Read/Unread status. |
| AP-071 | Inquiry Detail | HIGH | View full inquiry message. Mark as read/unread. |
| AP-072 | Reply to Inquiry | MEDIUM | Reply via email directly from admin panel. |
| AP-073 | Delete Inquiry | MEDIUM | Delete old/spam inquiries. |

---

### 2.9 Admin User Management

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| AP-080 | Admin List | HIGH | View all admin users with roles. |
| AP-081 | Add Admin | HIGH | Invite new admin by email with role assignment. |
| AP-082 | Edit Admin | HIGH | Change admin role or deactivate account. |
| AP-083 | Activity Log | LOW | Log of admin actions for audit trail. |

---

## 3. Data Export Requirements

| ID     | Requirement | Priority | Details |
|--------|-------------|----------|---------|
| DE-001 | Participant Export | HIGH | Export trek participants as .xlsx with all details. |
| DE-002 | Booking Report | MEDIUM | Monthly booking summary report (total bookings, revenue, popular treks). |
| DE-003 | Inquiry Export | LOW | Export contact inquiries as CSV. |

---

## 4. Email Notification Requirements

| ID     | Trigger | Recipient | Content |
|--------|---------|-----------|---------|
| EN-001 | New Booking | Registrant | Booking confirmation with reference number, trek details, participant list. |
| EN-002 | New Booking | Admin | New booking alert with summary. |
| EN-003 | Trek Cancelled | All Participants | Cancellation notice with details. |
| EN-004 | New Inquiry | Admin | New contact form submission alert. |
| EN-005 | Review Approved | Reviewer | Notification that their review is live. |

---

## 5. Integration Requirements

| Integration | Type | Details |
|-------------|------|---------|
| WhatsApp | Click-to-chat | Opens WhatsApp with pre-filled message to Avir Trekkers number. |
| Email (SMTP) | Transactional | SendGrid / AWS SES for booking confirmations, admin alerts. |
| Google reCAPTCHA | Security | On contact form and review submission form. |
| Google Analytics | Analytics | Track page views, conversions, user behavior. |
| Image CDN | Performance | Cloudinary or similar for image storage, optimization, delivery. |

---

*End of Functional Requirements Specification*
