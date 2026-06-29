'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MapPin, Phone, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@creative.dev',
    href: 'mailto:hello@creative.dev',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Cairo, Egypt',
    href: '#',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+20 123 456 7890',
    href: 'tel:+201234567890',
  },
]

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      <div className="section-divider mb-24 sm:mb-32" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-mono text-primary uppercase tracking-widest">Contact</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Have a project in mind or want to collaborate? I&apos;d love to hear from you. 
            Let&apos;s create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.label}
                href={info.href}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl glass hover:bg-secondary/60 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                  <div className="font-medium">{info.value}</div>
                </div>
              </motion.a>
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass rounded-2xl p-6 gradient-border mt-8"
            >
              <h3 className="text-lg font-semibold mb-2">Open to Work</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                I&apos;m currently available for freelance projects and full-time remote positions. 
                Let&apos;s discuss how I can contribute to your team.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Currently available
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 gradient-border">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-secondary/50 border-border/50 focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  required
                  className="bg-secondary/50 border-border/50 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  className="bg-secondary/50 border-border/50 focus:border-primary/50 resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || isSubmitted}
                className="w-full glow-purple bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}