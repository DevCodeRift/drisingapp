-- Create NextAuth authentication tables for Neon PostgreSQL

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    image TEXT
);

-- Accounts table (for OAuth providers like Discord)
CREATE TABLE IF NOT EXISTS "Account" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    scope TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Sessions table
CREATE TABLE IF NOT EXISTS "Session" (
    id TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    expires TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires TIMESTAMP(3) NOT NULL
);

-- Task templates table
CREATE TABLE IF NOT EXISTS "TaskTemplate" (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    "resetType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User tasks table
CREATE TABLE IF NOT EXISTS "UserTask" (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskTemplateId" TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "resetAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserTask_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "TaskTemplate"(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX IF NOT EXISTS "UserTask_userId_taskTemplateId_key" ON "UserTask"("userId", "taskTemplateId");

-- Insert task templates
INSERT INTO "TaskTemplate" (id, title, description, category, "resetType") VALUES
-- Daily Tasks
('daily_commissions', 'Daily Commissions', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('haven_cat_gift', 'Haven Cat Gift', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('pvp_card_energy', 'PVP Card Game Chest Energy (5)', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('pve_card_energy', 'PVE Card Game Chest Energy (10, 3 high value)', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('sparrow_racing_energy', 'Sparrow Racing Chest Energy (5)', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('iron_commander_tickets', 'Iron Commander Tickets (3)', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('wu_ming_black_market', 'Talk to Wu Ming (5 Black Market Favor)', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('daily_bounties', 'Daily Bounties', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('seasonal_engram', 'Buy cheap Seasonal Engram', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('daily_pack_quests', 'Complete daily Pack Quests', NULL, 'DAILY', 'DAILY_2AM_UTC'),
('daily_mentor_tasks', 'Complete daily Mentor tasks', NULL, 'DAILY', 'DAILY_2AM_UTC'),

-- Weekly Tasks
('challenger_keys', 'Use your 3 Challenger Keys', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('free_shifting_gates', 'Use your free Shifting Gates Run', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('weekly_shifting_gates', 'Weekly Shifting Gates Quests', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('shifting_gates_exchange', 'Shifting Gates Exchange', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('fishing_exchange', 'Fishing Exchange', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('legendary_campaign', 'Complete Legendary Campaign Weekly Challenges', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('gauntlet_onslaught', 'Complete Gauntlet Onslaught Weekly Rewards', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('wu_ming_card_shop', 'Check Wu Ming''s new Card Shop offers', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('wu_ming_black_market_weekly', 'Check Wu Ming''s Black Market offers (Fri/Mon)', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('black_market_bounties', 'Complete Black Market Bounties and sell materials', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('lumia_leaves', 'Get free Lumia Leaves from Silver Shop', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('casual_activeness', 'Casual Activeness Points', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('iron_bar_energy', 'Iron Bar Chest Energy (Weekends only)', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('weekly_battle_pass', 'Complete weekly Battle Pass Quests', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),
('weekly_pack_quests', 'Complete weekly Pack Quests', NULL, 'WEEKLY', 'WEEKLY_MONDAY'),

-- Fortnight Tasks
('the_expanse', 'Complete The Expanse', NULL, 'FORTNIGHT', 'FORTNIGHT'),
('calamity_ops', 'Complete Calamity Ops', NULL, 'FORTNIGHT', 'FORTNIGHT'),

-- Monthly Tasks
('mentor_exchange', 'Mentor Exchange', NULL, 'MONTHLY', 'MONTHLY'),
('fortuna_dust_exchange', 'Fortuna Dust Exchange', NULL, 'MONTHLY', 'MONTHLY'),

-- Seasonal Tasks
('daybreak_seal', 'Season of Daybreak: Daybreak Seal and Cosmetics', 'Available until 06/11/2025', 'SEASONAL', 'SEASONAL'),
('challenge_accepted', 'Gauntlet: Onslaught - Challenge Accepted', 'Time-limited triumph', 'SEASONAL', 'SEASONAL'),
('iron_fist', 'Gauntlet: Onslaught - Iron Fist', 'Time-limited triumph', 'SEASONAL', 'SEASONAL'),
('reigning_champ', 'Shadowshaper - Reigning Champ', 'Time-limited triumph', 'SEASONAL', 'SEASONAL')

ON CONFLICT (id) DO NOTHING;