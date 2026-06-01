import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/portal/files — List files for client
export async function GET(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const projectId = searchParams.get('projectId');

    const where: Record<string, unknown> = { clientId: client.id };
    if (category) where.category = category;
    if (projectId) where.projectId = projectId;

    const files = await db.fileUpload.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Files list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// POST /api/portal/files — Upload file
export async function POST(request: NextRequest) {
  try {
    const { client } = await requireAuth(request);
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeName}`;
    const filepath = `/uploads/${uniqueFilename}`;

    // Save to public/uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await writeFile(join(uploadDir, uniqueFilename), buffer);

    // Record in DB
    const fileRecord = await db.fileUpload.create({
      data: {
        filename: file.name,
        filepath,
        filetype: file.type,
        filesize: file.size,
        category,
        projectId: projectId || null,
        clientId: client.id,
      },
    });

    return NextResponse.json(
      { success: true, data: fileRecord, message: 'File uploaded successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
