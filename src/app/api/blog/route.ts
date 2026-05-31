import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
    const body = await request.json();
    const { title, slug, excerpt, content, category, tags, readTime, author, image, gradient } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content' },
        { status: 400 },
      );
    }

    // Check if slug already exists
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 },
      );
    }

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content: typeof content === 'string' ? content : JSON.stringify(content),
        category: category || 'General',
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        readTime: readTime || '5 min read',
        author: author || 'Upam',
        image: image || '/blog/default.png',
        gradient: gradient || 'from-teal-500 to-cyan-500',
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
