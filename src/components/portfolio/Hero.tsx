'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false })

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg"
    >
      {/* Three.js Background */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            Available for freelance projects
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="block">Creative</span>
          <span className="gradient-text glow-text-purple">Developer</span>
          <span className="block text-3xl sm:text-4xl md:text-5xl mt-2 text-muted-foreground font-light">
            & 3D Artist
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I craft immersive digital experiences that blend cutting-edge web technologies 
          with stunning 3D visuals. Bringing ideas to life through code and creativity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="glow-purple bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base"
          >
            <a href="#portfolio">
              View My Work
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary/30 hover:bg-primary/10 hover:text-primary px-8 py-6 text-base"
          >
            <a href="#contact">
              Get in Touch
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}