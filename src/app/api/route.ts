import { NextResponse } from "next/server";

// This is a health check endpoint only. No sensitive data exposed.
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}

// Block all other methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
