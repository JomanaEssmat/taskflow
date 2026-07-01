'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2, Circle, Clock, Eye,
  TrendingUp, AlertTriangle, BarChart3, Target
} from 'lucide-react'
import { useTaskStore, type TaskStatus, type TaskPriority } from '@/store/taskStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const STATUS_ICONS = {
  TODO: Circle,
  IN_PROGRESS: Clock,
  REVIEW: Eye,
  DONE: CheckCircle2,
}

const STATUS_COLORS = {
  TODO: 'text-muted-foreground',
  IN_PROGRESS: 'text-amber-400',
  REVIEW: 'text-blue-400',
  DONE: 'text-emerald-400',
}

const STATUS_BG = {
  TODO: 'bg-muted-foreground/10',
  IN_PROGRESS: 'bg-amber-400/10',
  REVIEW: 'bg-blue-400/10',
  DONE: 'bg-emerald-400/10',
}

const PRIORITY_COLORS = {
  URGENT: 'text-red-400',
  HIGH: 'text-orange-400',
  MEDIUM: 'text-amber-400',
  LOW: 'text-emerald-400',
}

export default function Dashboard() {
  const { tasks, categories } = useTaskStore()

  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const review = tasks.filter(t => t.status === 'REVIEW').length
  const urgent = tasks.filter(t => t.priority === 'URGENT' && t.status !== 'DONE').length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'DONE') return false
    return new Date(t.dueDate) < new Date()
  }).length

  // Category distribution
  const categoryDistribution = categories.map(cat => ({
    name: cat.name,
    color: cat.color,
    count: tasks.filter(t => t.categoryId === cat.id && t.status !== 'DONE').length,
  })).filter(c => c.count > 0)

  // Priority distribution (excluding done)
  const activeTasks = tasks.filter(t => t.status !== 'DONE')
  const priorityDist: Record<string, number> = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
  activeTasks.forEach(t => { priorityDist[t.priority] = (priorityDist[t.priority] || 0) + 1 })
  const maxPriority = Math.max(...Object.values(priorityDist), 1)

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your task progress</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Tasks', value: total, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'In Progress', value: inProgress, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
            { label: 'Completed', value: done, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            { label: 'Overdue', value: overdue, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress + Status Distribution */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Completion Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-4xl font-bold">{completionRate}%</span>
                  <span className="text-sm text-muted-foreground mb-1">{done} of {total} tasks</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {([
                    { status: 'TODO' as TaskStatus, label: 'To Do', count: todo },
                    { status: 'IN_PROGRESS' as TaskStatus, label: 'In Progress', count: inProgress },
                    { status: 'REVIEW' as TaskStatus, label: 'Review', count: review },
                    { status: 'DONE' as TaskStatus, label: 'Done', count: done },
                  ]).map(item => {
                    const Icon = STATUS_ICONS[item.status]
                    const pct = total > 0 ? (item.count / total) * 100 : 0
                    return (
                      <div key={item.status} className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${STATUS_COLORS[item.status]} shrink-0`} />
                        <span className="text-sm w-24 shrink-0">{item.label}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className={`h-full rounded-full ${STATUS_BG[item.status].replace('/10', '')}`}
                            style={{
                              backgroundColor: item.status === 'TODO' ? '#71717a' :
                                item.status === 'IN_PROGRESS' ? '#fbbf24' :
                                item.status === 'REVIEW' ? '#60a5fa' : '#34d399',
                            }}
                          />
                        </div>
                        <span className="text-sm font-mono text-muted-foreground w-8 text-right">{item.count}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Priority + Categories */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Priority Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Priority Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(priorityDist).map(([priority, count]) => (
                    <div key={priority} className="flex items-center gap-3">
                      <span className={`text-xs font-medium w-16 uppercase ${PRIORITY_COLORS[priority as TaskPriority]}`}>
                        {priority}
                      </span>
                      <div className="flex-1 h-6 bg-secondary rounded-md overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxPriority) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                          className={`h-full rounded-md flex items-center justify-end pr-2 ${
                            priority === 'URGENT' ? 'bg-red-500/20' :
                            priority === 'HIGH' ? 'bg-orange-500/20' :
                            priority === 'MEDIUM' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                          }`}
                        >
                          {count > 0 && (
                            <span className="text-[10px] font-medium text-muted-foreground">{count}</span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryDistribution.length > 0 ? (
                  <div className="space-y-3">
                    {categoryDistribution.map(cat => (
                      <div key={cat.name} className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm flex-1">{cat.name}</span>
                        <span className="text-sm font-mono text-muted-foreground">{cat.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No active tasks with categories
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}