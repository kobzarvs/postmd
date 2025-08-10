# PostMD - GitHub Copilot Instructions

PostMD is a Next.js 15 Markdown paste service (rentry.co clone) with TypeScript, Tailwind CSS, PostgreSQL/Prisma, and optional OAuth authentication.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Initial Setup and Dependencies
- **CRITICAL**: Run `npm install --ignore-scripts` first if network restrictions prevent Prisma binary downloads
- Install dependencies: `npm ci` (fails in restricted networks) or `npm install --ignore-scripts` (workaround)
- **NETWORK LIMITATION**: Prisma binary downloads may fail with error "getaddrinfo ENOTFOUND binaries.prisma.sh"
- **NETWORK LIMITATION**: Google Fonts downloads may fail during build with error "getaddrinfo ENOTFOUND fonts.googleapis.com"

### Build Process
- **NEVER CANCEL builds** - Set timeout to 60+ minutes minimum
- Full build: `npm run build` - **takes 15-30 seconds when working, NEVER CANCEL**
- **KNOWN ISSUE**: Build fails without proper Prisma client generation due to network restrictions
- **WORKAROUND**: For network-restricted environments, modify `src/app/layout.tsx` to remove Google Fonts imports and use fallback fonts

### Development Commands  
- Start development server: `npm run dev` - **Ready in ~1 second**
- **CRITICAL**: Development server works even when build fails - UI fully functional at http://localhost:3000
- **LIMITATION**: API endpoints return 500 errors without proper Prisma setup, but frontend works perfectly
- Code quality: `npm run check` - **takes ~6 seconds, NEVER CANCEL**
- Lint only: `npm run lint` - **takes ~3 seconds**  
- TypeScript check: `npm run typecheck` - **takes ~4 seconds**

### Database Commands
- **CRITICAL**: Database commands require network access and valid DATABASE_URL
- Generate Prisma client: `npm run prisma:generate` or `npx prisma generate`
- Run migrations: `npm run prisma:migrate` 
- Database GUI: `npm run prisma:studio`
- **KNOWN ISSUE**: All Prisma commands fail in network-restricted environments

## Validation

### Manual Testing Scenarios
**ALWAYS test these scenarios after making changes:**

1. **Frontend Functionality** (works even without database):
   - Visit http://localhost:3000 - should show markdown editor
   - Verify UI renders correctly with PostMD header and form
   - Test responsive design in browser dev tools

2. **Development Workflow**:
   - Run `npm run check` and ensure it passes
   - Start dev server with `npm run dev`
   - Test hot reload by modifying a component

3. **Code Quality**:
   - Always run `npm run check` before committing
   - Fix any TypeScript errors (common: missing types for Prisma entries)
   - **KNOWN ISSUE**: `src/app/profile/page.tsx` has TypeScript error for entry mapping - use `(entry: any)` with ESLint disable comment

### Required Environment Setup
**Minimum required for development (UI only):**
```bash
# Create minimal .env file
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/postmd"' > .env
```

**Full functionality requires:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random string for JWT signing
- `NEXTAUTH_URL` - Application URL (http://localhost:3000 for development)

**Optional OAuth variables:**
- `OAUTH_GITHUB_ID` / `OAUTH_GITHUB_SECRET`
- `OAUTH_GOOGLE_ID` / `OAUTH_GOOGLE_SECRET`  
- `OAUTH_TWITTER_ID` / `OAUTH_TWITTER_SECRET`

## Network Restrictions Workarounds

### Google Fonts Issue
If build fails with "getaddrinfo ENOTFOUND fonts.googleapis.com":

1. Edit `src/app/layout.tsx`
2. Replace Google Fonts imports with fallback:
```typescript
// Remove these lines:
// import { Geist, Geist_Mono } from "next/font/google";
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Add fallback:
const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };
```

### Prisma Binary Download Issue
If Prisma commands fail with "getaddrinfo ENOTFOUND binaries.prisma.sh":

1. Use `npm install --ignore-scripts` instead of `npm ci`
2. Document that full database functionality is not available
3. Frontend development and testing still works completely

## Architecture Understanding

### Core Components
- **Entry Creation**: Users create markdown entries via `/api/entries` POST
- **Frontend**: React with live markdown preview using `@uiw/react-md-editor`
- **Authentication**: NextAuth.js with GitHub/Google/Twitter OAuth (optional)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom component styling

### Key Files to Know
- `src/app/page.tsx` - Main entry creation page
- `src/components/MarkdownEditor.tsx` - Live preview markdown editor
- `src/app/api/entries/route.ts` - Entry CRUD API endpoints
- `src/lib/validation.ts` - Zod schemas for API validation
- `src/lib/auth.ts` - NextAuth configuration
- `prisma/schema.prisma` - Database schema
- `src/app/profile/page.tsx` - User profile (requires TypeScript fix)

### Common Issues and Fixes

1. **TypeScript Error in Profile Page**:
   ```typescript
   // In src/app/profile/page.tsx line 78:
   {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
   {userEntries.map((entry: any) => (
   ```

2. **Missing Prisma Types**:
   - Import from `@prisma/client` may fail if client not generated
   - Use `any` type with ESLint disable as fallback

3. **Build Failures**:
   - Always check for network connectivity issues first
   - Prisma and Google Fonts are common failure points
   - Development server works even when build fails

## Timeout Requirements

**NEVER CANCEL these commands - always wait for completion:**

- `npm run build` - **Set 60+ minute timeout** (typically 15-30 seconds when working)
- `npm run check` - **Set 15+ minute timeout** (typically 6 seconds)
- `npm ci` - **Set 30+ minute timeout** (typically 2 minutes when working)
- `npm run dev` - **Ready in 1-2 seconds**, runs continuously

## Development Workflow

1. **Start Development**:
   ```bash
   npm install --ignore-scripts  # Use if network restricted
   npm run dev                   # Start development server
   ```

2. **Code Quality Checks**:
   ```bash
   npm run check                 # ESLint + TypeScript
   ```

3. **Manual Validation**:
   - Visit http://localhost:3000
   - Verify UI functionality
   - Test markdown editor interface

4. **Before Committing**:
   ```bash
   npm run check                 # Must pass
   # Fix any TypeScript/ESLint errors
   ```

**Remember**: The application frontend works perfectly even when database/API functionality is limited by network restrictions. Focus on UI development and code quality in restricted environments.