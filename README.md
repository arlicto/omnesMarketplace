# Omnes Marketplace

A curated marketplace platform for the Omnes Education community, built with React 19, Vite 8, and Clerk authentication.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Routing**: React Router v7
- **Auth**: Clerk (`@clerk/react@6.7.2`)
- **Styling**: Tailwind CSS (custom design tokens)
- **Icons**: Material Symbols

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

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `frontend/.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Shared components (Header, Footer, Layout)
│   ├── pages/               # Route pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Account.tsx
│   │   ├── Browse.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Payment.tsx
│   │   ├── Confirmation.tsx
│   │   ├── Product.tsx
│   │   ├── Seller.tsx
│   │   ├── SellerOnboarding.tsx
│   │   ├── Admin.tsx
│   │   ├── Notifications.tsx
│   │   └── Negotiations.tsx
│   ├── App.tsx              # Routes & protected route guards
│   ├── main.tsx             # Entry point with ClerkProvider
│   └── index.css            # Tailwind setup + utilities
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## License

MIT
