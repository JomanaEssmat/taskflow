'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Plus, Trash2,
  LayoutGrid, List, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useTaskStore, type TaskPriority } from '@/store/taskStore'

const PRESET_COLORS = ['#a855f7', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e', '#ec4899', '#8b5cf6', '#14b8a6']

export default function Sidebar() {
  const {
    categories, sidebarOpen, setSidebarOpen,
    filterCategory, setFilterCategory,
    filterPriority, setFilterPriority,
    activeView, setActiveView,
    fetchCategories, createCategory, deleteCategory,
  } = useTaskStore()

  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    await createCategory(newCatName.trim(), newCatColor)
    setNewCatName('')
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-card border-r border-border flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">TaskFlow</h2>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            <Separator />

            <ScrollArea className="flex-1">
              {/* Views */}
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">View</p>
                <div className="space-y-1">
                  {[
                    { id: 'dashboard' as const, icon: LayoutDashboard, label: 'Dashboard' },
                    { id: 'board' as const, icon: LayoutGrid, label: 'Board' },
                    { id: 'list' as const, icon: List, label: 'List' },
                  ].map(v => (
                    <button
                      key={v.id}
                      onClick={() => { setActiveView(v.id); setSidebarOpen(false) }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeView === v.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <v.icon className="w-4 h-4" />
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="mx-4" />

              {/* Priority Filter */}
              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Priority</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilterPriority(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !filterPriority ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    All Priorities
                  </button>
                  {([
                    { value: 'URGENT' as TaskPriority, label: 'Urgent', color: 'bg-red-500' },
                    { value: 'HIGH' as TaskPriority, label: 'High', color: 'bg-orange-500' },
                    { value: 'MEDIUM' as TaskPriority, label: 'Medium', color: 'bg-amber-500' },
                    { value: 'LOW' as TaskPriority, label: 'Low', color: 'bg-emerald-500' },
                  ]).map(p => (
                    <button
                      key={p.value}
                      onClick={() => setFilterPriority(p.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                        filterPriority === p.value ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="mx-4" />

              {/* Categories */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Categories</p>
                </div>

                <div className="space-y-1 mb-4">
                  <button
                    onClick={() => setFilterCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !filterCategory ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    All Tasks
                  </button>
                  {categories.map(cat => (
                    <div key={cat.id} className="group flex items-center">
                      <button
                        onClick={() => { setFilterCategory(cat.id); setSidebarOpen(false) }}
                        className={`flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          filterCategory === cat.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="flex-1 truncate">{cat.name}</span>
                        <span className="text-xs opacity-50">{cat._count?.tasks || 0}</span>
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Category */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      placeholder="New category"
                      className="h-8 text-sm"
                      onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleAddCategory}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewCatColor(c)}
                        className={`w-5 h-5 rounded-full transition-transform ${newCatColor === c ? 'scale-125 ring-2 ring-offset-2 ring-offset-card' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c, ringColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}