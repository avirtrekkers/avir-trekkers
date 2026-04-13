# User Stories & Use Cases

## Avir Trekkers Web Platform

---

## 1. User Personas

### Persona 1: Trek Enthusiast (Rahul, 28)
- **Background**: Software engineer from Pune, loves weekend treks
- **Goal**: Easily find and book treks for himself and friends
- **Pain Point**: Coordinating group bookings via phone/WhatsApp is tedious
- **Tech Comfort**: High

### Persona 2: Family Organizer (Priya, 35)
- **Background**: Teacher from Mumbai, plans family outings
- **Goal**: Book a safe, easy trek for her family of 4
- **Pain Point**: Needs to enter details for kids and husband under one booking
- **Tech Comfort**: Medium

### Persona 3: Social Impact Supporter (Amit, 45)
- **Background**: Business owner interested in CSR and charity
- **Goal**: Learn about Avir Trekkers' social work and possibly contribute
- **Pain Point**: Hard to find credible organizations doing ground-level work
- **Tech Comfort**: Medium

### Persona 4: Admin (Sanket, 30)
- **Background**: Core team member of Avir Trekkers
- **Goal**: Manage treks, participants, and content without technical knowledge
- **Pain Point**: Currently manages everything via spreadsheets and WhatsApp groups
- **Tech Comfort**: Medium

---

## 2. User Stories — Public Website

### Epic 1: Trek Discovery

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-001 | As a user, I want to see upcoming treks on the homepage so I can quickly find interesting treks. | - Homepage displays 3-4 featured upcoming treks with image, name, date, price. - Each card has a "Book Now" button. - Only published treks with future dates are shown. | HIGH |
| US-002 | As a user, I want to browse all available treks so I can choose one that fits my schedule and interest. | - Trek listing page shows all published treks in grid view. - Each card shows image, name, date, difficulty, price, available slots. - Treks are sorted by date (nearest first). | HIGH |
| US-003 | As a user, I want to filter treks by difficulty, type, and date so I can find treks that match my preferences. | - Filter bar with dropdowns: Difficulty (Easy/Moderate/Hard), Type (Fort/Nature/Night), Date range picker. - Results update instantly on filter change. - "Clear filters" option available. | MEDIUM |
| US-004 | As a user, I want to view detailed information about a trek so I can decide if I want to join. | - Detail page shows all trek info: description, itinerary, inclusions/exclusions, meeting point, difficulty, images. - Shows available slots count. - Has "Book Now" CTA. - Has share buttons. | HIGH |
| US-005 | As a user, I want to see if a trek is fully booked so I don't waste time trying to book. | - "Fully Booked" badge displayed on card and detail page. - "Book Now" button disabled with "Fully Booked" text. - "Few Slots Left" badge when <5 slots remain. | HIGH |

### Epic 2: Trek Booking & Multi-Participant Enrollment

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-010 | As a user, I want to book a trek for myself so I can secure my spot. | - Clicking "Book Now" opens booking form. - Form captures: Full Name, Email, Phone, Age, Gender, City. - Required field validation works. | HIGH |
| US-011 | As a user, I want to add multiple participants to my booking so I can book for my group/family in one go. | - "Add Participant" button adds a new participant section. - Each participant section has: Name, Age, Phone, Emergency Contact fields. - Participant count is displayed. - Can add as many as available slots allow. | HIGH |
| US-012 | As a user, I want to remove a participant from my booking if I made a mistake. | - Each added participant has a "Remove" (X) button. - Primary registrant cannot be removed. - Participant count updates on removal. | HIGH |
| US-013 | As a user, I want to see a booking summary before confirming so I can verify everything is correct. | - Summary step shows: Trek name/date, all participants with details, total cost calculation, registrant contact info. - "Edit" button to go back, "Confirm" to submit. | HIGH |
| US-014 | As a user, I want to receive a booking confirmation so I have proof of my enrollment. | - Success screen with booking reference number. - Confirmation email sent to registrant email. - Email contains: reference number, trek details, participant list, meeting point, important notes. | HIGH |
| US-015 | As a user, I want to be warned if I've already booked for the same trek so I don't double-book. | - Warning popup if same phone/email already has a booking for this trek. - User can still proceed if intended. | MEDIUM |

