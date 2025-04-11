import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'public/weather-icons');
    const files = fs.readdirSync(iconsDir);

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read weather icons directory' },
      { status: 500 }
    );
  }
} 