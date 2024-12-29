import { useCallback, useEffect, memo } from 'react'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import { ArrowRight, Rocket, BarChart, Shield } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { scrollToSection } from '@/app/utils/navigation'

// Memoized Feature Card Component
const FeatureCard = memo(({ icon: Icon, title, description, className, delay }: {
  icon: typeof Rocket;
  title: string;
  description: string;
  className: string;
  delay: number;
}) => (
  <div 
    className={cn(
      "relative overflow-hidden rounded-2xl p-6",
      "backdrop-blur-lg transition-all duration-300 hover:scale-[1.02]",
      className
    )}
    role="article"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-20" />
    <Icon className="h-8 w-8 text-white mb-4" />
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-200">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

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

function HeroSection() {
  const controls = useAnimation()
  const prefersReducedMotion = useReducedMotion()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView && !prefersReducedMotion) {
      controls.start('visible')
    } else {
      controls.set('visible') // Sofort anzeigen wenn Animationen deaktiviert
    }
  }, [controls, inView, prefersReducedMotion])

  const trackCTAClick = useCallback((action: string) => {
    Analytics.event({
      action: 'hero_cta_click',
      category: 'CTA',
      label: action
    })
  }, [])

  // Performance-optimierte Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        type: 'tween', // Verwendung von tween statt spring für bessere Performance
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section 
      ref={ref} 
      id="hero" 
      className="relative min-h-screen flex items-center"
      aria-label="Hero Section"
    >
      {/* Optimierte Hintergrund-Animation */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(to right, #4f4f4f2e 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f2e 1px, transparent 1px)',
            backgroundSize: '14px 24px'
          }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0.05 }}
          animate={{ 
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: 'linear'
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto px-4 py-20">
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
              className="mb-8 text-xl text-gray-300 leading-relaxed max-w-2xl"
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
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "group flex items-center gap-2 rounded-full",
                  "bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3.5",
                  "text-white shadow-lg transition-all duration-300",
                  "hover:from-blue-600 hover:to-blue-700 hover:shadow-xl",
                  "w-full md:w-auto justify-center font-medium",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label="Pakete entdecken und Preise ansehen"
              >
                Pakete entdecken
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </motion.button>
              
              <motion.a 
                href="/contact"
                onClick={() => trackCTAClick('contact')}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                className={cn(
                  "flex items-center justify-center gap-2",
                  "rounded-full border border-white/20 px-8 py-3.5",
                  "text-white transition-all duration-300 hover:bg-white/10",
                  "w-full md:w-auto font-medium backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2"
                )}
                aria-label="Kostenloses Beratungsgespräch vereinbaren"
              >
                Beratungsgespräch vereinbaren
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Feature Cards with Optimized Rendering */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={controls}
                custom={index}
                transition={{ delay: prefersReducedMotion ? 0 : feature.delay }}
                className={index === 2 ? "col-span-2 md:col-span-1" : ""}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* SEO and Structured Data */}
      <div className="sr-only">
        <h2>BLACKFISH.DIGITAL - Ihre Full-Service Digitalagentur</h2>
        <p>
          Professionelle Webentwicklung, Digitales Marketing und Branding.
          Individuelle Lösungen für Ihren digitalen Erfolg mit messbarem ROI.
        </p>
      </div>
    </section>
  )
}

// Performance Optimization durch Memoization
export default memo(HeroSection)