# MindMate — Frontend

Front-end single-page application for the MindMate project. Built with Vite and React, it connects to the MindMate backend API to provide user authentication, mood logging, analytics, and profile management.

Tech stack
- Vite + React
- Tailwind CSS
- Axios for API requests
- Recharts for charts

Features
- Authentication (login/register, OAuth support)
- Mood logging and mood types
- Analytics and reporting pages
- File uploads (profile photo)

Quick start

Prerequisites
- Node.js (recommended v18+)
- npm (or yarn / pnpm)

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build locally

```bash
npm run preview
```

Lint the codebase

```bash
npm run lint
```

Available npm scripts (from package.json)
- `dev` — start Vite dev server
- `build` — build production assets
- `preview` — preview production build
- `lint` — run ESLint

Environment variables

Create a `.env` file at the project root of the frontend or set these in your environment. The app expects:

- `VITE_API_URL` — Base URL of the MindMate backend API. Example:

```
VITE_API_URL=http://localhost:3000
```

Notes about auth and API
- The app uses cookies for session/refresh token handling and stores a short-lived JWT in `localStorage` for `Authorization` headers.
- Token refresh logic and request retry handling are implemented in [src/api/axiosConfig.js](src/api/axiosConfig.js). If refresh fails, the user is redirected to `/login`.

Project structure (important)
- `src/main.jsx` — application bootstrap
- `src/App.jsx` — routes and layout
- `src/api/axiosConfig.js` — Axios instance + interceptors for auth
- `src/components` — reusable components (Navbar, AlertModal, etc.)
- `src/pages` — top-level pages (Home, Profile, Login, Register, Report)

Backend integration
- The frontend expects the backend to provide JSON REST endpoints under `VITE_API_URL`, including `/auth/*`, `/users`, `/moods`, and analytics routes used in `src/services`.
- Ensure the backend sends HttpOnly refresh cookies and a JSON response containing the access token when calling `/auth/refresh` (see `src/api/axiosConfig.js` behavior).

Deployment
- Build with `npm run build` and deploy the `/dist` folder to your static host (Netlify, Vercel, GitHub Pages with proper routing, or served by the backend).
- For SPA routing, configure your hosting to fallback to `index.html`.

Development tips
- Run the backend on a separate port and set `VITE_API_URL` accordingly.
- Use the browser devtools Application tab to inspect cookies/localStorage when troubleshooting auth.

Testing & linting
- Lint: `npm run lint`
- There are no automated tests in this repo by default. Add tests and scripts as needed.

Contributing
- Fork the repo, work on a branch, and open a PR with a clear description.
- Run `npm run lint` and ensure formatting/lint rules pass before submitting.

Troubleshooting
- 401 errors: check `VITE_API_URL`, cookie settings (secure/domain), and CORS on the backend.
- Uploads failing: confirm `multipart/form-data` endpoints and `multer`/storage config on backend.

Resources & references
- Axios config: [src/api/axiosConfig.js](src/api/axiosConfig.js)
- API service wrappers: `src/api` and `src/services`

License
- See the repository root LICENSE file.

Contact
- For questions about the frontend implementation, review files under `src/` or ask the project maintainer.

---

If you'd like, I can add screenshots, a short architecture diagram, or deploy instructions (Vercel/Netlify) and create a small CI workflow. Tell me which additions you want.
