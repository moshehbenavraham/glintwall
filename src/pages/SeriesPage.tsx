import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { usePortfolio } from "@/context/PortfolioContext";
import { FilmstripGallery } from "@/components/gallery/FilmstripGallery";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { SEO } from "@/components/seo/SEO";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import NotFound from "./NotFound";

export default function SeriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getSeriesBySlug, photographer, loading } = usePortfolio();

  const series = slug ? getSeriesBySlug(slug) : null;

  const seoTitle = series
    ? `${series.title} — ${photographer?.name || "Portrait Photographer"}`
    : photographer?.name || "Portrait Photographer";

  const seoDescription =
    series?.description ||
    `${series?.title || "Photography"} series by ${photographer?.name || "professional photographer"}`;

  const seriesUrl = slug ? `${SITE_URL}/series/${slug}` : SITE_URL;

  const structuredData = series
    ? {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: series.title,
        description: series.description,
        url: seriesUrl,
        author: photographer
          ? {
              "@type": "Person",
              name: photographer.name,
              url: `${SITE_URL}/about`,
            }
          : undefined,
        publisher: {
          "@type": "ProfessionalService",
          name: SITE_NAME,
          url: SITE_URL,
        },
        // schema.org/ImageObject.caption expects a string (or MediaObject).
        // Previously this leaked an arbitrary `{ subject, profession }`
        // object, which Google Rich Results / Schema validators reject.
        image: series.images.map((img) => {
          const captionString = img.caption
            ? `${img.caption.subject} — ${img.caption.profession}`
            : img.alt;
          return {
            "@type": "ImageObject",
            name: img.metadata.title,
            description: img.metadata.description || img.alt,
            caption: captionString,
            contentUrl: absoluteUrl(img.src),
            url: absoluteUrl(img.src),
          };
        }),
      }
    : undefined;

  if (loading) {
    return (
      <Layout>
        <SEO
          title={`Loading — ${SITE_NAME}`}
          description="Loading series"
        />
        <div className="h-full flex items-center justify-center">
          <GallerySkeleton />
        </div>
      </Layout>
    );
  }

  if (!series) {
    return <NotFound />;
  }

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        image={series.images[0]?.src}
        url={seriesUrl}
        type="article"
        structuredData={structuredData}
      />
      <div className="h-full flex items-center justify-center">
        <FilmstripGallery images={series.images} />
      </div>
    </Layout>
  );
}
