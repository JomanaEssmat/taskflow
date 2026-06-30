'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, LayoutGrid, List, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTaskStore } from '@/store/taskStore'
import Sidebar from '@/components/task/Sidebar'
import Header from '@/components/task/Header'
import KanbanBoard from '@/components/task/KanbanBoard'
import ListView from '@/components/task/ListView'
import Dashboard from '@/components/task/Dashboard'
import TaskDialog from '@/components/task/TaskDialog'

type ViewType = 'board' | 'list' | 'dashboard'

export default function Home() {
  const {
    fetchTasks, fetchCategories,
    activeView, isLoading, tasks,
  } = useTaskStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const seedData = async () => {
    const categories = [
      { name: 'Design', color: '#ec4899' },
      { name: 'Development', color: '#a855f7' },
      { name: 'Marketing', color: '#06b6d4' },
      { name: 'Research', color: '#f59e0b' },
    ]

    const catResults: Record<string, string> = {}
    for (const cat of categories) {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      })
      if (res.ok) {
        const data = await res.json()
        catResults[cat.name] = data.id
      }
    }

    const sampleTasks = [
      { title: 'Design new landing page mockup', description: 'Create high-fidelity mockups for the new landing page with dark theme', status: 'TODO', priority: 'HIGH', categoryId: catResults['Design'] },
      { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'IN_PROGRESS', priority: 'URGENT', categoryId: catResults['Development'], dueDate: new Date(Date.now() + 2 * 86400000).toISOString() },
      { title: 'Write API documentation', description: 'Document all REST endpoints with examples using OpenAPI spec', status: 'TODO', priority: 'MEDIUM', categoryId: catResults['Development'] },
      { title: 'User research interviews', description: 'Conduct 5 user interviews for the new feature feedback', status: 'IN_PROGRESS', priority: 'HIGH', categoryId: catResults['Research'], dueDate: new Date(Date.now() + 5 * 86400000).toISOString() },
      { title: 'Fix navigation bug on mobile', description: 'The hamburger menu is not closing after link click on iOS Safari', status: 'REVIEW', priority: 'HIGH', categoryId: catResults['Development'] },
      { title: 'Create social media content', description: 'Design 10 social media posts for the product launch campaign', status: 'TODO', priority: 'LOW', categoryId: catResults['Marketing'], dueDate: new Date(Date.now() + 10 * 86400000).toISOString() },
      { title: 'Optimize database queries', description: 'Review and optimize slow queries in the analytics module', status: 'TODO', priority: 'MEDIUM', categoryId: catResults['Development'] },
      { title: 'Set up email marketing', description: 'Configure Mailchimp integration and create welcome email sequence', status: 'TODO', priority: 'MEDIUM', categoryId: catResults['Marketing'], dueDate: new Date(Date.now() - 1 * 86400000).toISOString() },
      { title: 'Implement dark mode toggle', description: 'Add theme switcher with system preference detection', status: 'DONE', priority: 'MEDIUM', categoryId: catResults['Development'] },
      { title: 'Competitive analysis report', description: 'Analyze top 5 competitors and document their key features', status: 'DONE', priority: 'LOW', categoryId: catResults['Research'] },
      { title: 'Redesign settings page', description: 'Simplify the settings page with better grouping and navigation', status: 'REVIEW', priority: 'MEDIUM', categoryId: catResults['Design'] },
      { title: 'Setup monitoring alerts', description: 'Configure error tracking and uptime monitoring with PagerDuty', status: 'TODO', priority: 'URGENT', categoryId: catResults['Development'], dueDate: new Date(Date.now() + 1 * 86400000).toISOString() },
    ]

    for (const task of sampleTasks) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      })
    }

    await fetchTasks()
  }

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Loading TaskFlow...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Sidebar />
      <Header onAddTask={() => setDialogOpen(true)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {activeView === 'board' && <KanbanBoard />}
          {activeView === 'list' && <ListView />}
          {activeView === 'dashboard' && <Dashboard />}
        </motion.div>
      </AnimatePresence>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Dashboard FAB (mobile) */}
      {activeView !== 'dashboard' && (
        <Button
          onClick={() => useTaskStore.getState().setActiveView('dashboard')}
          className="fixed bottom-6 right-6 rounded-full h-12 w-12 shadow-lg shadow-primary/20 sm:hidden"
          size="icon"
          variant="outline"
        >
          <LayoutDashboard className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}