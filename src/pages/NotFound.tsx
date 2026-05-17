import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/seo/SEO";
import { SITE_NAME } from "@/lib/site";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log unmatched routes once per mount so the dev console hints at the
    // path that bounced — without spamming on re-render.
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[404] No route matched ${location.pathname}`);
    }
  }, [location.pathname]);

  return (
    <Layout fullPage>
      <SEO
        title={`Page not found — ${SITE_NAME}`}
        description="The page you're looking for doesn't exist. Browse the portfolio instead."
        type="website"
        noindex
      />
      <section
        aria-labelledby="not-found-heading"
        className="flex flex-col items-center justify-center text-center min-h-[55vh] py-12"
      >
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
          404 — Lost frame
        </p>
        <h1
          id="not-found-heading"
          className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground mb-4"
        >
          This page got away.
        </h1>
        <p className="max-w-xl text-base sm:text-lg text-muted-foreground mb-8 px-4">
          The link you followed may be old or the page may have moved. The
          portfolio is still here, though — pick up where you left off.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back to gallery
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background text-foreground px-6 py-3 text-sm font-medium hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            About Jamie
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
