# Simple Billing Application

React frontend built with Vite. The app requests products from the Spring Boot backend at `/api/products`.

## Local development

```sh
npm install
npm run dev
```

By default, the frontend uses `http://localhost:8080` as its backend URL. To use a different backend, create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://your-backend.example.com
```

Set the value to the backend origin only (no `/api/products` path).

## Deploy to Vercel

1. Import the frontend's Git repository into Vercel. The repository root is the Vercel project root.
2. Keep the Vite defaults: build command `npm run build` and output directory `dist`.
3. Add `VITE_API_BASE_URL` in the Vercel project's Environment Variables, using the deployed Spring Boot backend's public origin (for example, `https://your-backend.example.com`). Set it for the environments you deploy.
4. Redeploy after adding or changing the environment variable.

`vercel.json` configures the SPA fallback so direct visits and page refreshes serve the Vite app.

The backend must be publicly reachable over HTTPS and configured to allow the deployed Vercel frontend origin via CORS. The backend currently allows only `http://localhost:5173`; update its CORS configuration to include your Vercel production domain (and preview domains if needed) before the deployed frontend can load products. Do not put credentials or secrets in `VITE_` variables because they are included in browser code.

## Scripts

- `npm run dev` — start the local development server
- `npm run build` — create the production build in `dist`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
