type WebPage = {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  breadcrumb?: {
    '@type': 'BreadcrumbList';
    itemListElement: BreadcrumbItem[];
  };
  mainEntity?: any;
};

export function generateWebPageSchema({
  title,
  description,
  path,
  breadcrumbs,
  mainEntity
}: {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: { name: string; path: string }[];
  mainEntity?: any;
}): WebPage {
  const schema: WebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `https://blackfish.digital${path}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'BLACKFISH.DIGITAL',
      url: 'https://blackfish.digital'
    }
  };

  if (breadcrumbs) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
  }

  if (mainEntity) {
    schema.mainEntity = mainEntity;
  }

  return schema;
}

type FAQPage = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

type BlogPosting = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
};

export function generateBlogPostSchema({
  title,
  description,
  image,
  author,
  publishDate,
  modifyDate
}: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishDate: string;
  modifyDate: string;
}): BlogPosting {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: `https://blackfish.digital${image}`,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'BLACKFISH.DIGITAL',
      logo: {
        '@type': 'ImageObject',
        url: 'https://blackfish.digital/logo.svg'
      }
    },
    datePublished: publishDate,
    dateModified: modifyDate
  };
}