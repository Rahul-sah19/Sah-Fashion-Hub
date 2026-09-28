# SAH Fashion Hub (MERN)

Two separate apps in one folder. Each has its own `package.json`, its own `node_modules`, and is started on its own.

```
E-commerce-website/
├── frontend/   React + TypeScript + Tailwind (Vite)   → http://localhost:5173
└── backend/    Express + MongoDB (Mongoose) REST API   → http://localhost:5000
```

## Run it

Open **two terminals**.

**Terminal 1: backend**
```bash
cd backend
npm install
cp .env.example .env      # then edit .env: set MONGO_URI and JWT_SECRET (skip if .env already exists)
npm run seed              # creates the admin account + starter products/categories (safe to re-run)
npm run dev               # API on http://localhost:5000
```

**Terminal 2: frontend**
```bash
cd frontend
npm install
npm run dev               # site on http://localhost:5173
```

The frontend forwards every `/api/...` request to `http://localhost:5000` (see `frontend/vite.config.ts`), so no extra frontend config is needed while developing. Start the backend first, otherwise the shop shows "Cannot reach the server".

**Admin login:** the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `backend/.env` before running `npm run seed`.

## Where things are

| Task | Folder |
| --- | --- |
| Pages, dashboards, navbar, styling | `frontend/src` |
| API routes, controllers, models, auth | `backend/src` |
| Database connection string, JWT secret | `backend/.env` |
| API base URL for production | `frontend/.env` (`VITE_API_URL`) |

## Deploying separately

- **Backend:** deploy `backend/` (Render, Railway, a VPS, etc). Set the same variables as in `.env`, and set `CLIENT_URL` to your frontend's address.
- **Frontend:** in `frontend/`, create `.env` with `VITE_API_URL=https://your-api-host/api`, then `npm run build` and host the `dist/` folder (Netlify, Vercel, etc).

## Security notes

- `backend/.env` holds your database password and JWT secret. It is git-ignored: never commit it, never share it, and never put real values in `.env.example`.
- Public sign-up always creates a normal `user`. Admins are only created by the seed script.
