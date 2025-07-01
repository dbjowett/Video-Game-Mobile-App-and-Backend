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

```

/
mobile/                → React Native + Expo app
frontend/     → Vite + React app (Web)
backend/      → NestJS REST API

```

---

## 📲 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/gametracker.git
cd gametracker
```

### 2. Install dependencies

```bash
# Frontend
cd /frontend
pnpm install

# Mobile
cd /mobile
pnpm install

# Backend
cd /backend
pnpm install
```

### 3. Run locally

```bash

# Frontend and Backend (Together w/ Turbo)
cd monorepo/
turbo run dev

# Frontend
cd /frontend
pnpm run dev

# Mobile (requires Expo CLI)
cd /mobile
pnpm run start

# Dev Database
cd /
docker compose up

# Backend (Start and Make migrations)
cd /backend
pnpm prisma migrate dev
pnpm run start:dev
```

---

## 🛠 Environment Variables

Create a `.env` file in each app folder and add required variables like API URLs, database credentials, and third-party keys.

Example for `monorepo/apps/backend/.env`:

```
# IGDB
IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=

# GOOGLE
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/redirect"

# PRISMA
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vg?schema=public"


#FE
FE_URL='http://localhost:5173/'

```

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
