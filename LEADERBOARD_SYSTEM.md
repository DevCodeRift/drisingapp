# Destiny Rising Leaderboard System

## Overview
This document outlines the architecture for capturing and displaying Destiny Rising leaderboards on the website.

## System Architecture

### Two-Part System:
1. **Capture Tool** (Separate GitHub Project)
   - Python/Node.js desktop application
   - Automates game navigation and screenshot capture
   - Uses OCR to extract leaderboard data
   - POSTs data to website API

2. **Website Backend** (This Project)
   - Receives leaderboard data via API
   - Stores in PostgreSQL database
   - Displays on frontend with filtering

---

## Leaderboard Types

### Solo Leaderboards
1. **Power** - Character-specific (12 characters to cycle through)
2. **The Expanse - Eternity**
3. **The Expanse - Echoes**
4. **Shifting Gates**
5. **Acclaim Level**
6. **Fishing**

### Squad/Group Leaderboards
1. **Calamity Ops**
2. **Gauntlet: Onslaught**
3. **Breakin**
4. **The Menace Above**
5. **Issakis's Tabernacle**

---

## Data Structure

### Ranking Types
- **Server Rankings** - Global server-wide rankings
- **Regional Rankings** - Filtered by:
  - Region (e.g., North America, Europe, Asia)
  - Sub-region (e.g., US East, US West, UK, Germany)

### Leaderboard Entry Fields
```typescript
{
  rank: number,              // Position on leaderboard (1, 2, 3, etc.)
  playerName: string,        // Player's display name
  score: number,             // Activity-specific score/value
  character?: string,        // For character-specific activities
  clan?: string,             // Player's clan/guild
  server: string,            // Server identifier
  region?: string,           // Region identifier
  subRegion?: string,        // Sub-region identifier
  activityType: string,      // "power", "expanse_eternity", etc.
  rankingType: string,       // "server" or "regional"
  capturedAt: Date,          // When this data was captured
}
```

---

## Capture Flow

### Navigation Sequence:
1. Launch game client
2. Sign in (click through to load into game world)
3. Press `Tab` key
4. Click "Rankings" tab
5. For each activity (left sidebar):
   - Select activity
   - If character filter exists (middle right):
     - Cycle through all 12 characters
     - For each character:
       - Capture Server rankings
       - Capture Regional rankings (cycle through regions/sub-regions)
   - Else:
     - Capture Server rankings
     - Capture Regional rankings (cycle through regions/sub-regions)
6. Screenshot → OCR → Extract data → POST to API

### Estimated Data Points Per Full Capture:
- Solo activities: 6 activities
- Character-specific (Power): 12 characters × 2 ranking types × N regions
- Non-character activities: 5 activities × 2 ranking types × N regions
- Group activities: 5 activities × 2 ranking types × N regions

**Total Screenshots Per Run**: ~150-200+ (depending on regions)

---

## API Design

### Endpoint: `POST /api/leaderboard/update`

**Authentication**: API Key in header
```
Authorization: Bearer <API_KEY>
```

**Request Body**:
```json
{
  "apiKey": "secure-key-here",
  "activityType": "power",
  "rankingType": "server",
  "character": "Ikora",
  "region": null,
  "subRegion": null,
  "entries": [
    {
      "rank": 1,
      "playerName": "PlayerOne",
      "score": 125000,
      "clan": "Elite Guardians"
    },
    {
      "rank": 2,
      "playerName": "PlayerTwo",
      "score": 124500,
      "clan": "Top Tier"
    }
    // ... up to 100 entries per page
  ],
  "capturedAt": "2025-01-06T10:30:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "entriesProcessed": 100,
  "message": "Leaderboard updated successfully"
}
```

---

## Database Schema

### Table: `LeaderboardSnapshot`
Stores metadata about each leaderboard capture
```prisma
model LeaderboardSnapshot {
  id            String   @id @default(cuid())
  activityType  String   // "power", "expanse_eternity", etc.
  rankingType   String   // "server" or "regional"
  character     String?  // Character name if applicable
  region        String?  // Region identifier
  subRegion     String?  // Sub-region identifier
  capturedAt    DateTime @default(now())
  entryCount    Int      // Number of entries in this snapshot

  entries       LeaderboardEntry[]

  @@index([activityType, rankingType, capturedAt])
}
```

