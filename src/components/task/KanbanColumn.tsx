'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTaskStore, type Task, type TaskStatus } from '@/store/taskStore'
import TaskCard from './TaskCard'
import { STATUS_CONFIG } from './TaskCard'

const COLUMN_STYLES: Record<TaskStatus, string> = {
  TODO: 'border-t-emerald-500/50',
  IN_PROGRESS: 'border-t-amber-500/50',
  REVIEW: 'border-t-blue-500/50',
  DONE: 'border-t-emerald-400/50',
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export default function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  const config = STATUS_CONFIG[status]

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] sm:min-w-[300px] flex-1 rounded-xl bg-secondary/30 border border-border/50 border-t-2 ${COLUMN_STYLES[status]} transition-colors ${
        isOver ? 'bg-primary/5 border-primary/30' : ''
      }`}
    >
      {/* Column header */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <config.icon className={`w-4 h-4 ${config.color}`} />
          <h3 className="font-semibold text-sm">{config.label}</h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onAddTask}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tasks */}
      <ScrollArea className="flex-1 max-h-[calc(100vh-250px)]">
        <div className="p-2 space-y-2">
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task)}
              />
            ))}
          </SortableContext>

          {tasks.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground/50">
              No tasks here yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}