import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const build = await prisma.build.findUnique({
      where: { id },
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
          },
          orderBy: {
            slot: 'asc'
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

    if (!build) {
      return NextResponse.json(
        { error: 'Build not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(build);
  } catch (error) {
    console.error('Error fetching build:', error);
    return NextResponse.json(
      { error: 'Failed to fetch build' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if build exists and user owns it
    const existingBuild = await prisma.build.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingBuild) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    if (existingBuild.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, characterId, content, isPublic, artifacts, primaryWeapon, powerWeapon } = body;

    if (!title || !characterId) {
      return NextResponse.json(
        { error: 'Missing required fields (title, characterId)' },
        { status: 400 }
      );
    }

    // Delete existing artifacts and weapons
    await prisma.buildArtifact.deleteMany({ where: { buildId: id } });
    await prisma.buildWeapon.deleteMany({ where: { buildId: id } });

    // Update build with new data
    const build = await prisma.build.update({
      where: { id },
      data: {
        title,
        description: description || '',
        characterId,
        content: content || '',
        isPublic: isPublic ?? true,

        // Create new artifacts with their attributes
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
                .filter((attr: any) => attr.name)
                .map((attr: any) => ({
                  name: attr.name,
                  description: attr.description || ''
                }))
            }
          }))
        },

        // Create new weapons with their components
        weapons: {
          create: [primaryWeapon, powerWeapon]
            .filter((w: any) => w && (w.weaponId || w.customName))
            .map((weapon: any) => ({
              weaponId: weapon.weaponId || null,
              slot: weapon.slot,
              customName: weapon.customName || null,
              gearLevel: weapon.gearLevel || 0,
              enhancementLevel: weapon.enhancementLevel || 0,

              traits: {
                create: (weapon.traits || [])
                  .filter((t: any) => t.name)
                  .map((t: any) => ({
                    name: t.name,
                    description: t.description || null,
                    effect: t.effect || null
                  }))
              },

              perks: {
                create: (weapon.perks || [])
                  .filter((p: any) => p.name)
                  .map((p: any) => ({
                    name: p.name,
                    description: p.description || null,
                    effect: p.effect || null
                  }))
              },

              catalysts: {
                create: (weapon.catalysts || [])
                  .filter((c: any) => c.name)
                  .map((c: any) => ({
                    name: c.name,
                    description: c.description || null,
                    effect: c.effect || null
                  }))
              },

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
    console.error('Error updating build:', error);
    return NextResponse.json(
      { error: 'Failed to update build', message: (error as Error).message },
      { status: 500 }
    );
  }
}