### Epic 3: Gallery

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-020 | As a user, I want to view trek photos so I can see what the experience looks like. | - Gallery page with responsive image grid. - Images are clear and load quickly (lazy loading). | HIGH |
| US-021 | As a user, I want to filter gallery by categories so I can see specific types of photos. | - Category tabs at top: All, Trek Photos, Social Activities, Events. - Clicking a tab filters images. - Active tab is visually highlighted. | HIGH |
| US-022 | As a user, I want to view images in full size so I can see details. | - Clicking image opens lightbox/modal. - Prev/Next navigation in lightbox. - Close button and ESC key to close. - Caption displayed if available. | HIGH |

### Epic 4: Social Impact

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-030 | As a visitor, I want to learn about Avir Trekkers' charity work so I can understand their social mission. | - Dedicated social impact page. - Initiative cards with title, description, images. - Impact counters with animation. | HIGH |
| US-031 | As a potential donor, I want to see concrete evidence of social work so I can trust the organization. | - Real photos from events. - Specific numbers (cycles donated, schools helped). - Timeline of activities. | HIGH |
| US-032 | As a visitor, I want to know how I can contribute so I can support the cause. | - "Want to Contribute?" section. - Contact details and WhatsApp link. | MEDIUM |

### Epic 5: Reviews

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-040 | As a past trekker, I want to submit a review so I can share my experience. | - Review form: Name, Rating (stars), Review text, Trek attended, Photo. - Form validation. - Success message after submission. | HIGH |
| US-041 | As a user, I want to read reviews from other trekkers so I can gauge the quality of treks. | - Reviews displayed with name, rating, text, date. - Featured reviews on homepage carousel. - Full reviews page with all approved reviews. | HIGH |

### Epic 6: Contact & Communication

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-050 | As a user, I want to contact Avir Trekkers via WhatsApp so I can get quick responses. | - Floating WhatsApp button on all pages. - Opens WhatsApp with pre-filled message. - WhatsApp number also displayed on contact page. | HIGH |
| US-051 | As a user, I want to send a message through the website so I can ask questions without leaving the site. | - Contact form with Name, Email, Phone, Subject, Message. - CAPTCHA to prevent spam. - Success message after submission. | HIGH |
| US-052 | As a user, I want to see phone and email so I can contact them directly. | - Clickable phone number (tel:) and email (mailto:). - Visible on contact page and footer. | HIGH |

---

## 3. User Stories — Admin Portal

### Epic 7: Admin Authentication

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-060 | As an admin, I want to log in securely so only authorized people can access the admin portal. | - Login page with email + password. - Invalid credentials show error. - Redirect to dashboard on success. - Session expires after inactivity. | HIGH |
| US-061 | As an admin, I want to reset my password if I forget it. | - "Forgot Password" link on login. - Email with reset link/OTP sent. - Password reset form with confirmation. | HIGH |

### Epic 8: Trek Management

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-070 | As an admin, I want to create a new trek so trekkers can discover and book it. | - Trek creation form with all fields. - Rich text editor for description. - Image upload for cover and gallery. - Save as Draft or Publish. | HIGH |
| US-071 | As an admin, I want to edit an existing trek so I can update details like date or price. | - All fields editable. - Changes reflect on public site after save. - Edit history tracked (optional). | HIGH |
| US-072 | As an admin, I want to view all treks in a table so I can manage them efficiently. | - Table with columns: Name, Date, Status, Bookings, Slots, Actions. - Sortable by date, name. - Searchable. - Pagination. | HIGH |
| US-073 | As an admin, I want to duplicate a trek so I can quickly create recurring treks. | - "Duplicate" button creates a copy in Draft status. - All fields copied except date (left blank). | MEDIUM |
| US-074 | As an admin, I want to cancel a trek so participants are informed. | - Cancel button with confirmation dialog. - Option to send cancellation email to all booked participants. - Trek status changes to "Cancelled". | HIGH |

### Epic 9: Booking Management

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-080 | As an admin, I want to view all bookings for a trek so I can see who is coming. | - Booking list filtered by trek. - Shows: Booking ID, Registrant, Participants count, Date, Status. | HIGH |
| US-081 | As an admin, I want to view booking details including all participants. | - Detail view shows registrant info and all participant details. | HIGH |
| US-082 | As an admin, I want to export participant data as Excel so I can print attendance sheets. | - "Export" button generates .xlsx file. - Columns: Name, Age, Phone, Emergency Contact, Trek, Date. - Filter by specific trek before export. | HIGH |
| US-083 | As an admin, I want to update booking status so I can track attendance. | - Status dropdown: Confirmed, Cancelled, Attended. - Bulk status update option. | MEDIUM |

