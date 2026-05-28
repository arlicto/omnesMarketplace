# Omnes Marketplace

A curated marketplace platform for the Omnes Education community, built with React 19, Vite 8, and Clerk authentication.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Routing**: React Router v7
- **Auth**: Clerk (`@clerk/react@6.7.2`)
- **State**: Zustand
- **API**: Axios
- **Backend**: PHP 8.3
- **Database**: MySQL 8.4
- **Styling**: Tailwind CSS (custom design tokens)
- **Icons**: Material Symbols
- **Infrastructure**: Docker Compose

## Features

- **Authentication**: Sign-up/Sign-in with Clerk, role-based access (Buyer, Seller, Admin)
- **Browse**: Product catalog with category tiles, flash sales, daily selection
- **Cart**: Immediate purchases, won auctions, successful negotiations, order summary
- **Checkout**: 3-step flow — Delivery info → Payment → Confirmation
- **Account**: Dashboard, order history, active bids, negotiations, watchlist, settings
- **Seller Dashboard**: Item listings management, analytics
- **Admin Panel**: User and marketplace management
- **Notifications**: Tabbed view (All, Unread, Archived), preferences modal with toggles, delivery channels, quiet hours
- **Negotiations**: Active negotiation management

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- A [Clerk](https://dashboard.clerk.com) account for authentication (free tier works)

### Quick start

```bash
# 1. Clone and enter the project
git clone <repo-url> omnes-marketplace
cd omnes-marketplace

# 2. Add your Clerk publishable key
cp .env.example .env
# Edit .env and set VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# 3. Launch everything
docker compose up -d
```

Once started:

| Service   | URL                       |
|-----------|---------------------------|
| Frontend  | http://localhost           |
| Backend   | http://localhost:8000/api  |
| MySQL     | localhost:3306             |

When you change the Clerk key, rebuild the frontend:

```bash
docker compose up -d --build frontend
```

### Local development (without Docker)

```bash
# Frontend
cd frontend
cp .env.example ../.env   # or create frontend/.env.local
npm install
npm run dev

# Backend (separate terminal)
cd backend
cp .env.example .env
php -S localhost:8000 -t public
```

## Project Structure

```
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Shared components (Header, Footer, Layout)
│   │   ├── lib/              # API client (Axios)
│   │   ├── pages/            # Route pages
│   │   ├── stores/           # Zustand stores (auth, cart, notifications)
│   │   ├── App.tsx           # Routes & protected route guards
│   │   ├── main.tsx          # Entry point with ClerkProvider
│   │   └── index.css         # Tailwind setup + utilities
│   ├── Dockerfile            # Multi-stage: Vite build → nginx
│   ├── nginx.conf            # SPA routing + API proxy
│   └── ...
├── backend/
│   ├── public/               # PHP entry point (index.php)
│   ├── config/               # Database configuration
│   ├── src/                  # Router, helpers
│   ├── migrations/           # SQL schema
│   ├── Dockerfile            # PHP 8.3 Apache
│   └── apache.conf           # Virtual host config
├── docker-compose.yml        # frontend + backend + mysql
└── README.md
```

## License

MIT
