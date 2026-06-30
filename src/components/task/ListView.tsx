'use client'

import { motion } from 'framer-motion'
import { useTaskStore, type Task } from '@/store/taskStore'
import TaskCard from './TaskCard'
import { Skeleton } from '@/components/ui/skeleton'

export default function ListView() {
  const { tasks, isLoading, deleteTask } = useTaskStore()

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    const pDiff = (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4)
    if (pDiff !== 0) return pDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => {}}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {sortedTasks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-1">No tasks found</p>
              <p className="text-sm">Create a new task to get started</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}