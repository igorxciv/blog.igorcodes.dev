"use client";

const READ_STORAGE_KEY = "daybook-read";
const READ_EVENT = "daybook-read-change";

export function readSlugs(): Set<string> {
  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return new Set(
      Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === "string")
        : [],
    );
  } catch {
    return new Set();
  }
}

export function markSlugRead(slug: string) {
  const slugs = readSlugs();
  if (slugs.has(slug)) {
    return;
  }
  slugs.add(slug);
  try {
    window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify([...slugs]));
    window.dispatchEvent(new Event(READ_EVENT));
  } catch {
    // Storage blocked: the mark simply does not persist.
  }
}

export function subscribeToReads(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === READ_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener(READ_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(READ_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
