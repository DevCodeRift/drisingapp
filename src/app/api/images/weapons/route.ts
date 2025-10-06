import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'images', 'weapons');

    // Read all files in the weapons directory
    const files = fs.readdirSync(imagesDirectory);

    // Filter for image files only
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext);
    });

    // Map to full URL paths
    const images = imageFiles.map(file => ({
      name: file,
      url: `/images/weapons/${file}`
    }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error reading weapon images:', error);
    return NextResponse.json({ images: [] });
  }
}
