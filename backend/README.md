# Backend

Express + MongoDB REST API (JWT auth, role-based admin access).

```bash
npm install
cp .env.example .env     # set MONGO_URI and JWT_SECRET
npm run seed             # admin account + starter catalog (safe to re-run)
npm run dev              # http://localhost:5000
```

## Routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me` | logged in |
| PUT | `/api/auth/profile`, `/api/auth/password` | logged in |
| GET | `/api/products`, `/api/products/:id`, `/api/categories` | public |
| POST / PUT / DELETE | `/api/products`, `/api/products/:id` | admin |
| POST / PUT / DELETE | `/api/categories`, `/api/categories/:id` | admin |
| POST | `/api/orders` | logged in |
| GET | `/api/orders/mine` | logged in |
| PUT | `/api/orders/:id/cancel` | owner (pending only) |
| GET | `/api/orders`, PUT `/api/orders/:id/status` | admin |
| GET | `/api/admin/stats`, `/api/admin/users` | admin |
