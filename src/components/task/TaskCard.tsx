'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { GripVertical, Calendar, Pencil, Trash2, CheckCircle2, Circle, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTaskStore, type Task, type TaskStatus, type TaskPriority } from '@/store/taskStore'
import { PRIORITY_COLORS } from './TaskDialog'

const STATUS_CONFIG: Record<TaskStatus, { icon: typeof Circle; color: string; label: string }> = {
  TODO: { icon: Circle, color: 'text-muted-foreground', label: 'To Do' },
  IN_PROGRESS: { icon: Clock, color: 'text-amber-400', label: 'In Progress' },
  REVIEW: { icon: Eye, color: 'text-blue-400', label: 'Review' },
  DONE: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Done' },
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'REVIEW',
  REVIEW: 'DONE',
  DONE: 'TODO',
}

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

  if (days < 0) return { text: `${Math.abs(days)}d overdue`, className: 'text-red-400' }
  if (days === 0) return { text: 'Today', className: 'text-amber-400' }
  if (days === 1) return { text: 'Tomorrow', className: 'text-amber-400' }
  if (days <= 7) return { text: `${days}d left`, className: 'text-muted-foreground' }
  return { text: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), className: 'text-muted-foreground' }
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task
  onEdit: () => void
  onDelete: () => void
}) {
  const { moveTask, fetchTasks } = useTaskStore()
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  const statusConfig = STATUS_CONFIG[task.status]
  const StatusIcon = statusConfig.icon
  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null
  const isDone = task.status === 'DONE'

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await moveTask(task.id, NEXT_STATUS[task.status])
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className={`group relative bg-card border border-border/50 rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-colors ${
        isDone ? 'opacity-60' : ''
      } ${isDragging ? 'shadow-2xl shadow-primary/10' : ''}`}
      onClick={onEdit}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-3 left-2 p-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity cursor-grab active:cursor-grabbing"
        onClick={e => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="pl-4">
        {/* Top row */}
        <div className="flex items-start gap-2 mb-2">
          <button
            onClick={handleStatusToggle}
            className="mt-0.5 shrink-0"
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          </button>
          <span className={`text-sm font-medium flex-1 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 pl-6 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-2 pl-6 flex-wrap">
          {/* Priority */}
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${PRIORITY_COLORS[task.priority]}`}
          >
            {task.priority}
          </Badge>

          {/* Category */}
          {task.category && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 gap-1"
              style={{ borderColor: task.category.color + '40', color: task.category.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: task.category.color }}
              />
              {task.category.name}
            </Badge>
          )}

          {/* Due date */}
          {dueInfo && (
            <span className={`text-[10px] flex items-center gap-1 ${dueInfo.className}`}>
              <Calendar className="w-3 h-3" />
              {dueInfo.text}
            </span>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={e => { e.stopPropagation(); onEdit() }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); onDelete() }}
              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export { STATUS_CONFIG, formatDueDate }