### Table: `LeaderboardEntry`
Stores individual player rankings
```prisma
model LeaderboardEntry {
  id            String   @id @default(cuid())
  snapshotId    String
  rank          Int
  playerName    String
  score         Int
  clan          String?
  additionalData Json?   // Flexible field for activity-specific data

  snapshot      LeaderboardSnapshot @relation(fields: [snapshotId], references: [id], onDelete: Cascade)

  @@index([snapshotId, rank])
  @@index([playerName])
}
```

### Table: `ApiKey`
Stores API keys for authentication
```prisma
model ApiKey {
  id          String   @id @default(cuid())
  key         String   @unique
  name        String   // Description (e.g., "Leaderboard Capture Bot")
  isActive    Boolean  @default(true)
  lastUsedAt  DateTime?
  createdAt   DateTime @default(now())

  @@index([key])
}
```

---

## Frontend Display

### Leaderboard Page: `/leaderboards`

**Features**:
- Dropdown filters:
  - Activity Type
  - Ranking Type (Server/Regional)
  - Character (for applicable activities)
  - Region/Sub-region (for regional rankings)
- Display current rankings in table format
- Show "Last Updated: X minutes ago"
- Real-time search/filter
- Pagination (100 entries per page)

**URL Structure**:
```
/leaderboards/power?character=ikora&type=server
/leaderboards/expanse-eternity?type=regional&region=na&subregion=us-east
/leaderboards/calamity-ops?type=server
```

---

## Capture Tool Project (Separate Repo)

### Tech Stack Recommendation:
- **Python** with:
  - `pyautogui` - Screen navigation and clicking
  - `pytesseract` - OCR for text extraction
  - `opencv-python` - Image processing
  - `requests` - API calls to website
  - `time` - Delays between actions

### Project Structure:
```
destiny-leaderboard-capture/
├── config.json          # Game navigation settings, API endpoint
├── main.py              # Main orchestration script
├── navigation.py        # Game UI navigation logic
├── ocr.py              # Screenshot capture and OCR
├── api_client.py       # POST data to website
├── regions.json        # List of regions/sub-regions to cycle
├── activities.json     # List of activities and their settings
└── README.md
```

### Configuration File Example:
```json
{
  "apiEndpoint": "https://yourdomain.com/api/leaderboard/update",
  "apiKey": "your-secure-api-key",
  "gameWindowTitle": "Destiny Rising",
  "captureDelay": 2.0,
  "ocrLanguage": "eng",
  "activities": {
    "power": {
      "hasCharacterFilter": true,
      "characters": ["Ikora", "Zavala", "Cayde", ...]
    },
    "expanse_eternity": {
      "hasCharacterFilter": false
    }
  },
  "regions": [
    {
      "name": "North America",
      "subRegions": ["US East", "US West", "Canada"]
    },
    {
      "name": "Europe",
      "subRegions": ["UK", "Germany", "France"]
    }
  ]
}
```

---

## Implementation Phases

### Phase 1: Website Backend (This Week)
- [ ] Add Prisma schema for leaderboards
- [ ] Create API endpoint for receiving data
- [ ] Add API key authentication system
- [ ] Test with manual POST requests

### Phase 2: Frontend Display (This Week)
- [ ] Create leaderboard display page
- [ ] Add filtering and search
- [ ] Show last updated timestamp
- [ ] Implement pagination

### Phase 3: Capture Tool (Separate Project)
- [ ] Create new GitHub repository
- [ ] Implement game navigation logic
- [ ] Implement OCR extraction
- [ ] Test end-to-end data flow
- [ ] Add error handling and retry logic
- [ ] Schedule automated runs (e.g., every 6 hours)

---

## Security Considerations

1. **API Key Rotation**: Ability to regenerate keys if compromised
2. **Rate Limiting**: Prevent API abuse
3. **Data Validation**: Ensure incoming data matches expected format
4. **HTTPS Only**: All API communication over encrypted connection
5. **IP Whitelisting**: Optional - only allow requests from known IPs

---

## Maintenance & Updates

### Data Retention:
- Keep last 30 days of snapshots
- Archive older data or summarize into "historical rankings"
- Clean up old entries to prevent database bloat

### Monitoring:
- Track API usage and errors
- Alert if no data received for >12 hours
- Monitor OCR accuracy rates

---

## Next Steps

1. Get approval on this architecture
2. Implement database schema in this project
3. Create API endpoint
4. Test with sample data
5. Create separate GitHub repo for capture tool
6. Iterate on OCR accuracy
