# Database Schema Design

## Avir Trekkers Web Platform

---

## 1. Entity Relationship Overview

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Admin   │     │   Trek   │────▶│   Booking    │
│  User    │     │          │     │              │
└──────────┘     └────┬─────┘     └──────┬───────┘
                      │                   │
                      │                   ▼
                 ┌────┴─────┐     ┌──────────────┐
                 │  Trek    │     │ Participant  │
                 │  Image   │     │              │
                 └──────────┘     └──────────────┘

┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Gallery │     │  Gallery │     │   Review     │
│ Category │────▶│  Image   │     │              │
└──────────┘     └──────────┘     └──────────────┘

┌──────────┐     ┌──────────┐     ┌──────────────┐
│ Hero     │     │  Social  │     │   Inquiry    │
│ Slide    │     │ Initiative│     │  (Contact)   │
└──────────┘     └──────────┘     └──────────────┘

┌──────────┐     ┌──────────┐
│  Site    │     │ Activity │
│ Settings │     │   Log    │
└──────────┘     └──────────┘
```

---

## 2. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ADMIN & AUTH
// ============================================

model AdminUser {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String    // bcrypt hashed
  name          String
  role          AdminRole @default(ADMIN)
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  activityLogs  ActivityLog[]

  @@map("admin_users")
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
  MODERATOR
}

// ============================================
// TREKS
// ============================================

model Trek {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String      @db.Text    // Rich text HTML
  coverImage      String      // Cloudinary URL
  date            DateTime
  meetingPoint    String
  meetingTime     String
  difficulty      Difficulty
  trekType        TrekType
  distance        String      // e.g., "14 km"
  duration        String      // e.g., "6 hours"
  pricePerPerson  Int         // in INR (paise-free, whole rupees)
  maxParticipants Int
  inclusions      String[]    // Array of inclusion items
  exclusions      String[]    // Array of exclusion items
  itinerary       Json        // Array of { time, activity }
  importantNotes  String?     @db.Text
  status          TrekStatus  @default(DRAFT)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  images          TrekImage[]
  bookings        Booking[]

  @@index([status, date])
  @@index([slug])
  @@map("treks")
}

enum Difficulty {
  EASY
  MODERATE
  HARD
}

enum TrekType {
  FORT
  NATURE
  NIGHT
  MONSOON
  WATERFALL
  CAMPING
}

enum TrekStatus {
  DRAFT
  PUBLISHED
  FULLY_BOOKED
  COMPLETED
  CANCELLED
}

model TrekImage {
  id        String   @id @default(cuid())
  url       String   // Cloudinary URL
  caption   String?
  sortOrder Int      @default(0)
  trekId    String
  createdAt DateTime @default(now())

  trek      Trek     @relation(fields: [trekId], references: [id], onDelete: Cascade)

  @@index([trekId])
  @@map("trek_images")
}

// ============================================
// BOOKINGS & PARTICIPANTS
// ============================================

model Booking {
  id              String        @id @default(cuid())
  referenceNumber String        @unique   // e.g., "AVT-2026-00142"
  trekId          String
  status          BookingStatus @default(CONFIRMED)

  // Primary registrant details
  registrantName  String
  registrantEmail String
  registrantPhone String
  registrantAge   Int
  registrantGender String?
  registrantCity  String?

  totalParticipants Int
  totalAmount       Int         // pricePerPerson × totalParticipants

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  trek            Trek          @relation(fields: [trekId], references: [id])
  participants    Participant[]

  @@index([trekId])
  @@index([referenceNumber])
  @@index([registrantEmail])
  @@index([registrantPhone])
  @@map("bookings")
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  ATTENDED
}

model Participant {
  id                  String   @id @default(cuid())
  bookingId           String
  name                String
  age                 Int
  phone               String
  emergencyContactName  String
  emergencyContactPhone String
  isPrimary           Boolean  @default(false) // true for registrant
  createdAt           DateTime @default(now())

  booking             Booking  @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([bookingId])
  @@map("participants")
}

// ============================================
// GALLERY
// ============================================

model GalleryCategory {
  id        String         @id @default(cuid())
  name      String         @unique
  slug      String         @unique
  sortOrder Int            @default(0)
  createdAt DateTime       @default(now())

  images    GalleryImage[]

  @@map("gallery_categories")
}

model GalleryImage {
  id          String   @id @default(cuid())
  url         String   // Cloudinary URL
  thumbnailUrl String? // Cloudinary transformed thumbnail
  caption     String?
  altText     String?
  categoryId  String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  category    GalleryCategory @relation(fields: [categoryId], references: [id])

  @@index([categoryId])
  @@map("gallery_images")
}

// ============================================
// REVIEWS
// ============================================

model Review {
  id          String       @id @default(cuid())
  name        String
  rating      Int          // 1-5
  text        String       @db.Text
  trekName    String?      // Which trek they attended
  photoUrl    String?      // Optional photo
  status      ReviewStatus @default(PENDING)
  isFeatured  Boolean      @default(false)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([status])
  @@map("reviews")
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

// ============================================
// CONTACT INQUIRIES
// ============================================

model Inquiry {
  id        String        @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String        @db.Text
  isRead    Boolean       @default(false)
  repliedAt DateTime?
  createdAt DateTime      @default(now())

  @@index([isRead])
  @@map("inquiries")
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

model HeroSlide {
  id          String   @id @default(cuid())
  imageUrl    String   // Cloudinary URL
  headline    String
  subtitle    String?
  ctaText     String?  // e.g., "Explore Treks"
  ctaLink     String?  // e.g., "/treks"
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("hero_slides")
}

model SocialInitiative {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  images      String[] // Array of Cloudinary URLs
  metrics     Json?    // e.g., { "cyclesDonated": 50, "studentsHelped": 100 }
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("social_initiatives")
}

model SiteSettings {
  id    String @id @default(cuid())
  key   String @unique
  value Json   // Flexible value storage

  // Example keys:
  // "stats" → { trekkersCount: 500, treksCount: 50, schoolsHelped: 20, cyclesDonated: 100 }
  // "about" → { content: "<h1>About Us...</h1>" }
  // "contact" → { phone: "+91XXX", email: "...", whatsapp: "+91XXX" }
  // "footer" → { tagline: "...", socialLinks: { fb: "...", ig: "...", yt: "..." } }

  @@map("site_settings")
}

model TeamMember {
  id        String   @id @default(cuid())
  name      String
  role      String
  bio       String?  @db.Text
  photoUrl  String?
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  @@map("team_members")
}

model FAQ {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("faqs")
}

// ============================================
// ACTIVITY LOG (Audit Trail)
// ============================================

model ActivityLog {
  id          String   @id @default(cuid())
  adminUserId String
  action      String   // e.g., "CREATED_TREK", "APPROVED_REVIEW"
  entity      String   // e.g., "trek", "booking", "review"
  entityId    String   // ID of the affected entity
  details     Json?    // Additional context
  createdAt   DateTime @default(now())

  adminUser   AdminUser @relation(fields: [adminUserId], references: [id])

  @@index([adminUserId])
  @@index([createdAt])
  @@map("activity_logs")
}
```

