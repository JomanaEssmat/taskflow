import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const existingTasks = await db.task.count()
    if (existingTasks > 0) {
      return NextResponse.json({ message: 'Already seeded' })
    }

    const design = await db.category.create({ data: { name: 'Design', color: '#ec4899' } })
    const dev = await db.category.create({ data: { name: 'Development', color: '#a855f7' } })
    const marketing = await db.category.create({ data: { name: 'Marketing', color: '#06b6d4' } })
    const research = await db.category.create({ data: { name: 'Research', color: '#f59e0b' } })

    const now = Date.now()
    const day = 86400000

    await db.task.createMany({
      data: [
        { title: 'Design new landing page mockup', description: 'Create high-fidelity mockups for the new landing page with dark theme', status: 'TODO', priority: 'HIGH', categoryId: design.id, order: 0 },
        { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'IN_PROGRESS', priority: 'URGENT', categoryId: dev.id, order: 0, dueDate: new Date(now + 2 * day) },
        { title: 'Write API documentation', description: 'Document all REST endpoints with examples using OpenAPI spec', status: 'TODO', priority: 'MEDIUM', categoryId: dev.id, order: 1 },
        { title: 'User research interviews', description: 'Conduct 5 user interviews for the new feature feedback', status: 'IN_PROGRESS', priority: 'HIGH', categoryId: research.id, order: 1, dueDate: new Date(now + 5 * day) },
        { title: 'Fix navigation bug on mobile', description: 'The hamburger menu is not closing after link click on iOS Safari', status: 'REVIEW', priority: 'HIGH', categoryId: dev.id, order: 0 },
        { title: 'Create social media content', description: 'Design 10 social media posts for the product launch campaign', status: 'TODO', priority: 'LOW', categoryId: marketing.id, order: 2, dueDate: new Date(now + 10 * day) },
        { title: 'Optimize database queries', description: 'Review and optimize slow queries in the analytics module', status: 'TODO', priority: 'MEDIUM', categoryId: dev.id, order: 3 },
        { title: 'Set up email marketing', description: 'Configure Mailchimp integration and create welcome email sequence', status: 'TODO', priority: 'MEDIUM', categoryId: marketing.id, order: 4, dueDate: new Date(now - 1 * day) },
        { title: 'Implement dark mode toggle', description: 'Add theme switcher with system preference detection', status: 'DONE', priority: 'MEDIUM', categoryId: dev.id, order: 0 },
        { title: 'Competitive analysis report', description: 'Analyze top 5 competitors and document their key features', status: 'DONE', priority: 'LOW', categoryId: research.id, order: 1 },
        { title: 'Redesign settings page', description: 'Simplify the settings page with better grouping and navigation', status: 'REVIEW', priority: 'MEDIUM', categoryId: design.id, order: 1 },
        { title: 'Setup monitoring alerts', description: 'Configure error tracking and uptime monitoring with PagerDuty', status: 'TODO', priority: 'URGENT', categoryId: dev.id, order: 5, dueDate: new Date(now + 1 * day) },
      ]
    })

    return NextResponse.json({ message: 'Seeded successfully', tasks: 12, categories: 4 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 })
  }
}
