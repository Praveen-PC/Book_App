# 📚 Smart Bookmark — Book Management App

Smart Bookmark is a full-stack cloud-based book management application where users can securely log in using Google, add books, search books, and maintain their personal bookmark collection.

The project demonstrates a real production workflow including OAuth authentication, protected data access, cloud database usage, and deployment.

**Built with:** Next.js, Supabase Authentication & Database, Google OAuth, and deployed on Vercel.

---

## 🚀 Live Demo

https://your-vercel-url.vercel.app

---

## ✨ Features

* 🔐 Google Authentication (OAuth)
* ➕ Add new books
* 📖 View all books
* 🔍 Instant search functionality
* 🔖 Bookmark / Remove Bookmark
* 👤 User-specific bookmark storage
* ☁️ Cloud database using Supabase
* 📱 Fully responsive UI
* 🌐 Production deployment on Vercel

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React Hooks
* Bootstrap

### Backend / Services

* Supabase Authentication
* Supabase PostgreSQL Database
* Google OAuth Integration

### Deployment

* Vercel

---

## 🔑 Authentication Flow

1. User clicks **Login with Google**
2. Redirected to Google OAuth
3. Google authenticates → Supabase verifies
4. Supabase returns session via callback
5. User stays logged in with persistent session

---

## ⚙️ Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🧪 Run Locally

```bash
npm install
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 📦 Deployment

Deployed using **Vercel**

Steps:

* Connect GitHub repository
* Add environment variables
* Configure Supabase redirect URLs
* Configure Google OAuth callback URL
  
---

## 🧠 Challenges Faced & Solutions


1.OAuth + Supabase setup confusion
2. Google OAuth redirect mismatch after deployment
3. Environment variables not working in Vercel

---


