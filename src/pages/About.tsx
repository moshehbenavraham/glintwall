import { Layout } from '@/components/layout/Layout';
import { usePortfolio } from '@/context/PortfolioContext';
import { AboutPageLayout } from '@/components/about/AboutPageLayout';
import { SEO } from '@/components/seo/SEO';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

export default function About() {
  const { photographer, loading, error } = usePortfolio();

  const structuredData = photographer
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: photographer.name,
        jobTitle: 'Professional Portrait Photographer',
        description: photographer.tagline,
        email: photographer.contact.email,
        telephone: photographer.contact.phone,
        url: `${SITE_URL}/about`,
        image: absoluteUrl(photographer.portraitImage.src),
        knowsAbout: [
          'Portrait Photography',
          'Documentary Photography',
          'Editorial Photography',
        ],
        worksFor: {
          '@type': 'ProfessionalService',
          name: SITE_NAME,
          url: SITE_URL,
        },
      }
    : undefined;

  if (loading) {
    return (
      <Layout fullPage>
        <SEO
          title={`Loading — ${SITE_NAME}`}
          description="Loading photographer profile"
        />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !photographer) {
    return (
      <Layout fullPage>
        <SEO
          title={`About — ${SITE_NAME}`}
          description="Error loading photographer profile"
          noindex
        />
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md px-4">
            <p className="text-destructive font-semibold">Error loading profile</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || "Could not load photographer profile"}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout fullPage>
      <SEO
        title={`About ${photographer.name} — Portrait Photographer`}
        description={photographer.tagline}
        image={photographer.portraitImage.src}
        type="profile"
        structuredData={structuredData}
      />
      <AboutPageLayout photographer={photographer} />
    </Layout>
  );
}
