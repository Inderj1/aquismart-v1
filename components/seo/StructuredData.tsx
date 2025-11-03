import Script from 'next/script';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint: {
    '@type': string;
    contactType: string;
    email: string;
  };
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
}

interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function OrganizationStructuredData() {
  const schema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AcquiSmart',
    url: 'https://acquismart.com',
    logo: 'https://acquismart.com/logo.png',
    description: 'AI-powered business marketplace for buying and selling businesses',
    sameAs: [
      'https://twitter.com/acquismart',
      'https://linkedin.com/company/acquismart',
      'https://facebook.com/acquismart'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@acquismart.com'
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteStructuredData() {
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AcquiSmart',
    url: 'https://acquismart.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://acquismart.com/marketplace?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url?: string }> }) {
  const schema: BreadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'AcquiSmart',
    image: 'https://acquismart.com/logo.png',
    '@id': 'https://acquismart.com',
    url: 'https://acquismart.com',
    telephone: '+1-555-123-4567',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Business St',
      addressLocality: 'Boston',
      addressRegion: 'MA',
      postalCode: '02101',
      addressCountry: 'US'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 42.3601,
      longitude: -71.0589
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday'
      ],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [
      'https://twitter.com/acquismart',
      'https://linkedin.com/company/acquismart'
    ]
  };

  return (
    <Script
      id="local-business-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const schema = {
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

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
