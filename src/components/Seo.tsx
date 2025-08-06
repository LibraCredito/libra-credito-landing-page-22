import React, { useEffect } from 'react';

/**
 * Props for the {@link Seo} component used to manage page-level metadata.
 *
 * - `title` – Sets the document title.
 * - `description` – Updates the standard meta description tag.
 * - `canonicalUrl` – Adds or updates a canonical link element.
 * - `openGraph` – Key/value pairs for Open Graph meta tags (e.g. `title`,
 *   `description`, `image`).
 * - `twitter` – Key/value pairs for Twitter card meta tags (e.g. `card`,
 *   `title`, `description`, `image`).
 * - `jsonLd` – Structured data object injected as JSON-LD.
 * - `schemaId` – Optional ID for the JSON-LD script element.
 */
interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  openGraph?: Record<string, string | undefined>;
  twitter?: Record<string, string | undefined>;
  jsonLd?: Record<string, any>;
  schemaId?: string;
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalUrl,
  openGraph,
  twitter,
  jsonLd,
  schemaId,
}) => {
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

    if (canonicalUrl) {
      let link = document.querySelector(
        "link[rel='canonical']"
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }

    if (openGraph) {
      Object.entries(openGraph).forEach(([key, value]) => {
        if (!value) return;
        const property = `og:${key}`;
        let meta = document.querySelector(
          `meta[property='${property}']`
        ) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', value);
      });
    }

    if (twitter) {
      Object.entries(twitter).forEach(([key, value]) => {
        if (!value) return;
        const name = `twitter:${key}`;
        let meta = document.querySelector(
          `meta[name='${name}']`
        ) as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', value);
      });
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
  }, [
    title,
    description,
    canonicalUrl,
    openGraph,
    twitter,
    jsonLd,
    schemaId,
  ]);

  return null;
};

export default Seo;
