import { memo, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Users2, Star, Award } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/app/lib/utils'

const stats = [
  {
    icon: Users2,
    value: 250,
    label: "Zufriedene Kunden",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    delay: 0.2,
    suffix: "+"
  },
  {
    icon: Star,
    value: 98,
    label: "Kundenzufriedenheit",
    gradientFrom: "from-green-500",
    gradientTo: "to-green-600",
    delay: 0.4,
    suffix: "%"
  },
  {
    icon: Award,
    value: 10,
    label: "Jahre Erfahrung",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    delay: 0.6,
    suffix: "+"
  }
]

const CounterAnimation = memo(function CounterAnimation({ 
  value, 
  suffix = '',
  duration = 2000 
}: { 
  value: number
  suffix?: string
  duration?: number
}) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        const currentCount = Math.min(
          Math.floor((progress / duration) * value),
          value
        )
        setCount(currentCount)
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [inView, value, duration])

  return <span ref={ref}>{count}{suffix}</span>
})

export default function StatsSection() {
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
    <section 
      ref={ref} 
      className="relative py-24"
      aria-label="Statistiken und Erfolge"
    >
      {/* Background Effects */}
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
          className="absolute inset-0 bg-gradient-to-b from-[#1a1f36] via-[#1a1f36] to-transparent"
        />
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Warum BLACKFISH.DIGITAL?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ihr verlässlicher Partner für digitalen Erfolg – mit bewährter Expertise und messbaren Resultaten
          </p>
        </motion.div>

        <div 
          className="grid gap-8 md:grid-cols-3"
          role="list"
          aria-label="Unsere Erfolge in Zahlen"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              initial="hidden"
              animate={controls}
              whileHover={{ translateY: -8 }}
              className="relative group"
              role="listitem"
            >
              <div className={cn(
                "relative rounded-2xl bg-gray-800/50 backdrop-blur-sm p-8",
                "border border-gray-700/50 transition-all duration-300",
                "hover:border-gray-600 z-10"
              )}>
                {/* Icon Container */}
                <div className="mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={cn(
                      "mx-auto w-16 h-16 rounded-full",
                      "bg-gradient-to-br",
                      stat.gradientFrom,
                      stat.gradientTo,
                      "flex items-center justify-center"
                    )}
                  >
                    <stat.icon className="h-8 w-8 text-white" />
                  </motion.div>
                </div>

                {/* Counter */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: stat.delay }}
                  className="text-center"
                >
                  <span className={cn(
                    "text-4xl font-bold bg-gradient-to-r",
                    stat.gradientFrom,
                    stat.gradientTo,
                    "bg-clip-text text-transparent"
                  )}>
                    <CounterAnimation 
                      value={stat.value} 
                      suffix={stat.suffix}
                    />
                  </span>
                  <p className="mt-2 text-gray-300 font-medium">
                    {stat.label}
                  </p>
                </motion.div>

                {/* Hover Effect Background */}
                <div className={cn(
                  "absolute inset-0 -z-10 rounded-2xl",
                  "bg-gradient-to-br",
                  stat.gradientFrom,
                  stat.gradientTo,
                  "opacity-0 group-hover:opacity-5",
                  "transition-opacity duration-300"
                )} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute right-10 top-40 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute left-10 bottom-20 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl"
        />
      </div>
    </section>
  )
}