---

## 3. Key Indexes & Performance Notes

| Table | Index | Purpose |
|-------|-------|---------|
| treks | `(status, date)` | Fast filtering of published upcoming treks |
| treks | `(slug)` | Fast lookup by URL slug |
| bookings | `(trekId)` | Fast participant count per trek |
| bookings | `(referenceNumber)` | Booking lookup by reference |
| bookings | `(registrantEmail)` | Duplicate booking check |
| participants | `(bookingId)` | Fast participant retrieval |
| gallery_images | `(categoryId)` | Category filtering |
| reviews | `(status)` | Pending review queue |
| inquiries | `(isRead)` | Unread inquiry count |
| activity_logs | `(createdAt)` | Recent activity feed |

---

## 4. Reference Number Generation

```
Format: AVT-{YEAR}-{SEQUENTIAL_5_DIGIT}
Example: AVT-2026-00142

Logic:
1. Query max reference number for current year
2. Increment by 1
3. Pad with zeros to 5 digits
4. Prefix with "AVT-{YEAR}-"
```

---

## 5. Available Slots Calculation

```sql
-- Available slots for a trek
SELECT
  t.max_participants - COALESCE(SUM(b.total_participants), 0) AS available_slots
FROM treks t
LEFT JOIN bookings b ON b.trek_id = t.id AND b.status != 'CANCELLED'
WHERE t.id = 'trek_id_here'
GROUP BY t.id;
```

---

## 6. Default Gallery Categories (Seed Data)

| Category | Slug | Sort Order |
|----------|------|------------|
| Trek Photos | trek-photos | 1 |
| Social Activities | social-activities | 2 |
| Events | events | 3 |
| Team | team | 4 |

---

## 7. Default Site Settings (Seed Data)

```json
{
  "stats": {
    "trekkersCount": 500,
    "treksCount": 50,
    "schoolsHelped": 20,
    "cyclesDonated": 100
  },
  "contact": {
    "phone": "+91XXXXXXXXXX",
    "email": "contact@avirtrekkers.com",
    "whatsapp": "+91XXXXXXXXXX",
    "whatsappMessage": "Hi Avir Trekkers! I would like to know more about your upcoming treks."
  },
  "footer": {
    "tagline": "Trek. Explore. Give Back.",
    "socialLinks": {
      "facebook": "https://facebook.com/avirtrekkers",
      "instagram": "https://instagram.com/avirtrekkers",
      "youtube": "https://youtube.com/avirtrekkers"
    }
  }
}
```

---

*End of Database Schema Design*
