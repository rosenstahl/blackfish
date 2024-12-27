import { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

const companies = [
  {
    name: "Altinzade Juwelier",
    description: "Digitale Präsenz & Marketing",
    delay: 0.1
  },
  {
    name: "TREU Service GmbH",
    description: "Webdesign & SEO",
    delay: 0.2
  },
  {
    name: "VITA Betreuungshilfe",
    description: "Corporate Identity & Web",
    delay: 0.3
  },
  {
    name: "Stadtwerke Dortmund",
    description: "Digital Excellence",
    delay: 0.4
  },
  {
    name: "Phoenix Pharma",
    description: "Brand Management",
    delay: 0.5
  },
  {
    name: "Signal Iduna",
    description: "Digital Strategy",
    delay: 0.6
  },
  {
    name: "Deutsche Apotheker",
    description: "Web Development",
    delay: 0.7
  },
  {
    name: "Viaduct GmbH",
    description: "Marketing Solutions",
    delay: 0.8
  }
]

const CompanyCard = memo(function CompanyCard({
  company,
  index
}: {
  company: typeof companies[0]
  index: number
}) {
  const trackCompanyHover = useCallback(() => {
    Analytics.event({
      action: 'company_hover',
      category: 'References',
      label: company.name
    })
  }, [company.name])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: company.delay }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onHoverStart={trackCompanyHover}
      className="group relative"
    >
      <div className="relative h-full rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700/50 hover:border-gray-600 transition-all">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {company.name}
          </h3>
          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
            {company.description}
          </p>
        </div>

        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  )
})

export default function TrustedBySection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <section 
      id="trusted" 
      ref={ref}
      className="relative bg-gradient-to-b from-[#1a1f36] via-[#1a1f36] to-transparent py-24 overflow-hidden"
      aria-labelledby="trusted-section-title"
    >
      {/* Subtiles Hintergrundmuster */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(45deg, #2a3350 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 
            id="trusted-section-title"
            className="inline-block font-semibold uppercase tracking-wider text-gray-400 mb-6 px-4 py-1.5 rounded-full bg-gray-800/50 backdrop-blur-sm"
          >
            Von führenden Unternehmen vertraut
          </h2>
          <p className="text-3xl font-bold text-white max-w-2xl mx-auto mt-4">
            Wir unterstützen Unternehmen jeder Größe dabei, ihr volles digitales Potenzial zu entfalten
          </p>
        </motion.div>

        {/* Companies Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          role="list"
          aria-label="Unsere Referenzen"
        >
          {companies.map((company, index) => (
            <CompanyCard 
              key={company.name} 
              company={company}
              index={index}
            />
          ))}
        </div>

        {/* Stats Badge */}
        <div className="text-center space-y-6">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300"
          >
            Und über <span className="font-semibold text-white">250+</span> weitere zufriedene Kunden
          </motion.p>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center rounded-full bg-green-500/10 px-6 py-3 backdrop-blur-sm"
          >
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="font-medium text-green-400">
              98% Kundenzufriedenheit
            </span>
          </motion.div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="sr-only">
        <h2>Zufriedene Kunden und Referenzen von BLACKFISH.DIGITAL</h2>
        <p>
          Wir sind stolz darauf, mit führenden Unternehmen aus verschiedenen Branchen
          zusammenzuarbeiten und ihnen zu digitalem Erfolg zu verhelfen.
        </p>
      </div>
    </section>
  )
}