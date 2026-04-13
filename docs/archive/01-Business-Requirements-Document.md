# Business Requirements Document (BRD)

## Avir Trekkers - Trekking & Social Impact Website

---

| Field               | Details                                      |
|---------------------|----------------------------------------------|
| **Project Name**    | Avir Trekkers Web Platform                   |
| **Client**          | Avir Trekkers, Maharashtra, India            |
| **Document Version**| 1.0                                          |
| **Date**            | 2026-04-12                                   |
| **Status**          | Draft                                        |

---

## 1. Executive Summary

Avir Trekkers is a Maharashtra-based trekking group that organizes treks across Maharashtra's historic forts, mountains, and nature trails. Beyond adventure, they are deeply committed to social welfare — channeling trek revenues into charitable initiatives such as supporting village schools, providing bicycles to underprivileged students, and various community upliftment activities.

They require a **modern, dynamic website** that serves as both a **trek booking platform** and a **showcase for their social impact work**, along with a **comprehensive admin portal** for full content and operations management.

---

## 2. Business Objectives

### 2.1 Primary Objectives
- **Online Presence**: Establish a professional digital identity for Avir Trekkers
- **Trek Booking System**: Enable users to discover, book, and enroll in treks online
- **Social Impact Showcase**: Highlight charity work, school support, cycle donations, and community initiatives
- **Operational Efficiency**: Streamline trek management, participant tracking, and communications through an admin portal

### 2.2 Secondary Objectives
- Build community engagement and trust through reviews and testimonials
- Increase trek participation through easy online booking
- Drive awareness of social initiatives to attract donors and volunteers
- Provide seamless multi-channel communication (WhatsApp, Email, Phone, In-site)

---

## 3. Stakeholders

| Stakeholder          | Role                              | Interest                              |
|----------------------|-----------------------------------|---------------------------------------|
| Avir Trekkers Team   | Client / Admin                    | Manage treks, content, participants   |
| Trek Participants    | End Users                         | Browse, book, and enroll in treks     |
| Volunteers/Donors    | Secondary Users                   | Learn about social work, contribute   |
| Development Team     | Builders                          | Design, develop, deploy the platform  |

---

## 4. Scope

### 4.1 In Scope

#### A. Public-Facing Website
1. **Home Page / Hero Section** - Dynamic, admin-manageable hero banners and content
2. **About Us** - Organization story, mission, team
3. **Treks Section** - Browse upcoming/past treks with details
4. **Trek Booking & Enrollment** - Online booking with multi-participant enrollment
5. **Gallery** - Categorized image gallery (Treks, Social Activities)
6. **Social Impact / Charity Section** - Showcase charitable initiatives
7. **Reviews & Testimonials** - User reviews displayed on the website
8. **Contact Us** - WhatsApp, Email, Phone, and in-site contact form
9. **FAQ Section** - Common questions about treks and participation

#### B. Admin Portal
1. **Dashboard** - Overview of bookings, upcoming treks, recent inquiries
2. **Trek Management** - CRUD operations for treks (create, read, update, delete)
3. **Booking/Enrollment Management** - View, manage, export participant data
4. **Gallery Management** - Upload, categorize, delete images
5. **Content Management** - Edit hero section, about section, social impact content
6. **Review Management** - Approve, feature, or remove reviews
7. **Inquiry Management** - View and respond to contact form submissions
8. **User/Admin Management** - Manage admin access

### 4.2 Out of Scope (Phase 1)
- Online payment gateway integration (can be Phase 2)
- Mobile application
- Blog/Article CMS
- E-commerce / Merchandise store
- Multilingual support (Marathi, Hindi — can be Phase 2)
- Advanced analytics dashboard
- Push notifications

---

## 5. Target Audience

### 5.1 Primary Users
- **Adventure Enthusiasts** (Age 18-45) in Maharashtra looking for weekend treks
- **Groups & Families** wanting organized trekking experiences
- **Students & Youth** interested in adventure and social volunteering

