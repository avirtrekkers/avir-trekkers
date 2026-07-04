# Avir Trekkers API

Express + MongoDB backend for the Avir Trekkers platform (user site + admin portal).

## Setup

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev            # nodemon, defaults to port 4001
```

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (generate with `openssl rand -base64 32`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Transactional email (OTP, confirmations) |
| `CONTACT_SMTP_USER` / `CONTACT_SMTP_PASS` | Contact-form mailbox |
| `PORT` | Server port (default 4000) |
| `NODE_ENV` | `dev`, `staging`, or `production` |

The server exits at startup if any of the first five are missing.

## Image uploads (Cloudinary)

All images are stored in Cloudinary under the `avir-trekkers/` folder. The
admin portal uploads through the API — credentials never reach the browser.

- `POST /api/media/images` (admin JWT, multipart) — field `images` (max 10 files,
  5MB each, JPEG/PNG/WebP/GIF/AVIF with magic-number validation), field
  `folder` (one of `treks`, `gallery`, `social`, `hero`, `team`, `misc`).
  Returns optimized `f_auto,q_auto` delivery URLs plus public IDs.
  Duplicate files are deduplicated by content hash.
- `DELETE /api/media/images` (admin JWT) — body `{ "publicId": "avir-trekkers/..." }`.
  Only assets inside the app namespace can be deleted.

Deleting treks/gallery items/hero slides/team members automatically removes
their Cloudinary assets when no other record references them.

## Route map

| Mount | Purpose |
| --- | --- |
| `/api/auth` | Admin login, password change/reset |
| `/api/treks` | Trek CRUD + public listing |
| `/api/enrollments` | OTP-verified trek enrollment |
| `/api/categories` | Trek categories |
| `/api/reviews` | Public reviews + moderation |
| `/api/gallery` | Trek gallery, gallery treks, social activities |
| `/api/site` | Hero slides, team, stats, settings |
| `/api/contact` | Contact form + inquiry management |
| `/api/media` | Cloudinary image upload/delete |
| `/health` | Health check |

## Scripts

- `npm start` — production start
- `npm run dev` — nodemon
- `npm test` — jest (see `tests/`)
- `npm run seed` — seed the database (`seed.js`)
- `npm run lint` — eslint
