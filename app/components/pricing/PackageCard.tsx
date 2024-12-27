import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Analytics } from '@/app/lib/analytics'
import { cn } from '@/app/lib/utils'

interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  features: {
    category: string;
    items: {
      name: string;
      highlight?: boolean;
    }[];
  }[];
  guarantees: string[];
  bonuses?: {
    name: string;
    value?: string;
  }[];
  monthly_limit?: number;
  isPopular?: boolean;
}

interface PackageCardProps {
  package: Required<Package>;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
}

const variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.2
    }
  }
}

const PackageCard = memo(function PackageCard({ 
  package: pkg,  
  isExpanded,
  onToggleExpand,
  onSelect
}: PackageCardProps) {
  const isPopular = pkg.isPopular || false
  const savePercentage = Math.round((1 - pkg.price / pkg.originalPrice) * 100)

  const handleToggle = () => {
    Analytics.event({
      action: 'package_details_toggle',
      category: 'Pricing',
      label: pkg.id,
      value: isExpanded ? 0 : 1
    })
    onToggleExpand()
  }

  const handleSelect = () => {
    Analytics.event({
      action: 'package_selected',
      category: 'Pricing',
      label: pkg.id
    })
    onSelect()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
      role="article"
      aria-labelledby={`package-${pkg.id}-title`}
    >
      <motion.div
        layout
        className={cn(
          "relative rounded-2xl border bg-white p-8 transition-all duration-300",
          isPopular && "border-2 border-blue-500 shadow-lg",
          isExpanded && "shadow-xl"
        )}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-full bg-blue-500 px-4 py-1 text-sm font-medium text-white shadow-md"
            >
              Beliebteste Wahl
            </motion.div>
          </div>
        )}

        {/* Package Header */}
        <div className="mb-8 text-center">
          <motion.h3 
            layout="position"
            id={`package-${pkg.id}-title`}
            className="mb-2 text-2xl font-bold"
          >
            {pkg.name}
          </motion.h3>
          <p className="mb-6 text-gray-600 min-h-[48px]">{pkg.description}</p>
          
          <motion.div layout="position" className="mb-6">
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold">{pkg.price}€</span>
              {pkg.originalPrice !== pkg.price && (
                <span className="text-lg text-gray-500 line-through">
                  {pkg.originalPrice}€
                </span>
              )}
            </div>
            {pkg.originalPrice !== pkg.price && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                  Sie sparen {savePercentage}%
                </span>
              </div>
            )}
          </motion.div>

          {pkg.monthly_limit && (
            <div className="flex items-center justify-center gap-2 rounded-full bg-yellow-50 px-4 py-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Nur {pkg.monthly_limit} Pakete pro Monat verfügbar
              </span>
            </div>
          )}
        </div>

        {/* Feature List */}
        <motion.div layout="position" className="mb-8 space-y-4">
          {pkg.features.slice(0, 2).map((category) => 
            category.items
              .filter(item => item.highlight)
              .slice(0, 2)
              .map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm font-medium">{item.name}</span>
                </motion.div>
              ))
          )}
        </motion.div>

        {/* Toggle Button */}
        <motion.button
          layout="position"
          onClick={handleToggle}
          className={cn(
            "group relative w-full overflow-hidden rounded-lg py-4 transition-all duration-300",
            isExpanded ? "bg-gray-100" : "bg-blue-500 text-white hover:bg-blue-600"
          )}
          aria-expanded={isExpanded}
          aria-controls={`package-${pkg.id}-details`}
        >
          <div className="relative flex items-center justify-center gap-2">
            <span>{isExpanded ? 'Weniger anzeigen' : 'Alle Details anzeigen'}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </motion.button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`package-${pkg.id}-details`}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden"
            >
              <div className="mt-8 space-y-8">
                {/* Features */}
                {pkg.features.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-t pt-6 first:border-0 first:pt-0"
                  >
                    <h4 className="mb-4 font-semibold">{category.category}</h4>
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-3">
                          <Check className={cn(
                            "h-5 w-5 flex-shrink-0",
                            item.highlight ? "text-green-500" : "text-gray-400"
                          )} />
                          <span className={cn(
                            "text-sm",
                            item.highlight && "font-medium"
                          )}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Bonuses */}
                {pkg.bonuses && pkg.bonuses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-blue-50 p-6"
                  >
                    <h4 className="mb-4 font-semibold text-blue-900">
                      {pkg.id === 'enterprise' ? 'Executive Services' : 'Bonus Features'}
                    </h4>
                    <div className="space-y-3">
                      {pkg.bonuses.map((bonus, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 flex-shrink-0 text-blue-500" />
                          <span className="text-sm text-blue-900">
                            {bonus.name}
                            {bonus.value && (
                              <span className="text-blue-700"> ({bonus.value})</span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Guarantees */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-gray-50 p-6"
                >
                  <h4 className="mb-4 font-semibold">Unsere Garantien</h4>
                  <div className="space-y-3">
                    {pkg.guarantees.map((guarantee, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-sm">{guarantee}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleSelect}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-blue-500 py-4 text-white transition-colors hover:bg-blue-600"
                >
                  Jetzt Paket wählen
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
})

PackageCard.displayName = 'PackageCard'

export default PackageCard