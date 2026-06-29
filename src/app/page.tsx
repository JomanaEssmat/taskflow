'use client'

import { useEffect } from 'react'
import { Download } from 'lucide-react'
import Navbar from '@/components/portfolio/Navbar'
import Hero from '@/components/portfolio/Hero'
import About from '@/components/portfolio/About'
import Portfolio from '@/components/portfolio/Portfolio'
import Skills from '@/components/portfolio/Skills'
import Contact from '@/components/portfolio/Contact'
import Footer from '@/components/portfolio/Footer'

export default function Home() {
  // Preload images
  useEffect(() => {
    const images = [
      '/images/hero-bg.png',
      '/images/project-web.png',
      '/images/project-3d.png',
      '/images/project-mobile.png',
      '/images/project-brand.png',
    ]
    images.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Portfolio />
        <Skills />
        <Contact />
      </main>
      <Footer />

      {/* Download Project Button */}
      <a
        href="/api/download"
        download
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium shadow-lg glow-purple transition-all hover:scale-105"
      >
        <Download className="w-4 h-4" />
        Download Project
      </a>
    </div>
  )
}