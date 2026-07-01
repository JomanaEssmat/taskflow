'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useTaskStore } from '@/store/taskStore'
import Sidebar from '@/components/task/Sidebar'
import Header from '@/components/task/Header'
import KanbanBoard from '@/components/task/KanbanBoard'
import ListView from '@/components/task/ListView'
import Dashboard from '@/components/task/Dashboard'
import TaskDialog from '@/components/task/TaskDialog'

export default function Home() {
  const {
    fetchTasks, fetchCategories,
    activeView,
  } = useTaskStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    let cancelled = false

    const init = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
      } catch {
        // ignore seed errors
      }
      await Promise.all([fetchCategories(), fetchTasks()])
      if (!cancelled) setReady(true)
    }

    init()
    return () => { cancelled = true }
  }, [fetchCategories, fetchTasks])

  // Re-fetch when filters change
  useEffect(() => {
    if (ready) {
      fetchTasks()
    }
  }, [ready, fetchTasks])

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
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
    </div>
  )
}