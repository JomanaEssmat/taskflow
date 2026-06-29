'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Heart, ArrowUpRight } from 'lucide-react'

const footerLinks = {
  navigation: [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ],
  social: [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="#hero" className="text-2xl font-bold gradient-text">
              &lt;Dev /&gt;
            </a>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-sm">
              Crafting immersive digital experiences through the fusion of code, design, and 3D art. 
              Always pushing the boundaries of what&apos;s possible on the web.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {footerLinks.social.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Status
            </h3>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Available for work</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Currently accepting new projects and collaboration opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> using Next.js & Three.js
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Creative Developer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}