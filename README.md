# Reja Bot Dashboard

Shaxsiy reja va vazifalarni kundalik kuzatish uchun Telegram bot va dashboard.

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Express.js + tRPC
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Auth:** Google OAuth (Supabase Auth)
- **Deploy:** Vercel (frontend) + Render (backend)

## O'rnatish

```bash
npm install
cp server/.env.example server/.env
# .env faylini to'ldiring
npm run dev
```

## Deploy

- Frontend: Vercel ga `client` papkasini ulang
- Backend: Render ga `server` papkasini ulang
