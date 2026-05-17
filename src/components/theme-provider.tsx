import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

/**
 * Thin wrapper around `next-themes` so we can configure `attribute`,
 * `defaultTheme`, etc. once at the App root and keep the import path
 * inside our own component tree.
 *
 * The matching anti-FOUC bootstrap script lives in `index.html` — keep
 * the `storageKey` here in sync with the key the inline script reads
 * (`visual-gallery-theme`).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
