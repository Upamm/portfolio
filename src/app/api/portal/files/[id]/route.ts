import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

// DELETE /api/portal/files/[id] — Delete a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client } = await requireAuth(request);
    const { id } = await params;

    const file = await db.fileUpload.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Clients can only delete their own files
    if (file.clientId !== client.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete physical file from public/uploads
    if (file.filepath) {
      const filename = file.filepath.replace('/uploads/', '');
      const fullPath = join(process.cwd(), 'public', 'uploads', filename);
      try {
        await unlink(fullPath);
      } catch {
        // File might not exist on disk, continue with DB deletion
      }
    }

    // Delete from database
    await db.fileUpload.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('File delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
