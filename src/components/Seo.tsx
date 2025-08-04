import React, { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  jsonLd?: Record<string, any>;
  schemaId?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, jsonLd, schemaId }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    let script: HTMLScriptElement | null = null;
    const id = schemaId || 'json-ld-schema';

    if (jsonLd) {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }
    };
  }, [title, description, jsonLd, schemaId]);

  return null;
};

export default Seo;
