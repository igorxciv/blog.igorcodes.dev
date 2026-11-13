"use client";

import { useEffect, useState } from "react";
import { type PostSection } from "@/lib/writing";

type PostContentsProps = {
  sections: PostSection[];
};

// Matches the breakpoint where globals.css hangs the contents in the left margin.
const WIDE_QUERY = "(min-width: 80rem)";

/**
 * The post's contents. On wide screens it hangs, always open, in the left
 * margin and follows the reader: the section being read is marked in cyan.
 * On narrower screens it is a disclosure under the title.
 */
export function PostContents({ sections }: PostContentsProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [wide, setWide] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);
    if (headings.length === 0) {
      return;
    }

    // The current section is the last heading above the upper third of the viewport.
    let frame = 0;
    const update = () => {
      frame = 0;
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
    const schedule = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [sections]);

  return (
    <nav aria-labelledby="contents-label" className="toc">
      <details
        open={wide || open}
        onToggle={(event) => {
          if (!wide) {
            setOpen(event.currentTarget.open);
          }
        }}
      >
        <summary id="contents-label" className="section-label">
          Contents
        </summary>
        <ol>
          {sections.map((section) => (
            <li key={section.id} data-depth={section.depth}>
              <a
                href={`#${section.id}`}
                aria-current={section.id === currentId ? "location" : undefined}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
