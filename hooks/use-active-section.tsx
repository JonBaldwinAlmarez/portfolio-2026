"use client";

import { useEffect, useState } from "react";

// Tracks which section is currently active in the viewport.
export function useActiveSection(ids: string[]) {
  // Initializes the active section using the first ID in the list.
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    // Detects when a section enters or leaves the active viewport area.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Updates the active section when it intersects the viewport.
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // Defines the central viewport area used to determine the active section.
      { rootMargin: "-40% 0px -55% 0px" },
    );

    // Observes each section that exists in the DOM.
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    // Stops observing sections when the effect is cleaned up.
    return () => observer.disconnect();
  }, [ids]);

  // Returns the ID of the currently active section.
  return activeId;
}
