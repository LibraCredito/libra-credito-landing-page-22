# SEO Component Usage

The `Seo` component centralizes page-level metadata so it can be reused across
routes.

## Props

- `title` – Sets the document title.
- `description` – Updates the standard meta description tag.
- `canonicalUrl` – Adds or updates a canonical link element.
- `openGraph` – Object containing Open Graph values such as `title`,
  `description` and `image`.
- `twitter` – Object containing Twitter card values such as `card`, `title`,
  `description` and `image`.
- `jsonLd` – Structured data injected as JSON-LD.
- `schemaId` – Optional ID for the JSON-LD script element.

## Example

```tsx
<Seo
  title="Home Equity"
  description="Crédito com garantia de imóvel"
  canonicalUrl="https://example.com"
  openGraph={{ title: 'OG Title', description: 'OG Description', image: '/img.png' }}
  twitter={{ card: 'summary_large_image', title: 'Twitter Title', image: '/img.png' }}
/>
```
