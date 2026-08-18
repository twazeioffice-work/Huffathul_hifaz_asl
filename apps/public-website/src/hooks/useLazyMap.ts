"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface UseLazyMapOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useLazyMap(
  options: UseLazyMapOptions = { rootMargin: "200px", threshold: 0 }
): [RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(target);

    return () => observer.disconnect();
  }, [options]);

  return [containerRef, isVisible];
}
