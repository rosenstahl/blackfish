import { useCallback, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRight, Rocket, BarChart, Shield } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { scrollToSection } from '@/app/utils/navigation'
import FeatureCard from './FeatureCard'

const features = [
  {
    icon: Rocket,
    title: "Schneller Start",
    description: "Von der Idee zur fertigen Lösung in kürzester Zeit",
    className: "bg-gradient-to-br from-blue-500/90 via-blue-600/90 to-blue-700/90",
    delay: 0.2
  },
  {
    icon: BarChart,
    title: "Messbarer Erfolg",
    description: "Transparente KPIs und kontinuierliche Optimierung",
    className: "bg-gradient-to-br from-green-500/90 via-green-600/90 to-green-700/90",
    delay: 0.4
  },
  {
    icon: Shield,
    title: "Absolute Sicherheit",
    description: "Garantierte Qualität und Kundenzufriedenheit",
    className: "bg-gradient-to-br from-orange-500/90 via-orange-600/90 to-orange-700/90",
    delay: 0.6
  }
]

export default function HeroSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const trackCTAClick = useCallback((action: string) => {
    Analytics.event({
      action: 'hero_cta_click',
      category: 'CTA',
      label: action
    })
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        />
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center md:text-left"
          >
            <motion.h1 
              variants={itemVariants}
              className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Digitale Lösungen{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                die begeistern
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mb-8 text-xl text-gray-300 leading-relaxed"
            >
              Von der Strategie bis zur Umsetzung - Ihr Partner für digitalen Erfolg und 
              messbares Wachstum
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col items-center gap-4 md:flex-row md:items-start"
            >
              <motion.button 
                onClick={() => {
                  scrollToSection('pricing')
                  trackCTAClick('pricing')
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex items-center gap-2 rounded-full",
                  "bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3.5",
                  "text-white shadow-lg transition-all",
                  "hover:from-blue-600 hover:to-blue-700 hover:shadow-xl",
                  "w-full md:w-auto justify-center font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                )}
              >
                Pakete entdecken
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
              
              <motion.a 
                href="/contact"
                onClick={() => trackCTAClick('contact')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center justify-center gap-2",
                  "rounded-full border border-white/20 px-8 py-3.5",
                  "text-white transition-all hover:bg-white/10",
                  "w-full md:w-auto font-medium backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                )}
              >
                Beratungsgespräch vereinbaren
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={controls}
                custom={index}
                transition={{ delay: feature.delay }}
                className={index === 2 ? "col-span-2 md:col-span-1" : ""}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO and Accessibility Enhancements */}
      <div className="sr-only">
        <h2>BLACKFISH.DIGITAL - Ihre Full-Service Digitalagentur</h2>
        <p>
          Professionelle Webentwicklung, Digitales Marketing und Branding.
          Individuelle Lösungen für Ihren digitalen Erfolg.
        </p>
      </div>
    </section>
  )
}
