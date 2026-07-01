'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTaskStore, type Task } from '@/store/taskStore'
import TaskCard from './TaskCard'
import TaskDialog from './TaskDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ListView() {
  const { tasks, isLoading, deleteTask } = useTaskStore()

  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by status order: IN_PROGRESS, TODO, REVIEW, DONE
    const statusOrder: Record<string, number> = { IN_PROGRESS: 0, TODO: 1, REVIEW: 2, DONE: 3 }
    const sDiff = (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4)
    if (sDiff !== 0) return sDiff
    // Then by priority
    const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    const pDiff = (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4)
    if (pDiff !== 0) return pDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

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
              onEdit={() => handleEditTask(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
          {sortedTasks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-1">No tasks found</p>
              <p className="text-sm">Create a new task to get started</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => { setEditingTask(null); setDialogOpen(true) }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
      />
    </div>
  )
}