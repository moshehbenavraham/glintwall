import { ReactNode } from "react";
import { HeaderNavigation } from "./HeaderNavigation";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  fullPage?: boolean;
}

/**
 * Skip-to-content link rendered as the first focusable element on every
 * page. It's visually hidden until focused (keyboard or screen reader),
 * then appears as a pill anchored to the top-left.
 */
function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      Skip to main content
    </a>
  );
}

export function Layout({ children, fullPage = false }: LayoutProps) {
  // Full page scroll layout (for About and other content pages) - Same grid, scrollable
  if (fullPage) {
    return (
      <>
        <SkipToContent />
        <div
          className="grid w-screen min-h-screen items-start mt-[80px] sm:mt-[100px] lg:mt-[130px] layout-full-page"
          style={{
            gridTemplateRows: "1fr auto 0",
            overscrollBehavior: "contain",
          }}
        >
          <style>{`
            .layout-full-page {
              grid-template-columns: [full-start] 1rem [content-start] 1fr [content-end] 1rem [full-end];
            }
            @media (min-width: 768px) {
              .layout-full-page {
                grid-template-columns: [full-start] 2.5rem [content-start] 1fr [content-end] 2.5rem [full-end];
              }
            }
            @media (min-width: 1024px) {
              .layout-full-page {
                grid-template-columns: [full-start] 1fr [content-start] min(1200px, 100%) [content-end] 1fr [full-end];
              }
            }
          `}</style>
          {/* Content in same grid row as Home - natural page scroll */}
          <div
            className="flex flex-col gap-6 sm:gap-8 lg:gap-[50px]"
            style={{
              gridColumn: "content-start / content-end",
              gridRow: "2",
            }}
          >
            <header className="flex-shrink-0 flex justify-center">
              <HeaderNavigation />
            </header>
            <main id="main-content" tabIndex={-1} className="flex-shrink-0">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  // Grid centered layout (for Home gallery)
  return (
    <>
      <SkipToContent />
      <div
        className="grid w-screen min-h-screen overflow-y-auto md:h-screen md:max-h-screen md:overflow-hidden items-start md:items-center layout-home"
        style={{
          gridTemplateRows: "auto 1fr",
          overscrollBehavior: "contain",
        }}
      >
        <style>{`
          .layout-home {
            grid-template-columns: [full-start] 1rem [content-start] 1fr [content-end] 1rem [full-end];
          }
          @media (min-width: 768px) {
            .layout-home {
              grid-template-columns: [full-start] 2.5rem [content-start] 1fr [content-end] 2.5rem [full-end];
              grid-template-rows: 1fr minmax(500px, calc(100vh - 200px)) 1fr;
            }
          }
          @media (min-width: 1024px) {
            .layout-home {
              grid-template-columns: [full-start] 1fr [content-start] min(1200px, 100%) [content-end] 1fr [full-end];
              grid-template-rows: 1fr min(740px, calc(100vh - 260px)) 1fr;
            }
          }
        `}</style>
        {/* Centered container for header + gallery */}
        <div
          className="flex flex-col gap-6 sm:gap-8 lg:gap-[50px] pointer-events-auto pt-[80px] sm:pt-[100px] md:pt-0"
          style={{
            gridColumn: "content-start / content-end",
            gridRow: "2",
          }}
        >
          {/* Header: Minimal height */}
          <header className="flex-shrink-0 flex justify-center">
            <HeaderNavigation />
          </header>

          {/* Main Content: Gallery */}
          <main id="main-content" tabIndex={-1} className="flex-shrink-0">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
