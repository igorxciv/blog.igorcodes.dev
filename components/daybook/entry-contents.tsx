"use client";

import { useEffect, useId, useRef, useState } from "react";
import { type EntrySection } from "@/lib/daybook";
import { Tick } from "./tick";

type EntryContentsProps = {
  folioLabel: string;
  sections: EntrySection[];
  /** id of the entry title; once it scrolls away the narrow bar names the current section. */
  titleId: string;
};

/**
 * The entry's contents, kept beside the text. On wide screens it is a sticky
 * column that ticks off each section as the reader passes it; on narrow
 * screens it is a sticky cloth bar naming the current section, with the same
 * list behind a disclosure button.
 */
export function EntryContents({
  folioLabel,
  sections,
  titleId,
}: EntryContentsProps) {
  const [titleGone, setTitleGone] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const title = document.getElementById(titleId);
    if (!title) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setTitleGone(entry ? !entry.isIntersecting : false);
    });
    observer.observe(title);
    return () => observer.disconnect();
  }, [titleId]);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);
    if (headings.length === 0) {
      return;
    }

    // The current section is the last heading above the upper third of the viewport.
    const update = () => {
      const line = window.innerHeight * 0.33;
      let active: string | null = null;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) {
          active = heading.id;
        } else {
          break;
        }
      }
      setCurrentId(active);
    };

    const observer = new IntersectionObserver(update, {
      rootMargin: "0px 0px -66% 0px",
    });
    for (const heading of headings) {
      observer.observe(heading);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [sections]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const currentIndex = sections.findIndex(
    (section) => section.id === currentId,
  );
  const current = currentIndex >= 0 ? sections[currentIndex] : undefined;

  return (
    <nav
      ref={rootRef}
      aria-label="Entry contents"
      className="entry-contents"
      data-open={open ? "true" : "false"}
    >
      <div className="entry-contents-bar">
        <span className="entry-contents-folio">{folioLabel}</span>
        <span className="entry-contents-current" aria-hidden="true">
          {titleGone && current ? `${current.number}  ${current.title}` : ""}
        </span>
        <button
          ref={toggleRef}
          type="button"
          className="entry-contents-toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close contents" : "Contents"}
        </button>
      </div>

      <p className="col-head entry-contents-head" aria-hidden="true">
        <span>Contents</span>
        <abbr title="Minute the section starts">Min.</abbr>
      </p>
      <ol id={listId} className="entry-contents-list">
        {sections.map((section, index) => {
          const isCurrent = index === currentIndex;
          const isPassed = currentIndex >= 0 && index <= currentIndex;
          return (
            <li key={section.id} className={`depth-${section.depth}`}>
              <a
                href={`#${section.id}`}
                aria-current={isCurrent ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="entry-contents-no">{section.number}</span>
                <span className="entry-contents-title">{section.title}</span>
                <span className="entry-contents-mark">
                  {isPassed ? <Tick /> : null}
                </span>
                <span className="entry-contents-minute">
                  <span className="sr-only">, starts at minute </span>
                  {section.startMinute}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
