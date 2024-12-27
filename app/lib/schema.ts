// app/lib/schema.ts

export const getOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BLACKFISH.DIGITAL',
    url: 'https://blackfish.digital',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blackfish.digital/logo.png',
      width: '180',
      height: '180'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49-123-456789',
      contactType: 'customer service',
      areaServed: 'DE',
      availableLanguage: ['German', 'English']
    },
    sameAs: [
      'https://www.linkedin.com/company/blackfish-digital',
      'https://twitter.com/blackfishdigital',
      'https://www.instagram.com/blackfishdigital'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Musterstraße 123',
      addressLocality: 'Musterstadt',
      postalCode: '12345',
      addressCountry: 'DE'
    }
  }
}