'use client'

import { useState } from 'react'
import { useTaskStore, type Task, type TaskStatus, type TaskPriority } from '@/store/taskStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
]

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  URGENT: 'bg-red-500/10 text-red-400 border-red-500/20',
}

interface TaskFormProps {
  task: Task | null
  defaultStatus: TaskStatus
  onSubmit: (data: {
    title: string
    description: string | null
    status: TaskStatus
    priority: TaskPriority
    dueDate: string | null
    categoryId: string | null
  }) => Promise<void>
  onCancel: () => void
}

function TaskForm({ task, defaultStatus, onSubmit, onCancel }: TaskFormProps) {
  const { categories, fetchCategories } = useTaskStore()

  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<TaskStatus>(task?.status || defaultStatus)
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'MEDIUM')
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '')
  const [categoryId, setCategoryId] = useState<string>(task?.categoryId || 'none')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Ensure categories are loaded for the select
  if (categories.length === 0) {
    fetchCategories()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      dueDate: dueDate || null,
      categoryId: categoryId === 'none' ? null : categoryId,
    })
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          className="bg-secondary/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-desc">Description</Label>
        <Textarea
          id="task-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Add details..."
          rows={3}
          className="bg-secondary/50 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      p.value === 'LOW' ? 'bg-emerald-500' :
                      p.value === 'MEDIUM' ? 'bg-amber-500' :
                      p.value === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
                    }`} />
                    {p.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="task-due">Due Date</Label>
          <Input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="bg-secondary/50"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || isSubmitting}>
          {task ? 'Update' : 'Create'} Task
        </Button>
      </div>
    </form>
  )
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  defaultStatus?: TaskStatus
}

export default function TaskDialog({ open, onOpenChange, task, defaultStatus }: TaskDialogProps) {
  const { createTask, updateTask } = useTaskStore()

  const handleSubmit = async (data: Parameters<typeof createTask>[0]) => {
    if (task) {
      await updateTask(task.id, data)
    } else {
      await createTask(data)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        {/* key forces remount when task changes, resetting all form state */}
        <TaskForm
          key={task?.id ?? `new-${defaultStatus ?? 'TODO'}`}
          task={task ?? null}
          defaultStatus={defaultStatus ?? 'TODO'}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export { PRIORITY_COLORS, PRIORITIES, STATUSES }