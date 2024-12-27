import { useEffect, useCallback, memo } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'
import { useInView } from 'react-intersection-observer'

interface Benefit {
  text: string;
  delay: number;
}

const benefits: Benefit[] = [
  { text: "Kostenlose Erstberatung", delay: 0.1 },
  { text: "Express-Service verfügbar", delay: 0.2 },
  { text: "Transparente Preise", delay: 0.3 },
  { text: "Flexibler Support", delay: 0.4 }
]

interface CallToActionProps {
  className?: string;
}

export default memo(function CallToAction({ className }: CallToActionProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const trackClick = useCallback((action: string) => {
    Analytics.event({
      action: 'cta_click',
      category: 'CTA',
      label: action
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section 
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-[#1a1f36]",
        className
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            opacity: [0.03, 0.05, 0.03]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        <motion.div
          animate={{ 
            backgroundPosition: ['0px 0px', '100px 100px'],
            opacity: [0.05, 0.07, 0.05]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className="text-center"
          >
            {/* Main Title */}
            <motion.h2
              variants={itemVariants} 
              className="mb-6 text-4xl font-bold text-white"
            >
              Bereit Ihr Business auf das nächste Level zu bringen?
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mb-12 text-xl text-gray-300"
            >
              Vereinbaren Sie jetzt ein kostenloses Beratungsgespräch und erfahren Sie, 
              wie wir Ihnen dabei helfen können.
            </motion.p>

            {/* Benefits Grid */}
            <div className="mb-12 grid grid-cols-2 gap-6 text-left sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  custom={index}
                  className="flex items-center space-x-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-green-500/20 p-1"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </motion.div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/contact"
                onClick={() => trackClick('contact')}
                className="group relative overflow-hidden w-full sm:w-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative flex items-center justify-center space-x-2",
                    "rounded-full bg-gradient-to-r from-blue-500 to-blue-600",
                    "px-8 py-4 text-white shadow-lg hover:shadow-xl transition-all"
                  )}
                >
                  <span>Beratungsgespräch vereinbaren</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </motion.div>
              </Link>

              <motion.a
                href="#pricing"
                onClick={() => trackClick('pricing')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex w-full sm:w-auto items-center justify-center space-x-2",
                  "rounded-full border border-white/20 px-8 py-4 text-white",
                  "backdrop-blur-sm transition-all hover:bg-white/10"
                )}
              >
                <span>Pakete ansehen</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Effects */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl"
      />
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-3xl"
      />
    </section>
  )
})