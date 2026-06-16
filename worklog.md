# Portfolio Project Worklog

## Current Project Status
- **Framework**: Next.js 16.1.3 + Turbopack + TypeScript + Tailwind CSS 4
- **Database**: Prisma ORM + SQLite (custom.db)
- **Theme**: Navy #0a1628 + Teal #06b6d4
- **Site URL**: https://upam1721.com
- **Git**: github.com/Upamm/portfolio.git (main branch, up to date)
- **Dev Server**: Running on port 3000

## Deployment Fixes Applied (Session: Jun 16, 2025)

### Critical Fixes
1. **Removed conflicting manifest files**: Deleted `public/manifest.webmanifest` and `public/icon.svg` that conflicted with Next.js App Router's `src/app/manifest.ts` and `src/app/icon.svg`
2. **Updated manifest.ts icons**: Switched from SVG to proper PNG icons (32x32, 180x180, 192x192, 512x512)
3. **Added missing Prisma models**: `MessageReaction` (with unique constraint on messageId+senderId+emoji) and `ErrorLog` models
4. **Added missing Message fields**: `starred` (Boolean), `deletedAt` (DateTime?), `editedAt` (DateTime?)
5. **Fixed password change endpoint**: Was comparing plain text against bcrypt hash (always failed) and storing plain text. Now uses `bcrypt.compare()` and `bcrypt.hash()` properly.

### Security Fixes
6. **Session cookie**: Changed to `httpOnly: true` and `secure: true` in production (prevents XSS token theft)
7. **CSP frame-ancestors**: Restricted from `*` to `'self' https://upam1721.com` (prevents clickjacking)
8. **DB query logging**: Disabled in production (prevents data leaks in logs)

### Build & Configuration
9. **typescript.ignoreBuildErrors**: Changed from `true` to `false` for build safety
10. **Created public/uploads directory**: Required for file upload API

### Cleanup
11. **Removed 11 unused packages**: next-auth, ssh2 (moved to devDep), sshpk, react-hook-form, @hookform/resolvers, @tanstack/react-query, uuid, vaul, next-themes, date-fns, tailwindcss-animate
12. **Removed 150+ orphaned files**: QA screenshots, data files, download dirs, agent-ctx docs, etc.

## Favicon Update (Session: Jun 16, 2025)
- Custom "U" lettermark favicon matching Navy/Teal theme
- Generated via AI image generation + sharp processing
- Files: favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, logo.svg, manifest.webmanifest, src/app/icon.svg

## SSR Crash Fix (Session: Jun 16, 2025)
- Fixed `useToast` hook: Added missing `getServerSnapshot` parameter to `useSyncExternalStore` (was causing 500 errors on all pages)

## Previous Sessions
- Shimmer skeleton loaders for all sections
- Hero avatar swap to LinkedIn profile image
- Gmail SMTP contact form integration
- Full client portal with messaging, tickets, projects, invoices
- Admin dashboard with message management
