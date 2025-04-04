# Video Games

A project using **Turborepo**, **NestJS**, and **Vite**.

## Getting Started

### 1. Install Dependencies

First, install the dependencies using **pnpm**:

```bash
pnpm install
```

### 2. Start the Development Environment

You have two options to start the development environment:

Option 1: Using Turborepo:

```bash
turbo run dev
```

Option 2: Using pnpm (after running pnpm install):

```bash
pnpm run dev
```

Both commands will start the development environment for the entire project, including the frontend and backend.

### 3. Backend (NestJS)

The backend is powered by NestJS and runs on a server that is automatically started with the above commands. It provides APIs for your application to interact with.

### 4. Frontend (Vite)

The frontend is built with Vite for fast development, and it uses Tanstack Router for routing and Tanstack Query for data fetching and state management.

TODO:

### BE

- [x] Remove session code (session library, session schema type, session setup, migration)
- [x] Error if user signs up with existing email
- [x] Add back JWT code (create JWT for successful login, & google sign in, look into Google sign in with Native (SDK?))
- [ ] Ensure refresh token in working correctly

### FE

- [ ] Profile not getting fetched every time on protected routes
- [ ]

### APP

- [ ] (App) Implement login page with sign in with google and user+pass login
- [ ] (App) Remove sign in modal
