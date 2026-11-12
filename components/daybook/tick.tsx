"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { markSlugRead, readSlugs, subscribeToReads } from "./read-state";

/** The red pen tick a book-keeper makes against a checked line. */
export function Tick({ label }: { label?: string }) {
  return (
    <>
      <svg
        className="tick"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M2.5 9.2 6.3 12.8 13.6 3.4" />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}

/** A tick against an entry this device has read to the end. Nothing on the server. */
export function ReadTick({ slug }: { slug: string }) {
  const isRead = useSyncExternalStore(
    subscribeToReads,
    () => readSlugs().has(slug),
    () => false,
  );

  return isRead ? <Tick label="read" /> : null;
}

/** Invisible sentinel at the end of an entry; ticks it as read once reached. */
export function MarkReadOnReach({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        markSlugRead(slug);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [slug]);

  return <div ref={ref} aria-hidden="true" />;
}
