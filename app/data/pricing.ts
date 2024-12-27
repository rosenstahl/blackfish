// app/data/pricing.ts
export default interface Package {
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

export const packages: Package[] = [
  {
    id: "startup",
    name: "Startup Complete Paket",
    price: 1399,
    originalPrice: 3679,
    description: "Ihr perfekter Start ins Business",
    features: [
      {
        category: "Business Kommunikation",
        items: [
          { name: "Business Nummer mit All-Net-Flat", highlight: true },
          { name: "3GB Datenvolumen monatlich", highlight: true },
          { name: "Business WhatsApp" },
          { name: "Business Mail" },
          { name: "Domain für 1 Jahr" }
        ]
      },
      {
        category: "Markenentwicklung Premium",
        items: [
          { name: "Brand Name & Story", highlight: true },
          { name: "Logo Design - 3 Konzepte", highlight: true },
          { name: "Mission, Vision, Values" },
          { name: "Corporate Identity Package" }
        ]
      },
      {
        category: "Geschäftsausstattung Deluxe",
        items: [
          { name: "250 Premium Visitenkarten", highlight: true },
          { name: "Angebotsmappe Professional", highlight: true },
          { name: "Geschäftspapiere" },
          { name: "Firmenstempel" },
          { name: "Basis-Flyer" },
          { name: "PowerPoint-Template" },
          { name: "Email-Signatur" }
        ]
      },
      {
        category: "Digitale Präsenz",
        items: [
          { name: "Professionelle Landing Page", highlight: true },
          { name: "Social Media Setup komplett" },
          { name: "5 Premium Starter Posts" },
          { name: "SSL-Zertifikat" }
        ]
      }
    ],
    guarantees: [
      "30 Tage Geld-zurück",
      "Express-Fertigstellung",
      "Trusted by 100+ Startups",
      "Persönlicher Support"
    ],
    bonuses: [
      { name: "Marketing-Beratung", value: "2 Stunden" },
      { name: "Priority Support", value: "3 Monate" },
      { name: "Setup auf allen Geräten" }
    ],
    monthly_limit: 5
  },
  {
    id: "business",
    name: "Business Growth Paket",
    price: 2997,
    originalPrice: 7499,
    description: "Ihr Partner für nachhaltiges Wachstum",
    features: [
      {
        category: "Premium Brand Evolution",
        items: [
          { name: "Brand Refresh oder Neuaufbau", highlight: true },
          { name: "Brand Story Entwicklung", highlight: true },
          { name: "Corporate Design Modernisierung" },
          { name: "Logo Optimierung/Redesign" },
          { name: "Design Guidelines" }
        ]
      },
      {
        category: "Business Kommunikation Plus",
        items: [
          { name: "Business Nummer mit All-Net-Flat", highlight: true },
          { name: "3GB Datenvolumen monatlich", highlight: true },
          { name: "Multi-Device WhatsApp Business" },
          { name: "Professional Business Mail" },
          { name: "Premium Domain 1 Jahr" }
        ]
      },
      {
        category: "Digitale Exzellenz",
        items: [
          { name: "Premium Website (5 Seiten)", highlight: true },
          { name: "SEO Grundoptimierung" },
          { name: "SSL-Zertifikat" },
          { name: "Cookie-Banner & DSGVO" },
          { name: "Google Business Optimierung" }
        ]
      },
      {
        category: "Marketing Power",
        items: [
          { name: "Setup 3 Plattformen", highlight: true },
          { name: "10 Premium Posts", highlight: true },
          { name: "Content-Strategie" },
          { name: "Hashtag-Konzept" },
          { name: "Community Management Setup" }
        ]
      }
    ],
    guarantees: [
      "30 Tage Geld-zurück",
      "Express-Fertigstellung",
      "Proven by 250+ Business",
      "Dedicated Manager"
    ],
    bonuses: [
      { name: "Marketing-Beratung", value: "5 Stunden" },
      { name: "Support", value: "6 Monate" },
      { name: "Express-Service" },
      { name: "Account Manager" },
      { name: "Strategiemeeting" }
    ],
    monthly_limit: 3
  },
  
  {
    id: "premium",
    name: "Premium Performance Paket",
    price: 4997,
    originalPrice: 11999,
    description: "Maximaler Impact für Ihr Business",
    features: [
      {
        category: "Executive Brand Management",
        items: [
          { name: "360° Brand Audit & Strategie", highlight: true },
          { name: "Premium Brand Evolution", highlight: true },
          { name: "Corporate Identity Excellence" },
          { name: "Signature Logo & Design System" },
          { name: "Full Brand Guidelines" }
        ]
      },
      {
        category: "Premium Business Suite",
        items: [
          { name: "Business Nummer mit All-Net-Flat", highlight: true },
          { name: "3GB Datenvolumen monatlich", highlight: true },
          { name: "Enterprise WhatsApp Solution" },
          { name: "Premium Business Mail Suite" },
          { name: "Premium Domain 5 Jahre" }
        ]
      },
      {
        category: "Digital Excellence Suite",
        items: [
          { name: "Premium Business Website (10 Seiten)", highlight: true },
          { name: "Full SEO Optimization", highlight: true },
          { name: "SSL-Zertifikat" },
          { name: "Legal Package (DSGVO, Cookie, AGB)" },
          { name: "Analytics & Tracking Setup" }
        ]
      },
      {
        category: "Premium Marketing Suite",
        items: [
          { name: "Multi-Platform Setup (5 Kanäle)", highlight: true },
          { name: "20 Premium Posts", highlight: true },
          { name: "Content Marketing Strategie" },
          { name: "Social Media Playbook" },
          { name: "Influencer Marketing Setup" }
        ]
      },
      {
        category: "Premium Print & Design",
        items: [
          { name: "1000 Premium Visitenkarten", highlight: true },
          { name: "Executive Stempel Set" },
          { name: "Premium Geschäftsausstattung" },
          { name: "PowerPoint Master Template" },
          { name: "Marketing Materialien Set" }
        ]
      },
      {
        category: "Performance Marketing",
        items: [
          { name: "Google & Meta Ads Premium Setup", highlight: true },
          { name: "400€ Werbebudget inklusive", highlight: true },
          { name: "Advanced Lead Generation" },
          { name: "Email Marketing Premium" },
          { name: "Marketing Automation Setup" }
        ]
      },
      {
        category: "Conversion Optimierung",
        items: [
          { name: "A/B Testing Setup", highlight: true },
          { name: "User Journey Optimization" },
          { name: "Conversion Tracking" },
          { name: "Performance Monitoring" }
        ]
      }
    ],
    guarantees: [
      "30 Tage Geld-zurück",
      "Express-Service",
      "Performance Garantie",
      "Dedicated Director"
    ],
    bonuses: [
      { name: "Executive Beratung", value: "10 Stunden" },
      { name: "Support", value: "12 Monate" },
      { name: "Monatliches Meeting" },
      { name: "Success Manager" },
      { name: "Performance Review" }
    ],
    monthly_limit: 2
  },
  {
    id: "enterprise",
    name: "Enterprise Solution",
    price: 9997,
    originalPrice: 9997,
    description: "Custom Business Excellence",
    features: [
      {
        category: "Executive Brand & Strategy",
        items: [
          { name: "Enterprise Brand Strategy", highlight: true },
          { name: "Full Market Research & Analysis", highlight: true },
          { name: "Global Brand Architecture" },
          { name: "Multi-Market Strategy" },
          { name: "Competitor Intelligence" },
          { name: "Enterprise Design System" },
          { name: "Multi-Brand Guidelines" },
          { name: "Global Asset Management" },
          { name: "Brand Protection Service" }
        ]
      },
      {
        category: "Enterprise Digital Suite",
        items: [
          { name: "Multi-Platform Solution", highlight: true },
          { name: "Enterprise Website System", highlight: true },
          { name: "Multi-Language/Market" },
          { name: "Custom Development" },
          { name: "Full Security Suite" },
          { name: "Cloud Integration" },
          { name: "API Development" },
          { name: "Custom Tools & Apps" },
          { name: "Automation Systems" }
        ]
      },
      {
        category: "Premium Communication",
        items: [
          { name: "Enterprise Communication", highlight: true },
          { name: "Unlimited Business Lines", highlight: true },
          { name: "Unlimited Data Plans" },
          { name: "Global WhatsApp Business" },
          { name: "Enterprise Mail System" },
          { name: "Team Collaboration Suite" },
          { name: "Project Management" },
          { name: "Custom Workflows" },
          { name: "Digital Workspace" }
        ]
      },
      {
        category: "Global Marketing Suite",
        items: [
          { name: "Strategic Marketing", highlight: true },
          { name: "Multi-Market Campaigns", highlight: true },
          { name: "Custom Content Production" },
          { name: "Global Social Management" },
          { name: "Influencer Networks" },
          { name: "Enterprise Ad Management" },
          { name: "Custom Budget Allocation" },
          { name: "AI-Powered Analytics" },
          { name: "Attribution Modeling" }
        ]
      },
      {
        category: "Data & Analytics",
        items: [
          { name: "Business Intelligence", highlight: true },
          { name: "Custom Dashboards", highlight: true },
          { name: "Real-time Analytics" },
          { name: "Predictive Analysis" },
          { name: "ROI Tracking" },
          { name: "A/B Testing Suite" },
          { name: "Conversion Optimization" },
          { name: "User Experience Analysis" },
          { name: "Market Intelligence" }
        ]
      }
    ],
    guarantees: [
      "Custom Service Level Agreement",
      "Performance Guarantees",
      "Dedicated Support Team",
      "Risk Management & Compliance"
    ],
    bonuses: [
      { name: "Dedicated Account Director Team" },
      { name: "24/7 Premium Support Level" },
      { name: "Weekly Strategy Meetings" },
      { name: "Monthly Performance Reviews" },
      { name: "Quarterly Business Planning" }
    ]
  }
];