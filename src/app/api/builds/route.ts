import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/builds - Fetch builds with optional filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get('characterId');
    const sortBy = searchParams.get('sortBy') || 'upvotes'; // 'upvotes' or 'recent'
    const showPrivate = searchParams.get('showPrivate') === 'true';

    const where: any = {};

    if (characterId) {
      where.characterId = characterId;
    }

    // Only show public builds unless user is requesting their own private builds
    if (!showPrivate || !session?.user?.id) {
      where.isPublic = true;
    } else if (showPrivate && session?.user?.id) {
      // Show user's own builds (both public and private)
      where.userId = session.user.id;
    }

    const builds = await prisma.build.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        character: true,
        votes: true,
        artifacts: {
          include: {
            attributes: true
          }
        },
        weapons: {
          include: {
            weapon: true,
            traits: true,
            perks: true,
            catalysts: true,
            mods: true
          }
        }
      },
      orderBy: sortBy === 'recent'
        ? { createdAt: 'desc' }
        : { voteCount: 'desc' },
    });

    return NextResponse.json(builds);
  } catch (error) {
    console.error('Error fetching builds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}

// POST /api/builds - Create a new build with all components
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, characterId, content, isPublic, artifacts, primaryWeapon, powerWeapon } = body;

    if (!title || !characterId) {
      return NextResponse.json(
        { error: 'Missing required fields (title, characterId)' },
        { status: 400 }
      );
    }

    // Create build with all nested components
    const build = await prisma.build.create({
      data: {
        title,
        description: description || '',
        characterId,
        content: content || '',
        isPublic: isPublic ?? true,
        userId: session.user.id,

        // Create artifacts with their attributes
        artifacts: {
          create: (artifacts || []).map((artifact: any) => ({
            slot: artifact.slot,
            artifactName: artifact.artifactName,
            rarity: artifact.rarity,
            power: artifact.power || 0,
            gearLevel: artifact.gearLevel || 0,
            enhancementLevel: artifact.enhancementLevel || 0,
            attributes: {
              create: (artifact.attributes || [])
                .filter((attr: any) => attr.name) // Only create attributes with names
                .map((attr: any) => ({
                  name: attr.name,
                  description: attr.description || ''
                }))
            }
          }))
        },

        // Create weapons with their components
        weapons: {
          create: [primaryWeapon, powerWeapon]
            .filter((w: any) => w && (w.weaponId || w.customName)) // Only create if weapon is configured
            .map((weapon: any) => ({
              weaponId: weapon.weaponId || null,
              slot: weapon.slot,
              customName: weapon.customName || null,
              gearLevel: weapon.gearLevel || 0,
              enhancementLevel: weapon.enhancementLevel || 0,

              // Create traits
              traits: {
                create: (weapon.traits || [])
                  .filter((t: any) => t.name)
                  .map((t: any) => ({
                    name: t.name,
                    description: t.description || null,
                    effect: t.effect || null
                  }))
              },

              // Create perks
              perks: {
                create: (weapon.perks || [])
                  .filter((p: any) => p.name)
                  .map((p: any) => ({
                    name: p.name,
                    description: p.description || null,
                    effect: p.effect || null
                  }))
              },

              // Create catalysts
              catalysts: {
                create: (weapon.catalysts || [])
                  .filter((c: any) => c.name)
                  .map((c: any) => ({
                    name: c.name,
                    description: c.description || null,
                    effect: c.effect || null
                  }))
              },

              // Create mods (only for non-Exotic weapons)
              mods: {
                create: (weapon.mods || [])
                  .filter((m: any) => m.name)
                  .map((m: any) => ({
                    name: m.name,
                    description: m.description || null,
                    effect: m.effect || null
                  }))
              }
            }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        character: true,
        artifacts: {
          include: {
            attributes: true
          }
        },
        weapons: {
          include: {
            weapon: true,
            traits: true,
            perks: true,
            catalysts: true,
            mods: true
          }
        }
      },
    });

    return NextResponse.json({ build });
  } catch (error) {
    console.error('Error creating build:', error);
    return NextResponse.json(
      { error: 'Failed to create build', message: (error as Error).message },
      { status: 500 }
    );
  }
}
