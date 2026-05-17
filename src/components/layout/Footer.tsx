import { usePortfolio } from '@/context/PortfolioContext';

export function Footer() {
  const { photographer } = usePortfolio();

  if (!photographer) return null;

  // Simple email obfuscation for the visible label (real anchor stays
  // mailto: so click-to-email still works for keyboard users).
  const obfuscateEmail = (email: string) => email.replace('@', ' [at] ');

  return (
    <footer
      role="contentinfo"
      className="mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8 border-t border-border bg-background"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.8125rem] leading-4 text-muted-foreground">
          {/* Contact Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href={`mailto:${photographer.contact.email}`}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              aria-label={`Email ${photographer.name}`}
            >
              {obfuscateEmail(photographer.contact.email)}
            </a>
            <a
              href={`tel:${photographer.contact.phone.replace(/\s+/g, '')}`}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              aria-label={`Call ${photographer.name}`}
            >
              {photographer.contact.phone}
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center sm:text-right">
            &copy; {new Date().getFullYear()} {photographer.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
