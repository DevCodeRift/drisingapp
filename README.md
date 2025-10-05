# Destiny Task Manager

A Destiny 2-themed task management web application for tracking daily, weekly, and seasonal activities.

## Features

- **Discord OAuth Authentication**: Secure login with Discord
- **Task Categories**: Daily, Weekly, Fortnight, Monthly, and Seasonal tasks
- **Progress Tracking**: Visual progress bars and completion status
- **Destiny 2 Theming**: Custom styling inspired by Destiny 2
- **Responsive Design**: Works on desktop and mobile devices
- **Data Persistence**: Tasks are saved to a database and synced across devices

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Discord application for OAuth (create one at https://discord.com/developers/applications)

### Local Development

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd destiny-task-manager
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Copy \`.env.local\` and update the values:
\`\`\`
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
DISCORD_CLIENT_ID="your-discord-client-id"
DISCORD_CLIENT_SECRET="your-discord-client-secret"
\`\`\`

4. Set up the database:
\`\`\`bash
npx prisma db push
\`\`\`

5. Seed the database with task templates:
\`\`\`bash
curl -X POST http://localhost:3000/api/seed
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

1. **Fork this repository** to your GitHub account

2. **Create a Discord Application**:
   - Go to https://discord.com/developers/applications
   - Create a new application
   - Go to OAuth2 → General
   - Add your Vercel domain to Redirects (e.g., \`https://your-app.vercel.app/api/auth/callback/discord\`)
   - Note down your Client ID and Client Secret

3. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set the following environment variables in Vercel:
     - \`DATABASE_URL\`: Your database connection string (use Vercel Postgres or another provider)
     - \`NEXTAUTH_URL\`: Your Vercel app URL
     - \`NEXTAUTH_SECRET\`: A random secret string (generate with \`openssl rand -base64 32\`)
     - \`DISCORD_CLIENT_ID\`: Your Discord application client ID
     - \`DISCORD_CLIENT_SECRET\`: Your Discord application client secret

4. **Set up the database**:
   - After deployment, run the seed endpoint: \`https://your-app.vercel.app/api/seed\`

## Task Categories

### Daily Tasks (Reset at 2AM UTC)
- Daily Commissions
- Haven Cat Gift
- PVP/PVE Card Game Chest Energy
- Sparrow Racing Chest Energy
- Daily Bounties
- And more...

### Weekly Tasks (Reset on Monday)
- Challenger Keys
- Shifting Gates activities
- Weekly challenges
- Battle Pass quests
- And more...

### Seasonal Tasks
- Season of Daybreak content
- Time-limited triumphs
- Seasonal seals and cosmetics

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Prisma with SQLite (local) / PostgreSQL (production)
- **Authentication**: NextAuth.js with Discord OAuth
- **Styling**: Tailwind CSS with custom Destiny 2 theme
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.