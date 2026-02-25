// components/JsonLd.tsx
export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://mita-group.vercel.app/#organization",
    "name": "MITA Group",
    "url": "https://mita-group.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mita-group.vercel.app/logo.png",
      "width": 600,
      "height": 60
    },
    "sameAs": [
      "https://www.facebook.com/mitagroup",
      "https://www.linkedin.com/company/mita-group",
      "https://twitter.com/mitagroup",
      "https://www.instagram.com/mitagroup"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your ZIP",
      "addressCountry": "Your Country"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-123-456-7890",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["English", "Spanish"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mita-group.vercel.app/#website",
    "url": "https://mita-group.vercel.app",
    "name": "MITA Group",
    "description": "Leading provider of [industry] solutions",
    "publisher": {
      "@id": "https://mita-group.vercel.app/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://mita-group.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}