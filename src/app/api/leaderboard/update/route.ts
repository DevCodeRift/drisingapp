import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
  clan?: string;
  additionalData?: any;
}

interface LeaderboardUpdateRequest {
  apiKey: string;
  activityType: string;
  rankingType: 'server' | 'regional';
  character?: string;
  region?: string;
  subRegion?: string;
  entries: LeaderboardEntry[];
  capturedAt?: string;
}

/**
 * POST /api/leaderboard/update
 *
 * Receives leaderboard data from capture tool and stores in database
 *
 * Authentication: API Key in request body
 */
export async function POST(request: NextRequest) {
  try {
    const body: LeaderboardUpdateRequest = await request.json();

    // Validate required fields
    if (!body.apiKey || !body.activityType || !body.rankingType || !body.entries) {
      return NextResponse.json(
        { error: 'Missing required fields: apiKey, activityType, rankingType, entries' },
        { status: 400 }
      );
    }

    // Authenticate API key
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: body.apiKey },
    });

    if (!apiKey || !apiKey.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive API key' },
        { status: 401 }
      );
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    // Validate activity type
    const validActivities = [
      'power',
      'expanse_eternity',
      'expanse_echoes',
      'shifting_gates',
      'acclaim_level',
      'fishing',
      'calamity_ops',
      'gauntlet_onslaught',
      'breakin',
      'menace_above',
      'issakis_tabernacle',
    ];

    if (!validActivities.includes(body.activityType)) {
      return NextResponse.json(
        { error: `Invalid activity type. Must be one of: ${validActivities.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate ranking type
    if (!['server', 'regional'].includes(body.rankingType)) {
      return NextResponse.json(
        { error: 'Invalid ranking type. Must be "server" or "regional"' },
        { status: 400 }
      );
    }

    // Validate entries
    if (!Array.isArray(body.entries) || body.entries.length === 0) {
      return NextResponse.json(
        { error: 'Entries must be a non-empty array' },
        { status: 400 }
      );
    }

    // Create snapshot with entries
    const snapshot = await prisma.leaderboardSnapshot.create({
      data: {
        activityType: body.activityType,
        rankingType: body.rankingType,
        character: body.character || null,
        region: body.region || null,
        subRegion: body.subRegion || null,
        capturedAt: body.capturedAt ? new Date(body.capturedAt) : new Date(),
        entryCount: body.entries.length,
        entries: {
          create: body.entries.map((entry) => ({
            rank: entry.rank,
            playerName: entry.playerName,
            score: entry.score,
            clan: entry.clan || null,
            additionalData: entry.additionalData || null,
          })),
        },
      },
      include: {
        entries: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        snapshotId: snapshot.id,
        entriesProcessed: snapshot.entries.length,
        message: 'Leaderboard updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
