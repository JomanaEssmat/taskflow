'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { useTaskStore, type Task, type TaskStatus } from '@/store/taskStore'
import KanbanColumn from './KanbanColumn'
import TaskDialog from './TaskDialog'

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

export default function KanbanBoard() {
  const {
    tasks, isLoading,
    fetchTasks, moveTask, deleteTask,
  } = useTaskStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('TODO')
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(event.active.data.current?.task ?? null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const currentTask = tasks.find(t => t.id === taskId)
    if (!currentTask) return

    // Dropped on a column
    if (STATUSES.includes(over.id as TaskStatus)) {
      const newStatus = over.id as TaskStatus
      if (currentTask.status !== newStatus) {
        await moveTask(taskId, newStatus)
      }
      return
    }

    // Dropped on another task
    const overTask = tasks.find(t => t.id === over.id)
    if (overTask && overTask.status !== currentTask.status) {
      await moveTask(taskId, overTask.status)
    }
  }

  const handleAddTask = (status?: TaskStatus) => {
    setEditingTask(null)
    setDefaultStatus(status || 'TODO')
    setDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setDefaultStatus(task.status)
    setDialogOpen(true)
  }

  const handleDeleteTask = async (task: Task) => {
    await deleteTask(task.id)
  }

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6">
          <div className="flex gap-4 sm:gap-6 h-full min-h-0">
            {STATUSES.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getColumnTasks(status)}
                onAddTask={() => handleAddTask(status)}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[280px] bg-card border border-primary/30 rounded-xl p-4 shadow-2xl shadow-primary/10 opacity-80">
              <span className="text-sm font-medium">{activeTask.title}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}