# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Destiny Rising Community Hub** is a comprehensive web application built with Next.js 15 for the Destiny Rising mobile game community. The platform includes task tracking, weapon management, build sharing, news, LFG (Looking for Group), clan management, and achievement systems.

## Recent Major Updates (December 2024)

### ✅ Complete Visual Design Overhaul
- **Professional Design Transformation**: Completely redesigned from flashy/childish appearance to professional, enterprise-level styling
- **Theme System**: Updated to professional blue/gray color scheme with excellent light/dark mode support
- **Navigation**: Clean, corporate navigation with professional typography and spacing
- **Animations**: Removed excessive particle effects and flashy animations for cleaner user experience

### ✅ Comprehensive Image Asset Integration
- **Combat Style Icons**: Added Impact, Piercing, Rapid-Fire, Spread weapon type logos throughout the UI
- **Element Icons**: Integrated Arc, Solar, Void element images in weapon displays and forms
- **Weapon Slot Icons**: Primary and Power slot indicators with visual badges
- **Rarity System**: Replaced text-based star ratings with actual star image assets (1-6 stars)
- **Character Portraits**: Added character images to compatibility selection with professional styling
- **Image Utility System**: Created centralized asset management (`src/lib/image-assets.ts`) with type-safe helpers

### ✅ Enhanced Weapon Management System
- **Weapon Admin Form**: Complete visual overhaul with image previews for all weapon attributes
- **Character Compatibility**: Visual character selection with portraits and professional checkbox styling
- **Weapons Display**: Rich weapon browser with combat style, element, and slot icons
- **Mod Creation**: Enhanced mod management with combat style icons and visual indicators
- **Fixed Critical Bug**: Resolved 500 error in weapon update API caused by SQL schema mismatch

### ✅ Database Schema Alignment
- **API Fixes**: Corrected weapon update queries to match Prisma schema naming conventions
- **Table Names**: Fixed discrepancies between SQL queries and actual database structure
- **Character Compatibility**: Properly implemented weapon-character associations

## Current Status
- **Build Status**: ✅ All systems building successfully
- **Database**: ✅ Schema properly aligned with API queries
- **Image Assets**: ✅ Fully integrated across all weapon and mod systems
- **Professional Design**: ✅ Complete visual transformation implemented
- **Performance**: ✅ Optimized image loading and responsive design

## Common Commands

### Development
```bash
npm run dev              # Start development server at localhost:3000
npm run build            # Build production bundle (runs prisma generate first)
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Git Workflow
**IMPORTANT**: After each development cycle or significant set of changes, automatically push to GitHub:
```bash
git add .
git commit -m "Brief description of changes 🤖 Generated with Claude Code"
git push origin beta
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

### Styling & Theme System
- **Professional Design**: Complete overhaul from flashy gaming theme to professional enterprise appearance
- **Theme Context**: Centralized theme management (`src/contexts/ThemeContext.tsx`) with light/dark mode support
- **Color Scheme**: Professional blue/gray palette replacing previous flashy colors:
  - **Light Mode**: Clean whites and subtle grays with blue accents (#3b82f6)
  - **Dark Mode**: Dark surfaces (#1e293b) with proper contrast ratios
  - **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Component Design**: Professional cards, buttons, and form elements
- **No Emojis Policy**: All emojis removed for professional appearance

### Image Asset System
- **Centralized Management**: All image assets managed via `src/lib/image-assets.ts`
- **Asset Categories**:
  - **Combat Styles**: `/images/misc/` - Impact, Piercing, Rapid-Fire, Spread icons
  - **Elements**: `/images/elements/` - Arc, Solar, Void element images
  - **Weapon Slots**: `/images/misc/` - Primary and Power slot indicators
  - **Rarity Stars**: `/images/misc/rarity.png` - Star asset for 1-6 star ratings
  - **Characters**: `/images/characters/` - All 12 character portraits
- **Helper Functions**: Type-safe image accessors and rarity star generators
- **Integration**: Fully integrated into weapon forms, displays, and mod systems

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
- **Prisma Schema**: PostgreSQL as primary provider with comprehensive weapon/mod/character system
- **Recent Fix**: Corrected API queries to match Prisma naming conventions (camelCase vs snake_case)
- **Key Models**:
  - `Weapon` - Core weapon data with stats and metadata
  - `WeaponCharacterCompatibility` - Which characters can use which weapons
  - `WeaponTrait`, `WeaponPerkAssignment`, `WeaponCatalyst` - Weapon enhancement system
  - `WeaponMod`, `WeaponModAssignment` - Mod system for weapon customization
- File `setup-auth-tables.sql` contains manual SQL setup (if needed)

## Known Issues & Resolutions

### ✅ Resolved: Weapon Update API 500 Error
- **Issue**: Weapon updates were failing with 500 errors due to SQL schema mismatch
- **Cause**: API was using incorrect table names (`weapons` instead of `"Weapon"`) and snake_case columns
- **Resolution**: Updated all queries in `src/lib/weapons-api.ts` to match Prisma schema naming
- **Status**: Fixed and tested - weapon updates now work correctly

### Image Loading Optimization Notice
- Browser console may show image lazy loading messages - this is normal browser optimization, not an error
- Images are loaded efficiently with proper lazy loading and placeholder handling

## Deployment Notes

- **Branch Strategy**: Development on `beta` branch, production deployments from `main`
- **Build Process**: All builds complete successfully with only minor ESLint warnings (mostly Next.js Image optimization suggestions)
- **Database**: Schema is properly aligned between Prisma models and API queries
- **Assets**: All image assets properly integrated and loading efficiently

## Next Development Priorities

### Potential Future Enhancements
1. **Performance Optimization**: Convert `<img>` tags to Next.js `<Image>` components for better performance
2. **Additional Asset Integration**: Expand image system to other areas of the application
3. **Enhanced Filtering**: Add more sophisticated weapon filtering and search capabilities
4. **Mobile Optimization**: Further mobile responsiveness improvements
5. **Accessibility**: ARIA labels and keyboard navigation enhancements

### Maintenance Notes
- **Regular Builds**: Always run `npm run build` after significant changes
- **Image Assets**: New images should be added to appropriate subdirectories and integrated via `image-assets.ts`
- **Database Changes**: Use Prisma migrations for schema changes and update API queries accordingly
- **Professional Standards**: Maintain no-emoji policy and professional visual standards
