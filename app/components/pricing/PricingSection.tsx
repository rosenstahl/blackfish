// app/components/pricing/PricingSection.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'
import type Package from '@/app/data/pricing'
import { packages } from '@/app/data/pricing'
import Link from 'next/link'

const features = [
  {
    icon: "⚡",
    title: "Express Umsetzung",
    description: "Schnelle Implementierung für sofortige Ergebnisse",
    bgClass: "bg-blue-500/10"
  },
  {
    icon: "✓",
    title: "Garantierte Qualität",
    description: "30 Tage Geld-zurück Garantie auf alle Pakete",
    bgClass: "bg-green-500/10"
  },
  {
    icon: "📈",
    title: "Messbarer Erfolg",
    description: "Transparente KPIs und regelmäßige Reports",
    bgClass: "bg-purple-500/10"
  }
]

export default function PricingSection() {
  const [expandedPackages, setExpandedPackages] = useState<string[]>([])

  const handleSelectPackage = (packageId: string) => {
    // Direkt zum Kontaktformular mit vorausgewähltem Paket
    window.location.href = `/contact?package=${packageId}`
  }

  return (
    <section className="relative bg-[#1a1f36]/95 backdrop-blur-sm">
      {/* Verbesserte Background Effekte */}
      <div className="absolute inset-0">
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
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Wählen Sie Ihr passendes Paket
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Von Startup bis Enterprise - für jede Phase Ihres Unternehmens die richtige Lösung
          </p>
        </motion.div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`${feature.bgClass} rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Toggle All Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              if (expandedPackages.length === packages.length) {
                setExpandedPackages([])
              } else {
                setExpandedPackages(packages.map(p => p.id))
              }
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            {expandedPackages.length === packages.length ? 'Alle Details ausblenden' : 'Alle Details anzeigen'}
          </button>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              isExpanded={expandedPackages.includes(pkg.id)}
              onToggleExpand={() => {
                setExpandedPackages(prev => 
                  prev.includes(pkg.id) 
                    ? prev.filter(id => id !== pkg.id)
                    : [...prev, pkg.id]
                )
              }}
              onSelect={() => handleSelectPackage(pkg.id)}
              
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Separate PackageCard Komponente für bessere Übersichtlichkeit
function PackageCard({ 
  package: pkg,
  isExpanded,
  onToggleExpand,
  onSelect
}: { 
  package: Package,
  isExpanded: boolean,
  onToggleExpand: () => void,
  onSelect: () => void
}) {
  const savePercentage = Math.round((1 - pkg.price / pkg.originalPrice) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`
        relative rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700
        ${pkg.id === 'startup' ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
    >
      {pkg.id === 'startup' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
            Beliebteste Wahl
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
        <p className="text-gray-400 mb-4 min-h-[48px]">{pkg.description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-4xl font-bold text-white">{pkg.price}€</span>
          {pkg.originalPrice !== pkg.price && (
            <span className="text-gray-500 line-through">{pkg.originalPrice}€</span>
          )}
        </div>

        {savePercentage > 0 && (
          <span className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
            Sie sparen {savePercentage}%
          </span>
        )}

        {pkg.monthly_limit && (
          <div className="mt-4 flex items-center justify-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Nur {pkg.monthly_limit} Pakete pro Monat verfügbar
            </span>
          </div>
        )}
      </div>

      {/* Top Features */}
      <div className="space-y-3 mb-6">
        {pkg.features[0].items
          .filter(item => item.highlight)
          .slice(0, 4)
          .map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleExpand}
          className="w-full rounded-lg bg-blue-500 py-3 text-white hover:bg-blue-600 transition-colors"
          aria-label={`${pkg.name} Details ${isExpanded ? 'ausblenden' : 'anzeigen'}`}
          aria-expanded={isExpanded}        
        >
          {isExpanded ? "Details ausblenden" : "Details anzeigen"}
        </motion.button>

        <Link 
          href={`/contact?package=${pkg.id}`}
          onClick={onSelect}
          className="block w-full text-center rounded-lg border border-gray-600 py-3 text-white hover:bg-gray-800/50 transition-colors"
        >
          Jetzt auswählen
        </Link>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: 1, 
            height: "auto",
            transition: {
              type: "spring",
              duration: 0.5,
              bounce: 0.2
            }
          }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-6 space-y-6 border-t border-gray-700 pt-6"
        >
          {/* Detaillierte Feature Liste */}
          {pkg.features.map((category, idx) => (
            <div key={idx}>
              <h4 className="text-white font-medium mb-3">{category.category}</h4>
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      item.highlight 
                        ? pkg.id === 'premium' 
                          ? 'text-blue-400' 
                          : pkg.id === 'enterprise'
                            ? 'text-purple-400'
                            : 'text-green-400'
                        : 'text-gray-500'
                    }`} />
                    <span className={`text-sm ${
                      item.highlight ? 'text-gray-300' : 'text-gray-400'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Bonus Features */}
          {pkg.bonuses && pkg.bonuses.length > 0 && (
            <div className="bg-blue-500/10 rounded-xl p-6 mt-6">
              <h4 className="text-white font-medium mb-3">
                {pkg.id === 'enterprise' ? 'Executive Services' : 'Bonus Features'}
              </h4>
              <div className="space-y-2">
                {pkg.bonuses.map((bonus, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">
                      {bonus.name}
                      {bonus.value && (
                        <span className="text-gray-400"> ({bonus.value})</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Garantien */}
          <div className="bg-gray-700/20 rounded-xl p-6 mt-6">
            <h4 className="text-white font-medium mb-3">Unsere Garantien</h4>
            <div className="space-y-2">
              {pkg.guarantees.map((guarantee, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}