import { Layout } from "@/components/layout/Layout";
import { usePortfolio } from "@/context/PortfolioContext";
import { FilmstripGallery } from "@/components/gallery/FilmstripGallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { SEO } from "@/components/seo/SEO";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export default function Home() {
  const { series, photographer, loading, error } = usePortfolio();

  const featuredSeries = series.find((s) => s.featured) || series[0];

  const seoTitle = featuredSeries
    ? `${featuredSeries.title} — ${photographer?.name || "Portrait Photographer"}`
    : photographer?.name || "Portrait Photographer Portfolio";

  const seoDescription =
    featuredSeries?.description ||
    photographer?.tagline ||
    "Professional portrait photography portfolio featuring documentary, editorial, and commercial work.";

  // JSON-LD: describe the photographer's business so search engines and
  // social platforms understand who this site is for.
  const structuredData = photographer
    ? {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: SITE_NAME,
        url: SITE_URL,
        description: photographer.tagline,
        image: absoluteUrl(photographer.portraitImage?.src),
        email: photographer.contact?.email,
        telephone: photographer.contact?.phone,
        founder: {
          "@type": "Person",
          name: photographer.name,
          jobTitle: "Portrait Photographer",
        },
        areaServed: "United States",
        knowsAbout: [
          "Portrait Photography",
          "Documentary Photography",
          "Editorial Photography",
        ],
      }
    : undefined;

  if (loading) {
    return (
      <Layout>
        <SEO title={`Loading — ${SITE_NAME}`} description="Loading portfolio" />
        <div className="h-full flex items-center justify-center">
          <GallerySkeleton />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO
          title={`Something went wrong — ${SITE_NAME}`}
          description="Error loading portfolio"
          noindex
        />
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md px-4">
            <p className="text-destructive font-semibold">Error loading portfolio</p>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-foreground text-background rounded hover:opacity-80 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!featuredSeries) {
    return (
      <Layout>
        <SEO
          title={`Portfolio — ${SITE_NAME}`}
          description="No portfolio series available yet."
        />
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No portfolio series available</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={featuredSeries.images[0]?.src}
        type="website"
        structuredData={structuredData}
      />
      <div className="h-full flex items-center justify-center">
        <FilmstripGallery images={featuredSeries.images} />
      </div>
    </Layout>
  );
}
