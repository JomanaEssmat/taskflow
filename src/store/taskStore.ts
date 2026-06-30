'use client'

import { create } from 'zustand'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Category {
  id: string
  name: string
  color: string
  _count?: { tasks: number }
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  categoryId: string | null
  order: number
  createdAt: string
  updatedAt: string
  category: Category | null
}

interface TaskStore {
  tasks: Task[]
  categories: Category[]
  isLoading: boolean
  searchQuery: string
  filterPriority: TaskPriority | null
  filterCategory: string | null
  activeView: 'board' | 'list'
  sidebarOpen: boolean

  // Actions
  setSearchQuery: (q: string) => void
  setFilterPriority: (p: TaskPriority | null) => void
  setFilterCategory: (id: string | null) => void
  setActiveView: (v: 'board' | 'list') => void
  setSidebarOpen: (open: boolean) => void
  fetchTasks: () => Promise<void>
  fetchCategories: () => Promise<void>
  createTask: (data: Partial<Task>) => Promise<Task | null>
  updateTask: (id: string, data: Partial<Task>) => Promise<Task | null>
  deleteTask: (id: string) => Promise<boolean>
  moveTask: (taskId: string, newStatus: TaskStatus) => Promise<boolean>
  createCategory: (name: string, color: string) => Promise<Category | null>
  deleteCategory: (id: string) => Promise<boolean>
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error('API error')
  return res.json()
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  categories: [],
  isLoading: false,
  searchQuery: '',
  filterPriority: null,
  filterCategory: null,
  activeView: 'board',
  sidebarOpen: false,

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterPriority: (p) => set({ filterPriority: p }),
  setFilterCategory: (id) => set({ filterCategory: id }),
  setActiveView: (v) => set({ activeView: v }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const params = new URLSearchParams()
      const { searchQuery, filterPriority, filterCategory } = get()
      if (searchQuery) params.set('search', searchQuery)
      if (filterPriority) params.set('priority', filterPriority)
      if (filterCategory) params.set('categoryId', filterCategory)
      const query = params.toString()
      const tasks = await apiFetch(`/api/tasks${query ? `?${query}` : ''}`)
      set({ tasks, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await apiFetch('/api/categories')
      set({ categories })
    } catch { /* ignore */ }
  },

  createTask: async (data) => {
    try {
      const task = await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      const { fetchTasks } = get()
      fetchTasks()
      return task
    } catch {
      return null
    }
  },

  updateTask: async (id, data) => {
    try {
      const task = await apiFetch(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      const { fetchTasks } = get()
      fetchTasks()
      return task
    } catch {
      return null
    }
  },

  deleteTask: async (id) => {
    try {
      await apiFetch(`/api/tasks/${id}`, { method: 'DELETE' })
      const { fetchTasks } = get()
      fetchTasks()
      return true
    } catch {
      return false
    }
  },

  moveTask: async (taskId, newStatus) => {
    try {
      await apiFetch('/api/tasks/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ taskId, newStatus }),
      })
      const { fetchTasks } = get()
      fetchTasks()
      return true
    } catch {
      return false
    }
  },

  createCategory: async (name, color) => {
    try {
      const category = await apiFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name, color }),
      })
      const { fetchCategories } = get()
      fetchCategories()
      return category
    } catch {
      return null
    }
  },

  deleteCategory: async (id) => {
    try {
      await apiFetch(`/api/categories/${id}`, { method: 'DELETE' })
      const { fetchCategories } = get()
      fetchCategories()
      return true
    } catch {
      return false
    }
  },
}))
