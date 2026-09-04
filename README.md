# 🎮 GameTracker

A full-stack video game tracking app where users can keep track of games they've played, want to play, and discover new games based on popularity and recommendations.

👉 [Watch the demo](https://youtube.com/shorts/w1wKx3EDtfI)

[![Preview](https://img.youtube.com/vi/w1wKx3EDtfI/hqdefault.jpg)](https://youtube.com/shorts/w1wKx3EDtfI)

---

## 🧱 Tech Stack

- **Frontend (Web)**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Mobile App**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Backend**: [NestJS](https://nestjs.com/) with [TypeScript](https://www.typescriptlang.org/)
- **API**: RESTful endpoints
- **Database**: PostgreSQL
- **Auth**: JWT, Google & Password Login

---

## 🚀 Features

- Track games you've played, want to play, or are currently playing
- Discover popular games (IGDB API)
- Share and compare with friends
- Cross-platform: Web + Mobile support

---

## 📦 Project Structure

This repo is a pnpm workspace monorepo:

```

/
mobile/           → React Native + Expo app
frontend/         → Vite + React app (Web)
backend/          → NestJS REST API
packages/config/  → Shared configs (oxc)
packages/types/   → Shared TypeScript types

```

---

## 📲 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/gametracker.git
cd gametracker
```

### 2. Install dependencies

One install at the repo root covers all three apps and both shared packages:

```bash
pnpm install
```

### 3. Run locally

```bash
# Dev Database
docker compose up

# Frontend
pnpm --filter frontend run dev

# Mobile (requires Expo CLI)
pnpm --filter mobile run start

# Backend (Start and Make migrations)
pnpm --filter backend exec prisma migrate dev
pnpm --filter backend run start:dev
```

Useful root-level scripts (run across every project at once):

```bash
pnpm run lint        # oxlint everywhere
pnpm run fmt:check   # oxfmt --check everywhere
```

---

## 🛠 Environment Variables

Each app has its own `.env` (gitignored) — copy the matching `.env.example` to get started:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp mobile/.env.example mobile/.env
```

Then fill in the real values (API keys, JWT secrets, AWS credentials, etc.) — see `backend/.env.example` for the full list backend expects.

---

## 📚 Future Improvements

- Social features (add friends, see their games)
- Notifications
- Offline support (for mobile)
- Creating lists - Top 10 Games ever, etc

---

## 📄 License

MIT

---

## 👨‍💻 Author

Built with ❤️ by Daniel Jowett

```

```
