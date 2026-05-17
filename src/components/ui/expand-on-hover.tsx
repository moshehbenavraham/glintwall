"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import { cn } from "@/lib/utils";

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "smallTablet" | "largeTablet" | "desktop">(() => {
    // Initialize with correct value on mount to prevent flash
    if (typeof window === "undefined") return "desktop"; // SSR fallback
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 900) return "smallTablet";
    if (width < 1280) return "largeTablet";
    return "desktop";
  });

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 900) {
        setBreakpoint("smallTablet");
      } else if (width < 1280) {
        setBreakpoint("largeTablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    // No need to call checkBreakpoint() immediately since state is initialized correctly
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, []);

  return breakpoint;
};

/**
 * Caption metadata for a gallery image. When present, the component renders
 * the human-readable subject / profession instead of the raw `code` string.
 */
export interface ExpandImageCaption {
  subject: string;
  profession: string;
}

export interface ExpandImage {
  src: string;
  alt: string;
  /** Fallback label rendered when `caption` is absent (e.g. `Title — Year`). */
  code: string;
  caption?: ExpandImageCaption;
}

const HoverExpand_001 = ({
  images,
  className,
}: {
  images: ExpandImage[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number>(
    images.length > 1 ? 1 : 0,
  );
  const breakpoint = useBreakpoint();

  // Users with prefers-reduced-motion (or no JS motion preference) shouldn't
  // see entrance / hover / transition animations. framer-motion's
  // useReducedMotion subscribes to the media query reactively, so toggling
  // the OS setting updates the gallery without a refresh.
  const shouldReduceMotion = useReducedMotion() ?? false;
  const motionDuration = shouldReduceMotion ? 0 : 0.3;
  const swapDuration = shouldReduceMotion ? 0 : 0.3;
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialY = shouldReduceMotion ? 0 : 20;

  // Roving-tabindex refs so arrow-key navigation can shift focus between
  // cards without trapping Tab inside the gallery.
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // Track whether the active change came from the keyboard so we can move
  // focus there. Pure pointer hover / click shouldn't yank focus away from
  // wherever the user already had it.
  const lastInteractionRef = useRef<"keyboard" | "pointer">("pointer");

  const safeActive = Math.min(activeImage, images.length - 1);

  const activeCaptionText = useMemo(() => {
    const img = images[safeActive];
    if (!img) return "";
    if (img.caption) {
      return `${img.caption.subject} — ${img.caption.profession}`;
    }
    return img.code;
  }, [images, safeActive]);

  const handleKeyNavigation = useCallback(
    (
      // Handler is attached to the gallery wrapper (a <section>), and
      // framer-motion's typed `onKeyDown` event uses HTMLElement — keep the
      // generic permissive so callers don't fight the type checker.
      event: React.KeyboardEvent<HTMLElement>,
      visibleCount: number,
      orientation: "horizontal" | "vertical",
    ) => {
      const lastIndex = visibleCount - 1;
      const nextKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
      const prevKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

      let nextIndex: number | null = null;
      if (event.key === nextKey) {
        nextIndex = safeActive >= lastIndex ? 0 : safeActive + 1;
      } else if (event.key === prevKey) {
        nextIndex = safeActive <= 0 ? lastIndex : safeActive - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = lastIndex;
      }

      if (nextIndex === null) return;

      event.preventDefault();
      lastInteractionRef.current = "keyboard";
      setActiveImage(nextIndex);
    },
    [safeActive],
  );

  // Move focus to the active card whenever it changes via keyboard input.
  useEffect(() => {
    if (lastInteractionRef.current !== "keyboard") return;
    const target = buttonRefs.current[safeActive];
    if (target && document.activeElement !== target) {
      target.focus();
    }
  }, [safeActive]);

  // Responsive configuration based on breakpoint
  const config = {
    mobile: {
      layout: "list" as const,
      numVisible: images.length,
      height: "min(20rem, 40vh)",
      padding: "px-0",
    },
    smallTablet: {
      layout: "horizontal" as const,
      numVisible: 3,
      expandedPercent: 50,
      collapsedPercent: 25,
      height: "min(24rem, 45vh)",
      gap: "gap-2",
      padding: "px-0",
    },
    largeTablet: {
      layout: "horizontal" as const,
      numVisible: 4,
      expandedPercent: 46,
      collapsedPercent: 18,
      height: "min(28rem, 50vh)",
      gap: "gap-3",
      padding: "px-0",
    },
    desktop: {
      layout: "horizontal" as const,
      numVisible: 6,
      expandedWidth: "27.65625rem", // 442px - original fixed size
      collapsedWidth: "9.21875rem", // 147px - original fixed size
      height: "min(36.875rem, 60vh)",
      gap: "gap-5",
      padding: "px-0",
      maxWidth: "max-w-[1200px]",
    },
  }[breakpoint];

  const visibleImages = images.slice(0, config.numVisible);
  const orientation: "horizontal" | "vertical" =
    config.layout === "list" ? "vertical" : "horizontal";

  // Reset refs array length whenever the visible count changes so we don't
  // leak stale entries from a wider breakpoint.
  if (buttonRefs.current.length !== visibleImages.length) {
    buttonRefs.current = new Array(visibleImages.length).fill(null);
  }

  // Mobile: Vertical list layout
  if (config.layout === "list") {
    return (
      <motion.section
        aria-label="Portfolio gallery"
        initial={{ opacity: initialOpacity, translateY: initialY }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: motionDuration, delay: shouldReduceMotion ? 0 : 0.5 }}
        className={cn("relative w-full", config.padding, className)}
        onKeyDown={(event) =>
          handleKeyNavigation(event, visibleImages.length, orientation)
        }
      >
        <ul className="flex flex-col gap-4 w-full list-none p-0 m-0">
          {visibleImages.map((image, index) => {
            const captionLabel = image.caption
              ? `${image.caption.subject}, ${image.caption.profession}`
              : image.code;
            const isActive = safeActive === index;
            return (
              <motion.li
                key={`${image.src}-${index}`}
                initial={{ opacity: initialOpacity, translateY: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  duration: motionDuration,
                  delay: shouldReduceMotion ? 0 : index * 0.1,
                }}
                className="relative w-full"
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`View ${captionLabel}`}
                  onClick={() => {
                    lastInteractionRef.current = "pointer";
                    setActiveImage(index);
                  }}
                  className="relative w-full overflow-hidden rounded-2xl block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{ height: config.height }}
                >
                  <img
                    src={image.src}
                    className="size-full object-cover"
                    alt={image.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding={index === 0 ? "sync" : "async"}
                  />
                  {/* Stronger gradient so captions hit at least WCAG AA against
                      any underlying photo content. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    {image.caption ? (
                      <>
                        <p className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          {image.caption.subject}
                        </p>
                        <p className="text-xs text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                          {image.caption.profession}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {image.code}
                      </p>
                    )}
                  </div>
                </button>
              </motion.li>
            );
          })}
        </ul>

        {/* Polite live region so screen readers announce active changes
            triggered by keyboard navigation. */}
        <p className="sr-only" role="status" aria-live="polite">
          {`Active image: ${activeCaptionText}`}
        </p>
      </motion.section>
    );
  }

  // Horizontal layout for tablets and desktop
  return (
    <motion.section
      aria-label="Portfolio gallery"
      initial={{ opacity: initialOpacity, translateY: initialY }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: motionDuration, delay: shouldReduceMotion ? 0 : 0.5 }}
      className={cn("relative w-full", config.padding, className)}
      onKeyDown={(event) =>
        handleKeyNavigation(event, visibleImages.length, orientation)
      }
    >
      <motion.div
        initial={{ opacity: initialOpacity }}
        animate={{ opacity: 1 }}
        transition={{ duration: motionDuration }}
        className={cn("w-full mx-auto", "maxWidth" in config ? config.maxWidth : "")}
      >
        <ul
          className={cn(
            "flex w-full items-center justify-center list-none p-0 m-0",
            config.gap,
          )}
        >
          {visibleImages.map((image, index) => {
            const isActive = safeActive === index;
            const captionLabel = image.caption
              ? `${image.caption.subject}, ${image.caption.profession}`
              : image.code;

            // Desktop uses fixed widths, tablets use percentages
            const width =
              "expandedWidth" in config
                ? isActive
                  ? config.expandedWidth
                  : config.collapsedWidth
                : isActive
                  ? `${config.expandedPercent}%`
                  : `${config.collapsedPercent}%`;

            const initialWidth =
              "expandedWidth" in config
                ? config.collapsedWidth
                : `${config.collapsedPercent}%`;

            return (
              <motion.li
                key={`${image.src}-${index}`}
                className="relative overflow-hidden rounded-3xl"
                initial={{
                  width: initialWidth,
                  height: shouldReduceMotion ? config.height : "20rem",
                }}
                animate={{ width, height: config.height }}
                transition={{ duration: swapDuration, ease: "easeInOut" }}
              >
                <button
                  ref={(el) => {
                    buttonRefs.current[index] = el;
                  }}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={
                    isActive
                      ? `Currently viewing ${captionLabel}`
                      : `Show ${captionLabel}`
                  }
                  // Roving tabindex: only the active card is in the tab
                  // sequence. Arrow keys move focus + active state between
                  // siblings via the container keydown handler.
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    lastInteractionRef.current = "pointer";
                    setActiveImage(index);
                  }}
                  onMouseEnter={() => {
                    lastInteractionRef.current = "pointer";
                    setActiveImage(index);
                  }}
                  onFocus={() => {
                    // Pointer-focus (e.g. clicking) shouldn't override the
                    // pointer flag, but :focus-visible from arrow nav already
                    // set it to keyboard — no-op here.
                    setActiveImage(index);
                  }}
                  className="absolute inset-0 block w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-3xl"
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        aria-hidden="true"
                        initial={{ opacity: initialOpacity }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: motionDuration }}
                        className="absolute h-full w-full bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                      />
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: initialOpacity }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: motionDuration }}
                        className="absolute flex h-full w-full flex-col items-start justify-end p-5 sm:p-6"
                      >
                        {image.caption ? (
                          <>
                            <p className="text-left text-sm sm:text-base font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              {image.caption.subject}
                            </p>
                            <p className="text-left text-xs sm:text-sm text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              {image.caption.profession}
                            </p>
                          </>
                        ) : (
                          <p className="text-left text-sm font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                            {image.code}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <img
                    src={image.src}
                    className="size-full object-cover"
                    alt={image.alt}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding={index < 2 ? "sync" : "async"}
                  />
                </button>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      {/* Polite live region so screen readers announce active changes
          triggered by keyboard navigation or hover. */}
      <p className="sr-only" role="status" aria-live="polite">
        {`Active image: ${activeCaptionText}`}
      </p>
    </motion.section>
  );
};

export { HoverExpand_001 };
