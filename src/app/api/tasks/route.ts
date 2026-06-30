import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (categoryId) where.categoryId = categoryId
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const tasks = await db.task.findMany({
      where,
      include: { category: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, priority, dueDate, categoryId } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const maxOrder = await db.task.findFirst({
      where: { status: status || 'TODO' },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const task = await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        categoryId: categoryId || null,
        order: (maxOrder?.order ?? -1) + 1,
      },
      include: { category: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
