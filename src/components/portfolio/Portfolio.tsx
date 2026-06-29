'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Project {
  id: number
  title: string
  category: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Nebula Dashboard',
    category: 'Web Development',
    description: 'A modern analytics dashboard with real-time data visualization and dark mode support.',
    longDescription: 'Built a comprehensive analytics dashboard featuring real-time data streaming, interactive charts, and a sleek dark interface. The project showcases advanced state management and responsive design patterns.',
    image: '/images/project-web.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'D3.js'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 2,
    title: 'Crystal Dimensions',
    category: '3D Art & WebGL',
    description: 'An immersive 3D art experience featuring crystalline structures and volumetric lighting.',
    longDescription: 'Created an interactive 3D art piece using Three.js and custom shaders. Features include procedural geometry generation, post-processing effects, and responsive controls for exploring the virtual space.',
    image: '/images/project-3d.png',
    tags: ['Three.js', 'GLSL', 'WebGL', 'React Three Fiber'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 3,
    title: 'FinFlow Mobile',
    category: 'Mobile App Design',
    description: 'A fintech mobile application with intuitive UX and beautiful micro-interactions.',
    longDescription: 'Designed and developed a mobile-first fintech application with focus on user experience. Features include smooth animations, gesture-based navigation, and a cohesive design system.',
    image: '/images/project-mobile.png',
    tags: ['React Native', 'Figma', 'Lottie', 'Framer Motion'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
  },
  {
    id: 4,
    title: 'Luxe Brand Identity',
    category: 'Brand Design',
    description: 'Complete brand identity system including logo, typography, and visual guidelines.',
    longDescription: 'Developed a comprehensive brand identity for a luxury tech startup. The project included logo design, color system, typography selection, and a complete brand guidelines document.',
    image: '/images/project-brand.png',
    tags: ['Figma', 'Illustrator', 'Brand Strategy', 'Design System'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
  },
]

const categories = ['All', ...new Set(projects.map(p => p.category))]

export default function Portfolio() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative">
      <div className="section-divider mb-24 sm:mb-32" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest">Portfolio</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A curated selection of my recent work spanning web development, 3D art, and creative design.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground glow-purple'
                  : 'glass-light text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              layout
              className="group"
            >
              <ProjectCard
                project={project}
                onSelect={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl glass border-border/50 bg-card/95 backdrop-blur-xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{selectedProject.category}</Badge>
                  {selectedProject.featured && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Featured</Badge>
                  )}
                </div>
                <DialogTitle className="text-2xl">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-muted-foreground leading-relaxed">
                  {selectedProject.longDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="relative rounded-xl overflow-hidden mt-4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedProject.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href={selectedProject.liveUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
                <a
                  href={selectedProject.githubUrl}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    setRotateX((y - centerY) / 15)
    setRotateY((centerX - x) / 15)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotateX(0)
    setRotateY(0)
    setIsHovering(false)
  }, [])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      className="relative rounded-2xl overflow-hidden cursor-pointer glass group"
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovering ? 1.02 : 1})`,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        {/* Hover overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovering ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              <Eye className="w-4 h-4" />
              View Details
            </span>
          </div>
        </motion.div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge className="glass text-xs" variant="secondary">{project.category}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" style={{ transform: 'translateZ(20px)' }}>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Glow border on hover */}
      {isHovering && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none glow-purple" />
      )}
    </div>
  )
}