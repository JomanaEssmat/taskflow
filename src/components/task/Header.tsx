'use client'

import { Search, Plus, Menu, LayoutGrid, List, LayoutDashboard, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTaskStore } from '@/store/taskStore'

export default function Header({ onAddTask }: { onAddTask: () => void }) {
  const { searchQuery, setSearchQuery, activeView, setActiveView, setSidebarOpen, tasks } = useTaskStore()

  const doneCount = tasks.filter(t => t.status === 'DONE').length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  const views = [
    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'board' as const, icon: LayoutGrid, label: 'Board' },
    { id: 'list' as const, icon: List, label: 'List' },
  ]

  return (
    <header className="h-16 border-b border-border flex items-center gap-4 px-4 sm:px-6 bg-card/80 backdrop-blur-sm sticky top-0 z-30 shrink-0">
      {/* Menu button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className="shrink-0"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Progress pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span className="text-muted-foreground">
          <span className="text-foreground font-medium">{progress}%</span> complete
        </span>
        <span className="text-muted-foreground/50">({doneCount}/{totalCount})</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 h-9 bg-secondary/50 border-transparent focus:border-primary/50"
          />
        </div>
      </div>

      {/* View toggle */}
      <div className="hidden sm:flex items-center bg-secondary rounded-lg p-1">
        {views.map(v => (
          <Button
            key={v.id}
            variant={activeView === v.id ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setActiveView(v.id)}
            title={v.label}
          >
            <v.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Add task */}
      <Button onClick={onAddTask} className="shrink-0">
        <Plus className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Add Task</span>
      </Button>
    </header>
  )
}