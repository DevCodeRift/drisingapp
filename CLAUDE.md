# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Destiny Task Manager is a Destiny 2-themed task tracking web application built with Next.js 15. Users authenticate via Discord OAuth and manage daily/weekly/seasonal tasks with automatic reset logic.

## Common Commands

### Development
```bash
npm run dev              # Start development server at localhost:3000
npm run build            # Build production bundle (runs prisma generate first)
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Database
```bash
npm run db:push          # Push schema changes to database
npx prisma generate      # Generate Prisma client (auto-runs on install)
npx prisma studio        # Open Prisma Studio GUI
```

### Database Setup & Seeding
```bash
# After first deployment or when starting fresh:
curl -X POST http://localhost:3000/api/seed
# Or visit: http://localhost:3000/api/seed in browser

# To seed default task templates (admin operation):
POST /api/admin/seed-default-tasks

# To reinitialize all users with current templates:
POST /api/admin/reinitialize-users
```

## Architecture

### Authentication Flow
- **NextAuth.js** with Discord OAuth provider (`src/app/api/auth/[...nextauth]/route.ts`)
- Uses Prisma adapter for session/account storage
- Session callback extends user object with `id` field for database queries
- User initialization: First login triggers `/api/init-user` which creates UserTask instances from all TaskTemplate records

### Data Model (Prisma Schema)
The app uses a **template-instance pattern**:

1. **TaskTemplate** - Admin-managed task definitions (title, category, resetType)
2. **UserTask** - User-specific task instances linked to templates
   - Each user gets a UserTask for every TaskTemplate
   - Tracks completion status, completedAt timestamp
   - Uses unique constraint `[userId, taskTemplateId]` to prevent duplicates

**Key Models:**
- `User` - NextAuth user with Discord OAuth
- `TaskTemplate` - Task definitions (categories: DAILY, WEEKLY, FORTNIGHT, MONTHLY, SEASONAL)
- `UserTask` - User completion tracking, references both User and TaskTemplate
- `Account`, `Session`, `VerificationToken` - NextAuth tables

### Task Categories & Reset Logic
- **TaskCategory enum**: DAILY, WEEKLY, FORTNIGHT, MONTHLY, SEASONAL
- **ResetType enum**: DAILY_2AM_UTC, WEEKLY_MONDAY, FORTNIGHT, MONTHLY, SEASONAL
- Reset logic is currently not implemented on backend (no cron jobs)
- `resetAt` field exists in UserTask schema but is not actively used

### API Routes Structure

**Public Routes:**
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/tasks` GET - Fetch user's tasks (requires auth)
- `/api/tasks` POST - Toggle task completion (requires auth)
- `/api/init-user` POST - Initialize new user with tasks from templates

**Admin Routes:**
- `/api/admin/tasks` GET/POST - List/create task templates
- `/api/admin/tasks/[id]` DELETE - Remove task template
- `/api/admin/reinitialize-users` POST - Recreate all user tasks from templates
- `/api/admin/seed-default-tasks` POST - Seed default Destiny 2 task templates

**Debug/Setup Routes:**
- `/api/debug` - Database connection testing
- `/api/debug-tasks` - Task data inspection
- `/api/seed` - Initial database seeding (legacy, use admin routes instead)
- `/api/setup-db` - Database initialization

### Frontend Structure

**Pages:**
- `/` - Landing page redirects to `/dashboard`
- `/dashboard` - Main task dashboard (authenticated users only)
- `/admin` - Task template management (no auth check currently)
- `/auth/error` - OAuth error handling page

**Components:**
- `TaskSection` - Displays tasks grouped by category with progress bar
- `TaskCard` - Individual task with checkbox
- `LoginButton` - Discord OAuth login/logout
- `Providers` - NextAuth SessionProvider wrapper

**State Management:**
- Client-side React state for task lists
- No global state management (no Redux/Zustand)
- Data fetched via REST API calls to `/api/tasks`

### Styling
- **Tailwind CSS** with custom Destiny 2 color palette:
  - `destiny-orange`: #f2721b (primary)
  - `destiny-blue`: #4a90e2
  - `destiny-purple`: #8e44ad
  - `destiny-gold`: #f1c40f
  - `destiny-dark`: #1a1a1a
  - `destiny-darker`: #0f0f0f
- Custom font family: Futura fallback to Arial

### Environment Variables Required
```
DATABASE_URL=<postgres-connection-string>
NEXTAUTH_URL=<app-url>
NEXTAUTH_SECRET=<random-secret>
DISCORD_CLIENT_ID=<discord-oauth-id>
DISCORD_CLIENT_SECRET=<discord-oauth-secret>
```

## Important Patterns

### User Initialization Pattern
When a user first logs in:
1. Dashboard calls `/api/init-user` on component mount
2. API checks if user has existing UserTask records
3. If not, creates UserTask for each TaskTemplate using individual creates (not createMany)
4. Individual creates allow skipping duplicates gracefully with try-catch

### Task Toggle Flow
1. Client calls `POST /api/tasks` with `{taskId, completed: boolean}`
2. API validates session and user ownership
3. Updates UserTask.completed and sets/clears completedAt timestamp
4. Returns updated task with template data included
5. Client updates local state optimistically after response

### Admin Task Management
- Admin can create/delete TaskTemplates via `/admin` page
- After template changes, use "Reinitialize All Users" to propagate to existing users
- Reinitialize creates missing UserTasks for all users (doesn't delete existing)

## Database Notes

- **Production**: Uses PostgreSQL (Vercel Postgres or similar)
- **Local Dev**: Can use SQLite by changing DATABASE_URL to `file:./dev.db`
- Prisma schema uses PostgreSQL as primary provider
- File `setup-auth-tables.sql` contains manual SQL setup (if needed)
