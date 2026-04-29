# Auto Service Landing — Project Context for Claude Code

## Project Overview
Showcase/portfolio landing page for an auto service business.
Goal: demonstrate to potential clients how a modern tech stack solves real business problems
(lost bookings, poor client communication).
This app is one of several portfolio examples (massage, beauty salon, pizza, elderly care).

## Tech Stack
- **Framework**: Next.js 16.2.3 (App Router, Turbopack) + TypeScript
- **React**: 19.2.4
- **Styling**: Tailwind CSS v4 (CSS-first config — no tailwind.config.js)
- **UI Components**: HeroUI v3 — use HeroUI components first (Calendar, Modal, Input, Button, Table, Card etc.) before building custom ones. Docs: https://heroui.com/docs
- **Animations**: Framer Motion v12
- **Database**: PostgreSQL via Neon (Vercel-native integration)
- **ORM**: Prisma
- **Auth**: NextAuth.js (admin panel only, login/password)
- **Notifications**: Nodemailer (email) + Telegram Bot API
- **i18n**: next-intl (DE primary, RU, EN)
- **Deployment**: Vercel + Neon

## Local Development
- Project runs in Docker (dev stage) or directly via `npm run dev --turbo`
- Dockerfile has 3 stages: `dev` (hot reload) / `builder` / `prod` (standalone)
- **No local PostgreSQL** — use Neon DATABASE_URL via `.env.local` even in dev
- Uncomment `env_file: .env` in docker-compose.yml when secrets are ready
- WATCHPACK_POLLING=true is set for Windows hot reload in Docker

## Packages Still to Install
```bash
npm install prisma @prisma/client next-auth nodemailer next-intl
npm install @types/nodemailer -D
npx prisma init
```

## Core Business Logic

### Booking Flow (Client)
1. Client clicks "Записаться на сервис" / "Termin buchen" on Hero section
2. Calendar opens showing available dates for next 10 days
3. Booked dates are marked as unavailable (fetched from DB)
4. Client selects available date → booking form opens
5. Form fields: Vorname, Nachname, E-Mail, Telefon
6. "Zurücksetzen" (reset) and "Absenden" (submit) buttons
7. Submit button activates only when all fields are filled
8. On submit:
   - Booking saved to DB with status "NEU"
   - Selected date marked as booked in calendar
   - Auto service receives notification (email + Telegram)
   - Client receives confirmation (email + Telegram if phone provided)

### Admin Panel (/admin)
- Protected by NextAuth (login/password)
- Views: table view + calendar view of all bookings
- Booking statuses: NEU → IN ARBEIT → FERTIG
- Status change triggers no notification automatically
- "Fertigmeldung senden" button: sends completion notification to client
  (email + Telegram) with car ready message and repair cost field
- Repair cost input field per booking

### Notifications
- **Email**: via Nodemailer (SMTP)
- **Telegram**: via Telegram Bot API
- Both channels used simultaneously
- Templates in all 3 languages based on client's locale

## Database Schema (Prisma)
```prisma
model Booking {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String
  phone       String
  date        DateTime
  status      Status   @default(NEU)
  repairCost  Float?
  locale      String   @default("de")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Status {
  NEU
  IN_ARBEIT
  FERTIG
}

model AdminUser {
  id       String @id @default(cuid())
  email    String @unique
  password String // bcrypt hashed
}
```

## Page Structure

### Landing Page (/)
1. **Header** — logo, phone number (always visible), nav, language switcher (DE/RU/EN)
2. **Hero Section** — background photo of workshop, headline, subheadline, CTA button "Termin buchen"
3. **Trust Bar** — partner logos: TÜV Süd, Dekra, Bosch Service
4. **Services** — icon cards, click opens detail list:
   - Diagnose (10 sub-items)
   - Wartung / Inspektion (6 sub-items)
   - Klimaanlage (6 sub-items)
   - Achsvermessung (3 sub-items)
   - Fahrwerk-Reparatur
   - Motorreparatur
   - HU/AU (Hauptuntersuchung)
5. **Warum wir?** — 3 USP points (modern diagnostics, OEM parts, transparent pricing)
6. **Bewertungen** — 5-star reviews (Google Reviews widget or static)
7. **Galerie** — 3-4 workshop photos (clean grid)
8. **Kontakt** — interactive map, working hours, short contact form (name, phone, question)
9. **Footer** — legal info, privacy policy, social media links

### Admin Panel (/admin)
- /admin/login — login page
- /admin/dashboard — bookings table + calendar
- /admin/bookings/[id] — booking detail, status change, send completion notification

## API Routes
- `GET /api/bookings/available-dates` — returns available dates for next 10 days
- `POST /api/bookings` — create new booking
- `PATCH /api/bookings/[id]/status` — update booking status
- `POST /api/bookings/[id]/notify-ready` — send completion notification to client

## i18n
- Default locale: `de` (German)
- Supported: `de`, `ru`, `en`
- Language switcher in header
- All UI text, email templates, and Telegram messages translated
- Booking form labels and confirmation messages in client's selected locale

## Design Guidelines
- Clean, professional, light theme
- High-quality workshop/mechanic photos
- Phone number always visible in header (mobile users)
- Primary CTA button highly visible on Hero section
- Trust signals prominent (certifications, partner logos, reviews)
- Mobile-first responsive design
- Inspiration: Lapa Ninja style — icon cards for services, clean grid gallery

## Key Texts (DE)
- Hero headline: "Ihre Autoexperten in [Stadt] — sicher, schnell und zuverlässig."
- Hero subheadline: "Inspektion, Reparatur oder HU — wir bringen Ihr Fahrzeug mit modernster Technik und Fachkompetenz zurück auf die Straße."
- CTA button: "Termin buchen online"
- Slogans: "Einfach. Zuverlässig. Los." / "Ehrliche Reparatur. Transparente Preise."

## Environment Variables Required
```
DATABASE_URL=          # Neon PostgreSQL connection string
NEXTAUTH_SECRET=       # NextAuth secret
NEXTAUTH_URL=          # App URL
SMTP_HOST=             # Email SMTP host
SMTP_PORT=             # Email SMTP port
SMTP_USER=             # Email SMTP user
SMTP_PASS=             # Email SMTP password
SMTP_FROM=             # Sender email address
TELEGRAM_BOT_TOKEN=    # Telegram Bot token
TELEGRAM_CHAT_ID=      # Auto service Telegram chat ID
```

## Development Notes
- Use `next-intl` for all text — no hardcoded strings in components
- Prisma migrations via `npx prisma migrate dev`
- Admin password stored as bcrypt hash — never plain text
- Calendar available dates calculated server-side (exclude weekends + already booked dates)
- Booking form validation: all fields required, email format, phone format
- On HDD machine — keep Docker minimal, use Neon cloud DB even locally via .env

