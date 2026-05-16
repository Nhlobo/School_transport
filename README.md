# Mzansi Scholar Transport

A Next.js school transport platform focused on safer student commuting, faster parent updates, and consistent dashboards for parents, drivers, and admins.

## Improvements included

- Stronger baseline security headers (CSP, HSTS, X-Frame-Options, etc.)
- Better performance defaults (optimized Next Image delivery with AVIF/WebP)
- Consistent typography and color usage across key UI screens
- Homepage media gallery with real photos for improved trust and engagement

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Deploying on Render

1. Push this project to GitHub.
2. In Render, click **New +** → **Web Service**.
3. Connect your GitHub repo and select this project.
4. Configure service:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Node Version**: `20` (recommended)

6. Add environment variables in Render (**Environment** tab):
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://schooltransport_user:VAaOei5OiEeXGOV4v0UNn1j4iTf1fOrS@dpg-d84b6t58nd3s73ctvk1g-a/schooltransport` (use this internal URL if your app and DB are both on Render)
   - `AUTH_ACCESS_TOKEN_SECRET=fJ4WgOo4Ks_hGsUpbmN0gQ7Md8C8ifLpkGY43bbErFGuXcl6T9WqGAx8nP3AlkgW`
   - `AUTH_REFRESH_TOKEN_SECRET=iM5aavBcNhZR0mWR0yvo-JTqREBRxZRfwlnV0Ks_q9h7dKPRLwgWXam71ftwjmI6`
   - `AUTH_RESET_TOKEN_SECRET=AUVPOiqN-KoZDDNW7K93g3lNM9PuUyODOeggZjWRQbNBwEl3FJh0WuCrHVQJ-dGq`
7. Optional (external access from local tools), use:
   - `postgresql://schooltransport_user:VAaOei5OiEeXGOV4v0UNn1j4iTf1fOrS@dpg-d84b6t58nd3s73ctvk1g-a.oregon-postgres.render.com/schooltransport`
8. Click **Create Web Service**.
9. After deploy completes, open the Render URL and verify:
   - Home page loads with images
   - Navigation to Parent/Driver/Admin pages works
   - HTTPS is active

## Security checklist for go-live

- Use Render's automatic HTTPS (enabled by default)
- Add a custom domain with SSL enforced
- Keep dependencies updated regularly (`npm outdated`)
- If adding maps/payment APIs, store keys only in Render environment variables
