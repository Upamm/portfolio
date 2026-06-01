import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

// GET /api/blog — fetch all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    const where = category && category !== 'All'
      ? { category, published: true }
      : { published: true };

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 },
    );
  }
}

// POST /api/blog — create a new blog post
export async function POST(request: NextRequest) {
  try {
    // Simple auth check — require admin role via authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }
    const token = authHeader.substring(7);
    const { verifySession } = await import('@/lib/auth');
    const session = verifySession(token);
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, slug, excerpt, content, category, tags, readTime, author, image, gradient } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(typeof title === 'string' ? title : '');
    const sanitizedSlug = sanitizeInput(typeof slug === 'string' ? slug : '').replace(/\s+/g, '-').toLowerCase();

    // Check if slug already exists
    const existing = await db.blogPost.findUnique({ where: { slug: sanitizedSlug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 },
      );
    }

    const post = await db.blogPost.create({
      data: {
        title: sanitizedTitle,
        slug: sanitizedSlug,
        excerpt: sanitizeInput(excerpt || ''),
        content: typeof content === 'string' ? sanitizeInput(content) : JSON.stringify(content),
        category: sanitizeInput(category || 'General'),
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        readTime: sanitizeInput(readTime || '5 min read'),
        author: sanitizeInput(author || 'Upam'),
        image: sanitizeInput(image || '/blog/default.png'),
        gradient: sanitizeInput(gradient || 'from-teal-500 to-cyan-500'),
        published: true,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 },
    );
  }
}
