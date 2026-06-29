'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Skill {
  name: string
  level: number
  category: string
}

const skills: Skill[] = [
  { name: 'React / Next.js', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'Three.js / WebGL', level: 85, category: '3D & Creative' },
  { name: 'Tailwind CSS', level: 95, category: 'Frontend' },
  { name: 'Framer Motion', level: 88, category: 'Animation' },
  { name: 'Node.js', level: 82, category: 'Backend' },
  { name: 'GLSL Shaders', level: 75, category: '3D & Creative' },
  { name: 'Figma / Design', level: 85, category: 'Design' },
  { name: 'Blender', level: 70, category: '3D & Creative' },
  { name: 'PostgreSQL / Prisma', level: 80, category: 'Backend' },
]

const tools = [
  { name: 'VS Code', icon: '⌨️' },
  { name: 'Git', icon: '🔀' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Vercel', icon: '▲' },
  { name: 'Figma', icon: '🎨' },
  { name: 'Blender', icon: '🧊' },
  { name: 'Notion', icon: '📝' },
  { name: 'Terminal', icon: '💻' },
]

const categoryColors: Record<string, string> = {
  'Frontend': 'from-purple-500 to-violet-500',
  '3D & Creative': 'from-cyan-500 to-blue-500',
  'Animation': 'from-violet-500 to-purple-500',
  'Backend': 'from-amber-500 to-orange-500',
  'Design': 'from-pink-500 to-rose-500',
}

export default function Skills() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="section-divider mb-24 sm:mb-32" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest">Skills</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            My <span className="gradient-text">Toolkit</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Technologies and tools I use to bring creative visions to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Bars */}
          <div className="lg:col-span-2 space-y-5">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.06 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                      {skill.category}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-primary">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: 0.4 + index * 0.06, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category] || 'from-purple-500 to-violet-500'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tools Grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass rounded-2xl p-6 gradient-border"
            >
              <h3 className="text-lg font-semibold mb-6">Tools & Software</h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm font-medium">{tool.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Experience Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass rounded-2xl p-6 mt-6 gradient-border"
            >
              <h3 className="text-lg font-semibold mb-4">Experience</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Senior Creative Developer</div>
                      <div className="text-sm text-muted-foreground">Freelance</div>
                    </div>
                    <span className="text-xs text-primary font-mono">2022 - Now</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Frontend Developer</div>
                      <div className="text-sm text-muted-foreground">Tech Studio</div>
                    </div>
                    <span className="text-xs text-primary font-mono">2020 - 2022</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">Junior Developer</div>
                      <div className="text-sm text-muted-foreground">Digital Agency</div>
                    </div>
                    <span className="text-xs text-primary font-mono">2018 - 2020</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}