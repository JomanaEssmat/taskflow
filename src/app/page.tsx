'use client'

import { useEffect } from 'react'
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
    </div>
  )
}