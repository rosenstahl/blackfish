import { memo, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { 
  Code, 
  Globe, 
  Megaphone, 
  BarChart, 
  Smartphone, 
  Award,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

const services = [
  {
    icon: Globe,
    title: "Webdesign & Development",
    description: "Moderne und responsive Websites mit optimaler User Experience",
    color: "from-blue-500 to-blue-600",
    link: "/contact?service=web",
    delay: 0.1
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Zielgerichtete Kampagnen für maximale Online-Präsenz",
    color: "from-purple-500 to-purple-600",
    link: "/contact?service=marketing",
    delay: 0.2
  },
  {
    icon: BarChart,
    title: "SEO & Analytics",
    description: "Datengetriebene Optimierung für besseres Ranking",
    color: "from-green-500 to-green-600",
    link: "/contact?service=seo",
    delay: 0.3
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Native und Cross-Platform Apps für Ihr Business",
    color: "from-orange-500 to-orange-600",
    link: "/contact?service=app",
    delay: 0.4
  },
  {
    icon: Code,
    title: "Software Solutions",
    description: "Maßgeschneiderte Softwarelösungen für Ihr Unternehmen",
    color: "from-pink-500 to-pink-600",
    link: "/contact?service=software",
    delay: 0.5
  },
  {
    icon: Award,
    title: "Branding & Design",
    description: "Einzigartige Markenidentität und Corporate Design",
    color: "from-cyan-500 to-cyan-600",
    link: "/contact?service=branding",
    delay: 0.6
  }
]

const ServiceCard = memo(function ServiceCard({ 
  service, 
  index 
}: { 
  service: typeof services[0]
  index: number 
}) {
  const { icon: Icon, title, description, color, link } = service

  const trackServiceClick = useCallback(() => {
    Analytics.event({
      action: 'service_click',
      category: 'Services',
      label: title
    })
  }, [title])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <Link 
        href={link}
        onClick={trackServiceClick}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-2xl"
      >
        <div className={cn(
          "relative rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 h-full",
          "border border-gray-700/50 hover:border-gray-600 transition-all"
        )}>
          {/* Icon */}
          <div className={cn(
            "mb-4 inline-block rounded-xl p-3",
            `bg-gradient-to-br ${color}`
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-semibold text-white mb-2">
            {title}
          </h3>
          <p className={cn(
            "text-gray-400 group-hover:text-gray-300",
            "transition-colors mb-4"
          )}>
            {description}
          </p>

          {/* Arrow Link */}
          <div className={cn(
            "flex items-center text-gray-400",
            "group-hover:text-white transition-colors"
          )}>
            <span className="text-sm mr-2">Mehr erfahren</span>
            <ArrowRight className={cn(
              "h-4 w-4 transform",
              "group-hover:translate-x-1 transition-transform"
            )} />
          </div>

          {/* Hover Effect */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0",
            `bg-gradient-to-br ${color}`,
            "group-hover:opacity-5 transition-opacity duration-300"
          )} />
        </div>
      </Link>
    </motion.div>
  )
})

export default function ServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section 
      id="services" 
      ref={ref}
      className="relative py-24 bg-[#1a1f36]"
      aria-label="Unsere Services"
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
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Unsere Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Von der Konzeption bis zur Umsetzung - wir begleiten Sie auf dem Weg zum digitalen Erfolg
          </p>
        </motion.div>

        {/* Services Grid */}
        <div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Liste unserer Services"
        >
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title}
              service={service}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
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
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute left-10 bottom-20 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl"
      />
    </section>
  )
}