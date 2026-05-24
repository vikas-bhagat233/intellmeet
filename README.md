# IntellMeet

> A collaborative meeting platform with real-time video, screen sharing, chat, recording, and AI-assisted meeting summaries.

Quick features
- Real-time video/audio with WebRTC (simple-peer)
- Screen sharing with late-join support
- Chat, recordings, meeting history
- AI summaries and insights

Getting started (development)

Prerequisites
- Node.js 18+ and npm (or yarn/pnpm)

Install

1. Install root (optional):

```bash
npm install
```

2. Install and run the server

```bash
cd server
npm install
npm run dev
```

3. Install and run the client

```bash
cd client
npm install
npm run dev
```

Environment
- Copy `server/.env` from your environment provider or create one with required keys (MongoDB URI, JWT secret, Cloudinary keys, etc.).

Build for production

```bash
cd client
npm run build

cd server
npm run start
```

Useful paths
- Server entry: server/src/server.js
- Client entry: client/src/main.jsx

Contributing
- Issues and pull requests welcome. Keep changes focused and add tests where relevant.

License
- MIT

Deploying to Render
--------------------

Option A — Separate services (recommended):
- Create two services in Render: a **Web Service** for the server and a **Static Site** for the client.
- Connect your GitHub repo and use the included `render.yaml` to auto-provision both services.

Quick steps:

1. Push your repo to GitHub.
2. In Render, import from GitHub and enable `render.yaml` for automatic service creation.
3. Set the server environment variables in Render settings (see `server/.env.example`) — **do not commit secrets**.

Option B — Single web service (serve client from server):
- Use the root `build` script to build the client, then start the server which serves the static `client/dist` folder.
- In Render's Web Service settings, set the **Build Command** to:

```bash
cd client && npm ci && npm run build
cd ../server && npm ci
```

and **Start Command** to:

```bash
npm --prefix server start
```

Local test (build + run server locally):

```bash
# build client
cd client && npm install && npm run build

# in separate terminal start server
cd server && npm install && npm start
```

Environment variables required (minimum):
- `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (for CORS), optional Cloudinary and OpenAI keys.

Troubleshooting
- If Render logs show missing env vars, add them under the service's Environment settings.
- Ensure your MongoDB Atlas cluster allows connections from Render IPs (or set to allow access from anywhere during testing).

# IntellMeet - AI-Powered Video Conferencing Platform

## Features
- User Authentication (JWT)
- Video Meetings (WebRTC)
- Real-time Chat (Socket.io)
- Meeting Management
- Profile Management

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Real-time**: Socket.io + WebRTC

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env  # Update values
npm run dev