import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, color } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const category = await db.category.create({
      data: {
        name: name.trim(),
        color: color || '#a855f7',
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}