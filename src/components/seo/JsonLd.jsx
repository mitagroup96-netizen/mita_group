export default function JsonLd() {
  const bookStoreSchema = {
    "@context": "https://schema.org",
    "@type": "BookStore",
    "@id": "https://mita-group.vercel.app/#bookstore",
    "name": "MITA Group Book Store",
    "url": "https://mita-group.vercel.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://mita-group.vercel.app/logo.png"
    },
    "image": "https://mita-group.vercel.app/og-image.jpg",
    "description":
      "MITA Group is a trusted online bookstore in Bangladesh offering academic, competitive exam, fiction, non-fiction and Islamic books at affordable prices.",
    "telephone": "+8801906884840",
    "email": "mitatradersbd@gmail.com",
    "priceRange": "৳",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "38/6, Bock & Computer Complex",
      "addressLocality": "Dhaka",
      "postalCode": "1100",
      "addressCountry": "BD"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Bangladesh"
    },
    "sameAs": [
      "https://www.facebook.com/mitagroup",
      "https://www.linkedin.com/company/mita-group",
      "https://twitter.com/mitagroup",
      "https://www.instagram.com/mitagroup"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://mita-group.vercel.app/#website",
    "url": "https://mita-group.vercel.app",
    "name": "MITA Group Book Store",
    "description":
      "Buy academic, Islamic, fiction and competitive exam books online in Bangladesh.",
    "publisher": {
      "@id": "https://mita-group.vercel.app/#bookstore"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mita-group.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookStoreSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}