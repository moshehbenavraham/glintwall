import { useEffect } from 'react';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
  /** When true, emit `noindex,nofollow` so search engines skip the page (e.g. 404). */
  noindex?: boolean;
}

/**
 * Mounts/updates per-page SEO metadata: <title>, description, canonical link,
 * Open Graph, Twitter card, robots, and an optional JSON-LD structured data
 * block.
 *
 * All meta tags managed by this component carry a `data-seo` attribute so we
 * can confidently remove tags this component added on unmount without
 * touching tags rendered into index.html at build time.
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  structuredData,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const resolvedUrl =
      url ??
      (typeof window !== 'undefined'
        ? `${SITE_URL}${window.location.pathname}${window.location.search}`
        : SITE_URL);
    const resolvedImage = absoluteUrl(image);

    document.title = title;

    type MetaTag =
      | { name: string; content: string }
      | { property: string; content: string };

    const metaTags: MetaTag[] = [
      { name: 'description', content: description },
      { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' },

      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: resolvedImage },
      { property: 'og:url', content: resolvedUrl },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: resolvedImage },
      { name: 'twitter:url', content: resolvedUrl },
    ];

    const managedElements: Element[] = [];

    for (const tag of metaTags) {
      const isName = 'name' in tag;
      const attribute = isName ? 'name' : 'property';
      const value = isName ? tag.name : tag.property;

      let element = document.head.querySelector(
        `meta[${attribute}="${value}"]`
      );

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, value);
        element.setAttribute('data-seo', 'true');
        document.head.appendChild(element);
        managedElements.push(element);
      }

      element.setAttribute('content', tag.content);
    }

    // Canonical link
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('data-seo', 'true');
      document.head.appendChild(canonical);
      managedElements.push(canonical);
    }
    canonical.setAttribute('href', resolvedUrl);

    // JSON-LD structured data — tagged so we can swap it cleanly on route change.
    let script = document.head.querySelector(
      'script[type="application/ld+json"][data-seo="true"]'
    );

    if (structuredData) {
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('data-seo', 'true');
        document.head.appendChild(script);
        managedElements.push(script);
      }
      script.textContent = JSON.stringify(structuredData);
    } else if (script) {
      // Previous route added a JSON-LD block but this one didn't — clear it.
      script.parentNode?.removeChild(script);
    }

    return () => {
      // Reset robots back to default on unmount so a `noindex` 404 doesn't
      // leak into the next page if React keeps the meta tag.
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute('content', 'index,follow');
      }
    };
  }, [title, description, image, url, type, structuredData, noindex]);

  return null;
}
