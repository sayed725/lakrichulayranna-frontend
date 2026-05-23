# লাকড়ি চুলায় রান্না — Frontend

> **আসল কাঠের চুলার স্বাদ, এখন আপনার দোরগোড়ায়।**
> Authentic wood-fire cooking, delivered to your doorstep.

A full-featured Next.js 16 frontend for the **লাকড়ি চুলায় রান্না** food ordering platform — built with TypeScript, Tailwind CSS v4, TanStack Query, Zustand, Framer Motion, and Zod.

---

## 🚀 Getting Started / শুরু করুন

### Prerequisites / পূর্বশর্ত

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Backend** — The [lakrichulayranna-backend](../lakrichulayranna-backend) should be running on `http://localhost:5000`

### Installation / ইনস্টলেশন

```bash
# Clone the repository / রিপোজিটরি ক্লোন করুন
git clone <your-repo-url>
cd lakrichulayranna-frontend

# Install dependencies / ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# Copy environment variables / এনভায়রনমেন্ট ভেরিয়েবল কপি করুন
cp .env.local.example .env.local

# Edit .env.local with your values / আপনার মান দিয়ে .env.local এডিট করুন
# (See Environment Variables section below)

# Start development server / ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables / এনভায়রনমেন্ট ভেরিয়েবল

Copy `.env.local.example` to `.env.local` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Frontend public URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT secret (must match backend) | `your_jwt_secret_here` |

For the backend, see `server-env.example`.

---

## 📁 Project Structure / প্রজেক্ট স্ট্রাকচার

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Public pages (home, menu, cart, etc.)
│   ├── dashboard/
│   │   ├── admin/          # Admin dashboard pages
│   │   └── customer/       # Customer dashboard pages
│   ├── layout.tsx          # Root layout
│   ├── loading.tsx         # Global loading skeleton
│   ├── not-found.tsx       # 404 page
│   ├── error.tsx           # Error boundary
│   ├── sitemap.ts          # SEO sitemap
│   └── robots.ts           # SEO robots.txt
├── components/
│   ├── shared/             # Navbar, Footer, Logo, Container, etc.
│   ├── home/               # Hero, FeaturedItems, Categories, etc.
│   ├── item/               # ItemCard, ItemGrid
│   ├── cart/               # CartDrawer
│   ├── forms/              # FormInput, FormTextarea
│   ├── dashboard/          # StatsCard, DataTable, StatusBadge, etc.
│   └── tables/             # OrdersTable, ItemsTable
├── features/               # Feature-based hooks (auth, order, item, etc.)
├── hooks/                  # Shared hooks (useDebounce, usePagination, etc.)
├── lib/                    # Utilities (fetcher, constants, permissions)
├── providers/              # QueryProvider, ThemeProvider
├── store/                  # Zustand stores (auth, cart, coupon, ui)
└── proxy.ts                # Route protection (auth, admin guards)
```

---

## 🎨 Tech Stack / ব্যবহৃত প্রযুক্তি

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand |
| **Data Fetching** | TanStack Query v5 |
| **Forms** | React Hook Form + Zod |
| **Animations** | Framer Motion |
| **Auth** | JWT (cookie + header) via jose |
| **Notifications** | Sonner |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |

---

## 🛡️ Authentication / প্রমাণীকরণ

- **JWT-based** authentication with cookie storage
- **Proxy-level** route protection (`src/proxy.ts`):
  - `/dashboard/admin/*` → Admin-only
  - `/dashboard/customer/*`, `/checkout` → Authenticated users
  - `/login`, `/register` → Redirects authenticated users away
- **Transparent token refresh** via Axios interceptors in `src/lib/fetcher.ts`
- **Cart persistence** via Zustand `persist` middleware (localStorage)

---

## 📜 Available Scripts / উপলব্ধ স্ক্রিপ্ট

```bash
npm run dev      # Start dev server / ডেভ সার্ভার চালু
npm run build    # Production build / প্রডাকশন বিল্ড
npm run start    # Start production server / প্রডাকশন সার্ভার চালু
npm run lint     # Run ESLint / ESLint চালান
```

---

## 🏗️ Building for Production / প্রডাকশন বিল্ড

```bash
npm run build
npm run start
```

---

## 🤝 Contributing / অবদান

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License / লাইসেন্স

This project is private and proprietary.

---

**Built with ❤️ and 🔥 by the লাকড়ি চুলায় রান্না team.**