### 5.2 Secondary Users
- **Donors & Sponsors** interested in supporting social causes
- **Schools & NGOs** wanting to collaborate
- **Media** looking for stories on social impact

---

## 6. Key Business Rules

| # | Rule | Description |
|---|------|-------------|
| BR-01 | Multi-Participant Enrollment | A single user can enroll multiple participants under one booking. Each participant's details (name, age, phone, emergency contact) must be captured individually. |
| BR-02 | Trek Capacity | Each trek has a maximum participant limit. Bookings should stop once capacity is reached. |
| BR-03 | Review Moderation | All reviews must be approved by admin before appearing on the public site. |
| BR-04 | Gallery Categorization | Gallery images must be organized into categories: Trek Photos, Social Activities, Events. |
| BR-05 | Dynamic Hero Section | Admin can update hero banners, text, and CTA buttons without developer intervention. |
| BR-06 | Contact Multi-Channel | Users should be able to reach Avir Trekkers via WhatsApp (click-to-chat), Email, Phone, and an in-site contact form. |
| BR-07 | Trek Status Management | Treks can be in states: Draft, Published, Fully Booked, Completed, Cancelled. |
| BR-08 | Participant Data Privacy | Participant personal data must be stored securely and accessible only to admins. |

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load time: Under 3 seconds on 4G networks
- Image optimization for gallery (lazy loading, WebP format)
- Support for 500+ concurrent users

### 7.2 Security
- HTTPS everywhere
- Admin authentication with secure password hashing
- CSRF and XSS protection
- Rate limiting on contact forms and booking APIs
- Data encryption at rest and in transit

### 7.3 Scalability
- Cloud-hosted with ability to scale horizontally
- CDN for static assets and images
- Database optimized for read-heavy workloads

### 7.4 Usability
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Intuitive navigation and booking flow
- Fast and clear error messaging

### 7.5 Availability
- 99.5% uptime SLA
- Automated backups (daily)
- Disaster recovery plan

### 7.6 SEO
- Server-side rendering for public pages
- Meta tags, Open Graph, structured data
- Sitemap and robots.txt
- Clean URL structure

---

## 8. Assumptions

1. Avir Trekkers will provide all initial content (text, images, trek details)
2. Payment processing is manual in Phase 1 (bank transfer / UPI details shared after booking)
3. Domain name and hosting will be procured by the client
4. WhatsApp integration uses the WhatsApp Business API or click-to-chat links
5. The admin portal is for internal use only (not public-facing)
6. English is the primary language for Phase 1

---

## 9. Constraints

1. Budget constraints may limit third-party integrations
2. Client team has limited technical expertise — admin portal must be very user-friendly
3. Image storage costs need to be managed (compression, CDN)
4. WhatsApp Business API may require business verification

---

## 10. Risks

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R-01 | Slow content delivery from client | Project delays | Set content deadlines with buffer |
| R-02 | High-resolution images slowing site | Poor UX | Implement auto-compression & CDN |
| R-03 | Spam on contact forms | Admin overhead | Implement CAPTCHA & rate limiting |
| R-04 | Data breach | Reputation damage | Follow security best practices, encryption |
| R-05 | Scope creep | Budget/timeline overrun | Strict change request process |

---

## 11. Success Criteria

1. Website is live and accessible on custom domain
2. Admin can independently manage treks, gallery, content, and reviews
3. Users can successfully book treks with multiple participants
4. Gallery loads smoothly with categorized sections
5. All contact channels (WhatsApp, Email, Phone, In-site form) are functional
6. Social impact section effectively showcases charity work
7. Site loads in under 3 seconds on mobile
8. Zero critical security vulnerabilities

---

## 12. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Client Representative | | | |
| Project Manager | | | |
| Technical Lead | | | |

---

*Document prepared for Avir Trekkers by the Development Team.*
