# Visual Gallery

Visual Gallery is a Vite, React, and TypeScript portfolio site for Jamie Rodriguez, a people photographer focused on portraits, documentary stories, and editorial client work.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components
- React Router

## Requirements

- Node.js 20+
- npm 10+

## Local Development

```bash
npm install
npm run dev
```

The development server starts on port 8080 by default.

## Production Build

```bash
npm run build
npm run preview
```

The compiled app is emitted to `dist/` and can be served with standard static hosting tooling such as Nginx, Caddy, Apache, Vercel, Netlify, or S3-compatible static hosting.

## Project Notes

- Photographer profile content lives in `public/data/photographer.json`.
- Series content lives in `public/data/series`.
- Gallery images are served from `public/images/series`.
- Social preview metadata uses the local `public/images/social-card.svg` asset.
- The project uses standard Vite and npm tooling without vendor-specific build plugins.
