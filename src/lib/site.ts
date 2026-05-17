/**
 * Site-wide constants used for SEO metadata, canonical URLs, and absolute
 * social-card image references. Centralizing here means we only have one
 * place to change when the production hostname is finalized.
 *
 * The hostname is inferred from the photographer's contact email
 * (hello@jamierodriguez.photo). Update SITE_URL once the actual production
 * domain is confirmed.
 */
export const SITE_URL = "https://jamierodriguez.photo";
export const SITE_NAME = "Jamie Rodriguez Photography";
export const SOCIAL_CARD_PATH = "/images/social-card.svg";

/**
 * Resolve a possibly-relative path against SITE_URL. Returns the input
 * unchanged if it's already an absolute http(s) URL or a data: URI.
 */
export function absoluteUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return `${SITE_URL}${SOCIAL_CARD_PATH}`;
  if (/^(https?:)?\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}
