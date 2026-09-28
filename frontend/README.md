# Frontend

React + TypeScript + Tailwind, built with Vite.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Needs the backend (`../backend`) running on port 5000. In development Vite proxies `/api` to it. For production set `VITE_API_URL` in `.env` (see `.env.example`).
