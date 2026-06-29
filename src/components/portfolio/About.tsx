'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Palette, Box, Zap } from 'lucide-react'

const stats = [
  { value: '50+', label: 'Projects Completed' },
  { value: '5+', label: 'Years Experience' },
  { value: '30+', label: 'Happy Clients' },
  { value: '10+', label: 'Awards Won' },
]

const highlights = [
  {
    icon: Code2,
    title: 'Frontend Development',
    description: 'Building responsive, performant web applications with modern frameworks.',
    color: 'text-purple-400',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive and visually stunning user interfaces.',
    color: 'text-cyan-400',
  },
  {
    icon: Box,
    title: '3D & Creative Coding',
    description: 'Crafting immersive 3D experiences with Three.js and WebGL.',
    color: 'text-violet-400',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Ensuring blazing-fast load times and smooth interactions.',
    color: 'text-amber-400',
  },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="section-divider mb-24 sm:mb-32" />
      
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest">About Me</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Turning <span className="gradient-text">Vision</span> Into Reality
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            I&apos;m a passionate creative developer who bridges the gap between design and technology. 
            With expertise in modern web development and 3D graphics, I create digital experiences 
            that captivate and inspire.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="glass rounded-2xl p-6 text-center gradient-border"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="glass rounded-2xl p-6 group hover:bg-secondary/60 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}