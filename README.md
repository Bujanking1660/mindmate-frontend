# MindMate — Frontend

This is the frontend for the MindMate application — a Vite + React single-page app that connects to the MindMate backend API.

**Tech stack:** Vite, React, Tailwind CSS, Axios, Recharts

## Quick start

Prerequisites:
- Node.js (recommended v18+)
- npm (or yarn / pnpm)

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Lint the codebase:

```bash
npm run lint
```

## Environment variables

Create a `.env` file in this folder (or set in your environment). The app expects at least:

- `VITE_API_URL` — base URL of the MindMate backend API (used by [src/api/axiosConfig.js](src/api/axiosConfig.js)).

Example `.env`:

```
VITE_API_URL=http://localhost:3000
```

## Project structure (important files)

- `src/main.jsx` — app entry
- `src/App.jsx` — main routes and layout
- `src/api/axiosConfig.js` — Axios instance and auth refresh handling
- `src/components` — UI components
- `src/pages` — app pages

## Notes

- The frontend expects auth cookies for secure endpoints and uses `localStorage` for a short-lived JWT token used in `Authorization` headers.
- Token refresh is implemented in `src/api/axiosConfig.js`; if the refresh fails the user will be redirected to `/login`.

## Contributing

Contributions are welcome — open a PR and describe your change. Keep code style consistent and run `npm run lint` before submitting.

## License

See the repository root LICENSE file.

---

Created for the MindMate project. If you'd like more detail (screenshots, development notes, CI instructions), tell me which sections to expand.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# mindmate-frontend
