import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

const NEXT_THEME: Record<Theme, Theme> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<Theme, string> = {
  light: "Switch to dark theme",
  dark: "Switch to system theme",
  system: "Switch to light theme",
};

/**
 * Cycle button: light → dark → system → light.
 *
 * Returns `null` until after mount so the SSR-style hydration mismatch
 * warning in `next-themes` stays quiet on first render (the icon would
 * otherwise briefly render with the SSR default before the client
 * resolves the real theme).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Reserve the same footprint so the header doesn't reflow on hydrate.
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-9 w-9 ${className}`}
      />
    );
  }

  const current = (theme ?? "system") as Theme;
  const next = NEXT_THEME[current];
  const Icon =
    current === "system" ? Monitor : current === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={LABEL[current]}
      title={LABEL[current]}
      data-current-theme={current}
      data-resolved-theme={resolvedTheme}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
      <span className="sr-only">{LABEL[current]}</span>
    </button>
  );
}
