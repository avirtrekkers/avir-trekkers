# Wireframe & Page Specifications

## Avir Trekkers Web Platform

---

## 1. Site Map

```
avirtrekkers.com/
├── / (Home)
├── /treks
│   └── /treks/[slug] (Trek Detail)
├── /book/[trekSlug] (Booking Form)
├── /gallery
├── /about
├── /social-impact
├── /reviews
├── /contact
├── /faq
│
└── /admin (Protected)
    ├── /admin (Dashboard)
    ├── /admin/treks
    │   ├── /admin/treks/new
    │   └── /admin/treks/[id]/edit
    ├── /admin/bookings
    │   └── /admin/bookings/[id]
    ├── /admin/gallery
    ├── /admin/reviews
    ├── /admin/inquiries
    ├── /admin/content
    └── /admin/settings
```

---

## 2. Public Pages — Layout Specifications

---

### 2.1 Global Navigation Bar

```
┌────────────────────────────────────────────────────────────────┐
│ [LOGO] Avir Trekkers    Home | Treks | Gallery | About |      │
│                         Social Impact | Contact    [WhatsApp]  │
└────────────────────────────────────────────────────────────────┘
```
- **Position**: Sticky top
- **Logo**: Left-aligned with brand name
- **Nav Links**: Center-aligned (desktop), Hamburger menu (mobile)
- **WhatsApp CTA**: Right-aligned button (desktop), in menu (mobile)
- **Background**: White with subtle shadow on scroll
- **Mobile**: Hamburger menu, full-screen overlay

---

### 2.2 Home Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│                     HERO SECTION (Full-width)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [Background Image - Slider]                             │  │
│  │                                                          │  │
│  │  "Explore Maharashtra's Majestic Forts"                  │  │
│  │  "Join us for unforgettable trekking experiences"        │  │
│  │                                                          │  │
│  │  [ Explore Treks → ]     ← CTA Button                   │  │
│  │                                                          │  │
│  │  ● ○ ○ ○                 ← Slide indicators              │  │
│  └──────────────────────────────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────┤
│                  UPCOMING TREKS SECTION                        │
│  "Upcoming Adventures"                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ [Image]  │  │ [Image]  │  │ [Image]  │  │ [Image]  │      │
│  │ Fort A   │  │ Fort B   │  │ Night    │  │ Monsoon  │      │
│  │ ₹800     │  │ ₹1200    │  │ ₹600     │  │ ₹900     │      │
│  │ May 15   │  │ May 22   │  │ Jun 1    │  │ Jun 15   │      │
│  │ 8 slots  │  │ FULL     │  │ 15 slots │  │ 20 slots │      │
│  │[Book Now]│  │[Booked]  │  │[Book Now]│  │[Book Now]│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                        [ View All Treks → ]                    │
├────────────────────────────────────────────────────────────────┤
│                    STATS SECTION                               │
│       ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐               │
│       │ 500+│    │  50+│    │  20+│    │ 100+│               │
│       │Trek-│    │Treks│    │Schoo│    │Cycle│               │
│       │kers │    │Done │    │ls   │    │s    │               │
│       └─────┘    └─────┘    └─────┘    └─────┘               │
├────────────────────────────────────────────────────────────────┤
│              SOCIAL IMPACT HIGHLIGHT                           │
│  ┌─────────────────────┬──────────────────────────────────┐   │
│  │  [Image: Students   │  "Making a Difference"           │   │
│  │   with cycles]      │                                   │   │
│  │                     │  We channel our passion for       │   │
│  │                     │  trekking into meaningful social  │   │
│  │                     │  impact across Maharashtra...     │   │
│  │                     │                                   │   │
│  │                     │  [ Learn More → ]                 │   │
│  └─────────────────────┴──────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│                  REVIEWS CAROUSEL                              │
│  "What Our Trekkers Say"                                       │
│  ◀ ┌─────────────────────────────────────────────────┐ ▶      │
│    │  ★★★★★                                         │         │
│    │  "Best trekking group in Maharashtra! Well..."  │         │
│    │  — Rahul P.  |  Rajgad Fort Trek               │         │
│    └─────────────────────────────────────────────────┘         │
│    ○ ● ○ ○ ○                                                   │
├────────────────────────────────────────────────────────────────┤
│                      FOOTER                                    │
│  ┌─────────────┬──────────────┬──────────────┬────────────┐   │
│  │ Avir        │ Quick Links  │ Contact      │ Follow Us  │   │
│  │ Trekkers    │ Home         │ +91 XXXXX    │ [FB] [IG]  │   │
│  │ logo        │ Treks        │ email@...    │ [YT] [WA]  │   │
│  │             │ Gallery      │ Maharashtra  │            │   │
│  │ Trek.       │ About        │ India        │            │   │
│  │ Explore.    │ Contact      │              │            │   │
│  │ Give Back.  │              │              │            │   │
│  └─────────────┴──────────────┴──────────────┴────────────┘   │
│  © 2026 Avir Trekkers. All rights reserved.                    │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Trek Detail Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Home > Treks > Rajgad Fort Trek                    │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              [IMAGE GALLERY / CAROUSEL]                   │  │
│  │                                                           │  │
│  │    ◀    [Hero Image of the Trek]    ▶                     │  │
│  │                                                           │  │
│  │    [thumb1] [thumb2] [thumb3] [thumb4]                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────┬────────────────────────────┐  │
│  │  TREK INFO                  │  BOOKING CARD              │  │
│  │                             │  ┌────────────────────────┐│  │
│  │  # Rajgad Fort Trek         │  │ ₹800 / person         ││  │
│  │  [★ Easy] [🏰 Fort Trek]    │  │                        ││  │
│  │                             │  │ Date: May 15, 2026     ││  │
│  │  Description text here...   │  │ Slots: 8 available     ││  │
│  │  Long rich text content     │  │                        ││  │
│  │  about the trek...          │  │ [ Book Now → ]         ││  │
│  │                             │  │                        ││  │
│  │  📍 Meeting Point           │  │ Share:                 ││  │
│  │  Swargate Bus Stand, 6 AM   │  │ [WA] [FB] [Copy]      ││  │
│  │                             │  └────────────────────────┘│  │
│  │  📏 Distance: 14 km         │                            │  │
│  │  ⏱️ Duration: 6 hours       │                            │  │
│  │                             │                            │  │
│  │  ITINERARY                  │                            │  │
│  │  ● 6:00 AM - Assembly       │                            │  │
│  │  ● 6:30 AM - Departure      │                            │  │
│  │  ● 8:00 AM - Base Village   │                            │  │
│  │  ● 10:00 AM - Summit        │                            │  │
│  │  ● 12:00 PM - Lunch         │                            │  │
│  │  ● 3:00 PM - Return         │                            │  │
│  │                             │                            │  │
│  │  INCLUSIONS ✅               │                            │  │
│  │  • Transportation            │                            │  │
│  │  • Breakfast & Lunch         │                            │  │
│  │  • Expert Guide              │                            │  │
│  │                             │                            │  │
│  │  EXCLUSIONS ❌               │                            │  │
│  │  • Personal expenses         │                            │  │
│  │  • Travel insurance          │                            │  │
│  └─────────────────────────────┴────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.4 Booking Form Layout (Multi-Step)

