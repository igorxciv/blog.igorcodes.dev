"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, House, Terminal } from "lucide-react";

const GLITCH_CHARS = ["404", "4Ø4", "4□4", "404", "4o4", "404"] as const;
const FULL_COMMAND = "$ page not found";
const STATIC_CODE = "404";

function shouldAllowAnimatedEffects() {
  const prefersReducedMotion =
    "matchMedia" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const prefersDataSaving = typeof connection?.saveData === "boolean" && connection.saveData;

  return !prefersReducedMotion && !prefersDataSaving;
}

export function NotFoundPage() {
  const commandRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);
  const codeShadowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const allowAnimatedEffects = shouldAllowAnimatedEffects();
    const commandElement = commandRef.current;
    const codeElement = codeRef.current;
    const codeShadowElement = codeShadowRef.current;

    const setCode = (value: string) => {
      if (codeElement) {
        codeElement.textContent = value;
      }

      if (codeShadowElement) {
        codeShadowElement.textContent = value;
      }
    };

    if (!allowAnimatedEffects) {
      return;
    }

    if (commandElement) {
      commandElement.textContent = "";
    }

    let commandIndex = 0;
    const typingInterval = window.setInterval(() => {
      commandIndex += 1;
      if (commandElement) {
        commandElement.textContent = FULL_COMMAND.slice(0, commandIndex);
      }

      if (commandIndex >= FULL_COMMAND.length) {
        window.clearInterval(typingInterval);
      }
    }, 85);

    const glitchInterval = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * GLITCH_CHARS.length);
      setCode(GLITCH_CHARS[randomIndex]);
    }, 160);

    const glitchStopTimeout = window.setTimeout(() => {
      window.clearInterval(glitchInterval);
      setCode(STATIC_CODE);
    }, 12000);

    return () => {
      window.clearInterval(typingInterval);
      window.clearInterval(glitchInterval);
      window.clearTimeout(glitchStopTimeout);
    };
  }, []);

  function handleBackClick() {
    const hasReferrer = Boolean(document.referrer);
    const referrerUrl = hasReferrer ? new URL(document.referrer, window.location.href) : null;
    const isSameOriginReferrer =
      referrerUrl &&
      referrerUrl.origin === window.location.origin &&
      referrerUrl.href !== window.location.href;

    if (isSameOriginReferrer) {
      window.location.assign(`${referrerUrl.pathname}${referrerUrl.search}${referrerUrl.hash}`);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.assign("/blog");
  }

  return (
    <section
      aria-describedby="page-not-found-description"
      aria-labelledby="page-not-found-title"
      className="relative isolate grid min-h-[calc(100svh-14rem)] place-items-center overflow-hidden py-8 sm:min-h-[calc(100svh-16rem)]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgb(0_217_255_/_0.16)_1px,transparent_1px),linear-gradient(90deg,rgb(0_217_255_/_0.16)_1px,transparent_1px)] bg-[size:50px_50px] opacity-[0.055]"
      />

      <div className="relative z-10 w-full max-w-[44rem]">
        <div className="overflow-hidden rounded-xl border border-[var(--border-strong)] bg-linear-to-b from-[rgb(18_18_18)] to-[rgb(15_15_15)] motion-safe:animate-[fade-in_420ms_ease-out_both]">
          <div className="flex min-h-11 items-center gap-3 border-b border-[var(--border-strong)] bg-[var(--surface-strong)] px-4 py-3">
            <span className="inline-flex items-center gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </span>

            <span className="ml-1 inline-flex items-center gap-1.5 text-xs text-[#707070]" aria-hidden="true">
              <Terminal className="size-3.5" />
              terminal
            </span>
          </div>

          <div className="px-[1.15rem] pt-[1.15rem] pb-[1.25rem] font-mono">
            <p className="m-0 text-[0.95rem] leading-[1.55] text-[var(--accent)]">
              <span ref={commandRef}>{FULL_COMMAND}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-current motion-safe:animate-[fm-cursor-blink_820ms_steps(1)_infinite]"
              />
            </p>
            <p className="mt-2 text-[0.86rem] leading-6 text-[#8a8a8a]">
              Error: ENOENT: no such file or directory.
            </p>
            <p className="mt-2 text-[0.86rem] leading-6 text-[#ff5f56]">
              The requested page could not be found.
            </p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="relative mt-8 text-center text-[clamp(6.2rem,42vw,13rem)] leading-[0.82] font-bold tracking-[-0.05em]"
        >
          <span
            ref={codeShadowRef}
            className="absolute inset-0 inline-block min-w-[3ch] text-center text-[var(--accent)] opacity-[0.22] blur-[6px]"
          >
            {STATIC_CODE}
          </span>
          <span ref={codeRef} className="relative inline-block min-w-[3ch] text-center">
            {STATIC_CODE}
          </span>
        </p>

        <header className="mt-4 text-center">
          <h1
            id="page-not-found-title"
            className="m-0 text-balance font-mono text-[clamp(1.7rem,7.5vw,2.5rem)] leading-[1.15] font-medium tracking-[0.01em]"
          >
            Page Not Found
          </h1>
          <p
            id="page-not-found-description"
            className="mx-auto mt-3 max-w-[35rem] text-pretty text-[clamp(1rem,3.8vw,1.12rem)] leading-[1.5] font-light text-[var(--muted)]"
          >
            The page you&apos;re looking for doesn&apos;t exist, was moved, or the URL is incorrect.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/blog"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-[var(--accent)] px-4 py-2 font-mono text-[0.96rem] font-medium text-black transition hover:-translate-y-px hover:bg-[var(--accent-strong)] active:translate-y-0 active:scale-[0.98]"
          >
            <House aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <button
            type="button"
            onClick={handleBackClick}
            className="focus-ring inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-transparent px-4 py-2 font-mono text-[0.96rem] font-medium text-[var(--foreground)] transition hover:-translate-y-px hover:border-[var(--accent)] hover:bg-[rgb(0_217_255_/_0.08)] active:translate-y-0 active:scale-[0.98]"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Go Back
          </button>
        </div>

        <nav aria-label="Suggested destinations" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--foreground-soft)]">
          <Link href="/blog" className="focus-ring rounded-sm transition hover:text-[var(--foreground)]">
            Home
          </Link>
          <Link href="/blog#articles" className="focus-ring rounded-sm transition hover:text-[var(--foreground)]">
            Articles
          </Link>
          <Link href="/rss.xml" className="focus-ring rounded-sm transition hover:text-[var(--foreground)]">
            RSS
          </Link>
        </nav>
      </div>
    </section>
  );
}