### Epic 10: Gallery Management

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-090 | As an admin, I want to upload trek and event photos to the gallery. | - Drag-and-drop upload area. - Bulk upload support. - Auto-compression on upload. - Assign to category during upload. | HIGH |
| US-091 | As an admin, I want to manage gallery categories so photos are organized. | - Create, rename, delete categories. - Cannot delete category with images (must reassign first). | HIGH |
| US-092 | As an admin, I want to delete images from the gallery. | - Single and bulk delete with confirmation. - Deleted from storage (Cloudinary) as well. | HIGH |

### Epic 11: Content Management

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-100 | As an admin, I want to update the hero section so the homepage looks fresh. | - Edit hero images, headline, subtitle, CTA. - Support multiple hero slides. - Drag-and-drop reorder. - Preview before publishing. | HIGH |
| US-101 | As an admin, I want to update the About Us page content. | - Rich text editor with formatting. - Image upload within content. | HIGH |
| US-102 | As an admin, I want to manage social impact initiatives. | - CRUD for initiatives: title, description, images, metrics. - Reorder initiatives. | HIGH |
| US-103 | As an admin, I want to update homepage stat numbers. | - Simple form with number inputs for each stat. | MEDIUM |

### Epic 12: Review & Inquiry Management

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-110 | As an admin, I want to moderate reviews so only appropriate ones appear on the site. | - Pending reviews queue. - Approve/Reject buttons. - Preview review before approval. | HIGH |
| US-111 | As an admin, I want to feature specific reviews on the homepage. | - "Feature" toggle on approved reviews. - Featured reviews appear in homepage carousel. | MEDIUM |
| US-112 | As an admin, I want to view and manage contact inquiries. | - Inquiry list with read/unread status. - View full message. - Reply via email from admin panel. | HIGH |

---

## 4. Use Case Diagrams

### Use Case: Multi-Participant Trek Booking

```
Actor: Trek User

Preconditions:
  - Trek is published and has available slots

Main Flow:
  1. User browses trek listing page
  2. User clicks on a trek card
  3. System displays trek detail page
  4. User clicks "Book Now"
  5. System shows booking form (Step 1: Primary Registrant)
  6. User fills in personal details (name, email, phone, age)
  7. User clicks "Add Participant" (optional, repeatable)
  8. System adds a new participant section
  9. User fills in participant details (name, age, phone, emergency contact)
  10. User repeats steps 7-9 for additional participants
  11. User clicks "Continue to Summary"
  12. System validates all fields and checks slot availability
  13. System displays booking summary (trek, all participants, total cost)
  14. User reviews summary and clicks "Confirm Booking"
  15. System creates booking record with all participants
  16. System decrements available slots by total participant count
  17. System sends confirmation email to registrant
  18. System displays success screen with booking reference number

Alternative Flows:
  A1. Validation Error (Step 12):
      - System highlights invalid fields with error messages
      - User corrects and resubmits

  A2. Insufficient Slots (Step 12):
      - System shows error: "Only X slots available, you have Y participants"
      - User removes participants to fit available slots

  A3. Duplicate Booking Warning (Step 12):
      - System detects same email/phone already booked for this trek
      - Shows warning: "You may already have a booking for this trek"
      - User can proceed or cancel

  A4. Remove Participant (Step 7-9):
      - User clicks "Remove" on a participant
      - System removes participant section and updates count

Postconditions:
  - Booking record created in database
  - Available slots decremented
  - Confirmation email sent
  - Booking appears in admin panel
```

### Use Case: Admin Export Participants as Excel

```
Actor: Admin User

Preconditions:
  - Admin is logged in
  - Bookings exist in the system

Main Flow:
  1. Admin navigates to Bookings page
  2. Admin selects a trek from the filter dropdown (optional)
  3. Admin clicks "Export as Excel" button
  4. System generates .xlsx file with columns:
     - Participant Name, Age, Phone, Emergency Contact Name,
       Emergency Contact Phone, Trek Name, Booking Date, Status
  5. Browser downloads the Excel file

Alternative Flows:
  A1. No bookings match filter:
      - System shows message: "No bookings found for selected filters"
      - Export button is disabled
```

---

*End of User Stories & Use Cases*