```
STEP INDICATOR:  [1. Your Details] → [2. Participants] → [3. Summary]

STEP 1: PRIMARY REGISTRANT
┌────────────────────────────────────────────────────────────────┐
│  "Book: Rajgad Fort Trek - May 15, 2026"                       │
│                                                                │
│  Your Details                                                  │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │ Full Name *           │  │ Email *               │          │
│  └───────────────────────┘  └───────────────────────┘          │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │ Phone Number *        │  │ Age *                 │          │
│  └───────────────────────┘  └───────────────────────┘          │
│  ┌───────────────────────┐  ┌───────────────────────┐          │
│  │ Gender (dropdown)     │  │ City                  │          │
│  └───────────────────────┘  └───────────────────────┘          │
│                                                                │
│                                       [ Next: Add Participants ]│
└────────────────────────────────────────────────────────────────┘

STEP 2: PARTICIPANTS
┌────────────────────────────────────────────────────────────────┐
│  Participants (1 registered)          Slots available: 7       │
│                                                                │
│  Participant 1 (You):                                          │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Rahul Patil  |  Age: 28  |  Ph: 98XXXXXX           │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                │
│  ┌─ Participant 2 ──────────────────────────────── [✕ Remove]─┐│
│  │  ┌──────────────┐  ┌─────┐  ┌──────────────┐              ││
│  │  │ Full Name *  │  │Age *│  │ Phone *       │              ││
│  │  └──────────────┘  └─────┘  └──────────────┘              ││
│  │  ┌──────────────────────┐  ┌──────────────────────┐       ││
│  │  │ Emergency Contact *  │  │ Emergency Phone *    │       ││
│  │  └──────────────────────┘  └──────────────────────┘       ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  [ + Add Another Participant ]                                 │
│                                                                │
│  Total Participants: 2                                         │
│                                                                │
│  [ ← Back ]                              [ Next: Summary → ]  │
└────────────────────────────────────────────────────────────────┘

STEP 3: BOOKING SUMMARY
┌────────────────────────────────────────────────────────────────┐
│  Booking Summary                                               │
│                                                                │
│  Trek: Rajgad Fort Trek                                        │
│  Date: May 15, 2026                                            │
│  Meeting Point: Swargate Bus Stand, 6:00 AM                    │
│                                                                │
│  Participants:                                                 │
│  ┌────┬────────────────┬─────┬────────────┬───────────────┐    │
│  │ #  │ Name           │ Age │ Phone      │ Emergency     │    │
│  ├────┼────────────────┼─────┼────────────┼───────────────┤    │
│  │ 1  │ Rahul Patil    │ 28  │ 98XXXXXXXX │ Priya (wife)  │    │
│  │ 2  │ Amit Sharma    │ 30  │ 97XXXXXXXX │ Father        │    │
│  └────┴────────────────┴─────┴────────────┴───────────────┘    │
│                                                                │
│  Total Cost: 2 × ₹800 = ₹1,600                                │
│                                                                │
│  ☐ I accept the Terms & Conditions                             │
│                                                                │
│  [ ← Back ]                         [ ✓ Confirm Booking ]     │
└────────────────────────────────────────────────────────────────┘

STEP 4: CONFIRMATION
┌────────────────────────────────────────────────────────────────┐
│                        ✅                                       │
│           Booking Confirmed!                                   │
│                                                                │
│  Reference: AVT-2026-00142                                     │
│                                                                │
│  A confirmation email has been sent to                         │
│  rahul@email.com with all the details.                         │
│                                                                │
│  Trek: Rajgad Fort Trek                                        │
│  Date: May 15, 2026                                            │
│  Participants: 2                                               │
│                                                                │
│  Important: Please save your reference number.                 │
│  Payment details will be shared via email/WhatsApp.            │
│                                                                │
│  [ View Trek Details ]    [ WhatsApp Us ]    [ Back to Home ]  │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.5 Gallery Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  # Our Gallery                                                 │
│                                                                │
│  [ All ] [ Trek Photos ] [ Social Activities ] [ Events ]      │
│           ^^^^^^^^^^^^                                         │
│           Active tab                                           │
│                                                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │      │  │      │  │      │  │      │                      │
│  │ IMG  │  │ IMG  │  │ IMG  │  │ IMG  │                      │
│  │      │  │      │  │      │  │      │                      │
│  └──────┘  └──────┘  └──────┘  └──────┘                      │
│  ┌──────┐  ┌──────────────┐  ┌──────┐                         │
│  │      │  │              │  │      │                         │
│  │ IMG  │  │   TALL IMG   │  │ IMG  │                         │
│  │      │  │              │  │      │                         │
│  └──────┘  │              │  └──────┘                         │
│  ┌──────┐  └──────────────┘  ┌──────┐                         │
│  │      │  ┌──────┐  ┌──────┐│      │                         │
│  │ IMG  │  │ IMG  │  │ IMG  ││ IMG  │                         │
│  │      │  │      │  │      ││      │                         │
│  └──────┘  └──────┘  └──────┘└──────┘                         │
│                                                                │
│                    [ Load More ]                                │
└────────────────────────────────────────────────────────────────┘
```

