import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  // Tell React how to listen for changes (window resize, etc.)
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // value in the browser
    () => false, // value on the server (it has no screen)
  );
}
