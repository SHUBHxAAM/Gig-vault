# Escrow Hiring Marketplace (Next.js + App Router, JS)

This is a demo-ready, frontend-only escrow-based hiring marketplace with three user types:

- **Worker**
- **Client**
- **Admin**

Built with **Next.js App Router**, **React**, and **Tailwind CSS**. All logic is frontend-only using `localStorage`.

## Features

### Worker

- Signup with name, phone, email, password
- Aadhar upload component (frontend-only)
- Experience textarea
- Login
- Dashboard: jobs and escrow info
- Progress submission page

### Client

- Signup with name, phone, email, password
- Aadhar upload
- Login
- Dashboard: create job, view progress, confirm completion
- Payment page: Razorpay-style UI (placeholder, no real payments)

### Admin

- Admin login page (credentials via env)
- Dashboard: approve users, view jobs, release payment (UI only)

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- LocalStorage for demo data
- pages/api/razorpay placeholder

## Getting Started

```bash
npm install
npm run dev
```

Create `.env` based on `.env.example`.

## Deployment

Push to GitHub, then import the repo into Vercel and set the same environment variables there.