---

### 2.6 Admin Dashboard Layout

```
┌──────────┬─────────────────────────────────────────────────────┐
│ SIDEBAR  │  MAIN CONTENT                                       │
│          │                                                     │
│ [Logo]   │  Dashboard                          [Admin Name ▼]  │
│          │                                                     │
│ Dashboard│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ Treks    │  │  12  │ │   3  │ │   5  │ │   2  │              │
│ Bookings │  │Booki-│ │Upcom-│ │Pendi-│ │Unread│              │
│ Gallery  │  │ngs   │ │ing   │ │ng    │ │Inqui-│              │
│ Reviews  │  │this  │ │Treks │ │Revie-│ │ries  │              │
│ Inquiries│  │month │ │      │ │ws    │ │      │              │
│ Content  │  └──────┘ └──────┘ └──────┘ └──────┘              │
│ Settings │                                                     │
│          │  Quick Actions                                      │
│ ─────    │  [+ New Trek] [Reviews Queue] [View Inquiries]      │
│ Logout   │                                                     │
│          │  Recent Bookings                                    │
│          │  ┌──────────────────────────────────────────────┐   │
│          │  │ ID    │ Name   │ Trek    │ Pax │ Date       │   │
│          │  │ 142   │ Rahul  │ Rajgad  │  2  │ Apr 12     │   │
│          │  │ 141   │ Priya  │ Torna   │  4  │ Apr 11     │   │
│          │  │ 140   │ Amit   │ Rajgad  │  1  │ Apr 10     │   │
│          │  └──────────────────────────────────────────────┘   │
│          │                                                     │
│          │  Recent Inquiries                                   │
│          │  ┌──────────────────────────────────────────────┐   │
│          │  │ ● Suresh - Trek query...        Apr 12      │   │
│          │  │ ○ Meera - School collab...      Apr 11      │   │
│          │  └──────────────────────────────────────────────┘   │
└──────────┴─────────────────────────────────────────────────────┘
```

---

## 3. Color Palette & Design Direction

| Element | Suggestion |
|---------|-----------|
| **Primary Color** | Forest Green (#2D6A4F) — Nature, trekking |
| **Secondary Color** | Earthy Orange (#E76F51) — Energy, adventure |
| **Accent** | Golden Yellow (#F4A261) — Warmth, community |
| **Background** | Off-white (#FAFAF8) |
| **Text** | Dark charcoal (#2D3436) |
| **Admin Primary** | Slate Blue (#3B82F6) |
| **Typography** | Inter (headings) + Lato (body) or similar clean sans-serif |

---

## 4. Responsive Breakpoints

| Breakpoint | Device | Width |
|------------|--------|-------|
| sm | Mobile | 640px |
| md | Tablet | 768px |
| lg | Desktop | 1024px |
| xl | Large Desktop | 1280px |

---

*End of Wireframe Specifications*
