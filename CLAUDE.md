# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run check` - Run ESLint +   (always run before commits)
- `npm run build` - Full production build with Prisma generation

### Database Commands
- `npm run prisma:migrate` - Create and apply new database migrations
- `npm run prisma:generate` - Regenerate Prisma client
- `npm run prisma:studio` - Open Prisma Studio GUI for database inspection

## Architecture Overview

PostMD is a Next.js 15 Markdown paste service (rentry.co clone) with optional OAuth authentication. Key architectural decisions:

### Core Data Flow
1. **Entry Creation**: Users create markdown entries via `/api/entries` POST
2. **Entry Storage**: Entries stored in PostgreSQL with optional user association
3. **Access Control**: Two-tier system - OAuth users own entries, anonymous users use access codes
4. **Entry Rendering**: Server-side rendering for SEO, client-side markdown editor for creation

### Database Architecture (Prisma)
- **Entry Model**: Core content storage with optional `userId` for authenticated users
- **Access Codes**: `editCode` for full access for anonymous users  
- **NextAuth Tables**: Standard NextAuth.js user/session/account tables
- **View Tracking**: Simple integer counter incremented on each view

### Authentication Strategy
- **Dual Mode**: Supports both authenticated (OAuth) and anonymous usage
- **OAuth Providers**: GitHub, Google, Twitter via NextAuth.js v4
- **Permissions**: Authenticated users can edit their entries without codes; anonymous users need access codes
- **Session Strategy**: JWT-based for serverless compatibility

### API Design Pattern
- **Nested Resources**: `/api/entries/[id]` for entry operations, `/api/entries/[id]/views` for view tracking
- **Authorization Logic**: Server-side session checking with fallback to access code validation
- **Validation**: Zod schemas in `src/lib/validation.ts` with custom refinements for optional fields

### Component Architecture
- **Form Handling**: React Hook Form with Zod resolvers for type-safe validation
- **Markdown Processing**: `@uiw/react-md-editor` for editing, `react-markdown` with `remark-gfm` for rendering
- **Syntax Highlighting**: Prism via `react-syntax-highlighter` with `oneDark` theme
- **Session Management**: NextAuth React hooks with custom `Providers` wrapper

## Critical Implementation Details

### Next.js 15 Compatibility
- Uses new async `params` pattern: `{ params }: { params: Promise<{ id: string }> }`
- 
- 
- Server components use `await params`, client components use `useParams()`
- API routes handle async params destructuring

### Validation Architecture
- **Optional Field Handling**: Custom Zod refinements allow empty strings for optional fields
- **Runtime Processing**: Empty strings converted to `undefined` in API layer
- **Access Code Generation**: `nanoid` for URL-safe random IDs and access codes

### OAuth Integration Specifics
- **Adapter Issues**: Uses `@auth/prisma-adapter` with TypeScript workarounds
- **Custom Types**: Extended NextAuth types in `src/types/next-auth.d.ts` to include user ID
- **Callback Configuration**: Custom sign-in page at `/auth/signin` with provider selection

### Database Connection Strategy
- **Production**: Configured for Neon PostgreSQL (serverless)
- **Development**: Standard PostgreSQL connection
- **Connection Pooling**: Prisma global instance pattern to prevent connection exhaustion

## Environment Configuration

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application base URL
- `NEXTAUTH_SECRET` - JWT signing secret

### OAuth Variables (Optional)
- `GITHUB_ID` / `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`  
- `TWITTER_CLIENT_ID` / `TWITTER_CLIENT_SECRET`

See `OAUTH_SETUP.md` for detailed OAuth provider configuration.

## Code Quality Standards

### Pre-commit Requirements
Always run `npm run check` before commits - this runs both ESLint and TypeScript validation.

### TypeScript Patterns
- Strict mode enabled with custom type extensions for NextAuth
- Uses `eslint-disable-next-line @typescript-eslint/no-explicit-any` for unavoidable third-party type conflicts
- Zod for runtime validation with TypeScript inference

### API Error Handling
- Consistent error response format: `{ error: string }`
- HTTP status codes: 400 (validation), 403 (authorization), 404 (not found), 500 (server)
- Input validation at API boundary with Zod schemas

## Development Workflow

### Task Analysis and Planning
Before implementing any feature or change:

1. **Requirements Analysis**
   - Analyze the task comprehensively from multiple angles
   - Consider different implementation approaches and their trade-offs
   - Evaluate impact on existing functionality and system architecture
   - Identify potential risks and dependencies

2. **Implementation Strategy**
   - Choose the approach that best fits the existing codebase patterns
   - Prioritize backward compatibility and system stability
   - Plan changes incrementally to minimize disruption
   - Consider performance, security, and maintainability implications

3. **Pre-implementation Checks**
   - Run `npm run check` to ensure current codebase is clean
   - Review existing related code and patterns
   - Verify database schema compatibility if data changes are involved
   - Check for potential conflicts with authentication and authorization systems

### Implementation Process

1. **Development Phase**
   - Make changes incrementally, testing functionality at each step
   - Follow existing code patterns and architectural decisions
   - Maintain consistency with TypeScript patterns and validation schemas
   - Preserve existing API contracts and component interfaces

2. **Integration Testing**
   - Test new functionality in isolation
   - Verify integration with existing features
   - Check authentication flows (both OAuth and anonymous)
   - Validate database operations and migrations if applicable

3. **Quality Assurance**
   - Run `npm run check` after each significant change
   - Verify no TypeScript errors or ESLint violations
   - Test edge cases and error scenarios
   - Ensure backward compatibility with existing entries and user sessions

### Completion Criteria

A task is considered complete ONLY when:
- All functionality works as specified
- `npm run check` passes without errors or warnings
- No existing features are broken or degraded
- Database operations are stable and performant
- Authentication and authorization work correctly for both user types
- All edge cases are handled appropriately

### Risk Mitigation

- **Database Changes**: Always create migrations, never modify existing data structures destructively
- **API Changes**: Maintain backward compatibility, use versioning if breaking changes are unavoidable
- **Authentication**: Test both OAuth and anonymous user flows thoroughly
- **Dependencies**: Verify new dependencies don't conflict with existing ones
- **Performance**: Monitor impact on build times and runtime performance

### Rollback Strategy

If issues are discovered post-implementation:
- Keep changes atomic and easily reversible
- Document any database migrations that may need rollback procedures
- Maintain clear commit history for easy cherry-picking or reverting

## Key Files and Their Purposes

- `src/lib/validation.ts` - Zod schemas for API validation with custom refinements
- `src/lib/auth.ts` - NextAuth configuration with custom callbacks  
- `src/lib/db.ts` - Prisma client singleton with connection pooling
- `prisma/schema.prisma` - Database schema with Entry and NextAuth models
- `src/app/api/entries/route.ts` - Main entry CRUD operations
- `src/components/MarkdownEditor.tsx` - Live preview markdown editor
- `src/types/next-auth.d.ts` - NextAuth type extensions

## Important Instructions

- ALWAYS use `context7` tools when you need to find documentation for any library or package
- NEVER run the application with `npm run dev` - the application is always running
