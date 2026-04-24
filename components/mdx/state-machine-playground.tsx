"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bot, Check, History, ListChecks, RotateCcw, Shuffle } from "lucide-react";
import { clsx } from "clsx";

type Mode = "history" | "state";
type FieldKey = "goal" | "audience" | "timeline";

const fields: Array<{ key: FieldKey; label: string; value: string }> = [
  { key: "goal", label: "Goal", value: "Launch a cleaner onboarding flow" },
  { key: "audience", label: "Audience", value: "Small engineering teams" },
  { key: "timeline", label: "Timeline", value: "Two weeks" },
];

const suggestionSets: Record<FieldKey, string[]> = {
  goal: ["Reduce drop-off", "Collect cleaner requirements"],
  audience: ["Founders", "Internal platform users"],
  timeline: ["This sprint", "Before the next release"],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function StateMachinePlayground() {
  const [mode, setMode] = useState<Mode>("history");
  const [turns, setTurns] = useState(6);
  const [completedFields, setCompletedFields] = useState<FieldKey[]>(["goal"]);

  const activeField = fields.find((field) => !completedFields.includes(field.key)) ?? fields[fields.length - 1];

  const stats = useMemo(() => {
    if (mode === "history") {
      return {
        tokens: 450 + turns * 380,
        latency: 0.7 + turns * 0.31,
        correctness: clamp(101 - turns * 4.3 - completedFields.length * 2.5, 58, 98),
      };
    }

    return {
      tokens: 460 + completedFields.length * 70,
      latency: 0.78 + completedFields.length * 0.06,
      correctness: clamp(93 + completedFields.length * 1.4, 90, 98),
    };
  }, [completedFields.length, mode, turns]);

  const statePreview = fields.reduce<Record<FieldKey, string | null>>(
    (accumulator, field) => ({
      ...accumulator,
      [field.key]: completedFields.includes(field.key) ? field.value : null,
    }),
    { goal: null, audience: null, timeline: null },
  );

  function collectNextField() {
    const nextField = fields.find((field) => !completedFields.includes(field.key));

    if (!nextField) {
      setCompletedFields([]);
      setTurns(1);
      return;
    }

    setCompletedFields((current) => [...current, nextField.key]);
    setTurns((current) => clamp(current + 1, 1, 12));
  }

  return (
    <section className="my-8 overflow-hidden rounded-[1.8rem] border border-(--border-strong) bg-(--surface-raised) shadow-[var(--fm-shadow-elevated)] lg:my-10">
      <div className="border-b border-(--border) bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-soft)_44%,transparent),transparent)] px-4 py-4 sm:px-5 lg:px-6">
        <p className="m-0 text-[0.7rem] uppercase tracking-[0.22em] text-(--foreground-soft)">Interactive Model</p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="m-0 text-xl leading-tight text-(--foreground) sm:text-2xl" style={{ fontWeight: 600 }}>
            Transcript memory vs explicit state
          </h3>
          <div className="grid grid-cols-2 gap-2 rounded-full border border-(--border) bg-(--surface-inset) p-1">
            <button
              type="button"
              aria-pressed={mode === "history"}
              onClick={() => setMode("history")}
              className={clsx(
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-sm transition",
                mode === "history"
                  ? "bg-(--accent-soft) text-(--foreground) shadow-[0_8px_18px_color-mix(in_srgb,var(--fm-shadow-glow)_16%,transparent)]"
                  : "text-(--foreground-soft) hover:text-(--foreground)",
              )}
            >
              <History aria-hidden="true" className="size-4" />
              History
            </button>
            <button
              type="button"
              aria-pressed={mode === "state"}
              onClick={() => setMode("state")}
              className={clsx(
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-sm transition",
                mode === "state"
                  ? "bg-(--accent-soft) text-(--foreground) shadow-[0_8px_18px_color-mix(in_srgb,var(--fm-shadow-glow)_16%,transparent)]"
                  : "text-(--foreground-soft) hover:text-(--foreground)",
              )}
            >
              <ListChecks aria-hidden="true" className="size-4" />
              State
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-(--border) p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Tokens" value={`~${stats.tokens.toLocaleString()}`} />
            <Metric label="Latency" value={`${stats.latency.toFixed(1)}s`} />
            <Metric label="Correct flow" value={formatPercent(stats.correctness)} />
          </div>

          <label className="mt-6 block">
            <span className="flex items-center justify-between text-sm text-(--foreground-soft)">
              Conversation turns
              <span className="font-mono text-(--foreground)">{turns}</span>
            </span>
            <input
              type="range"
              min="1"
              max="12"
              value={turns}
              onChange={(event) => setTurns(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-6 rounded-[1.2rem] border border-(--border) bg-(--surface-inset) p-4">
            <div className="flex items-center gap-2 text-sm text-(--foreground)">
              <Bot aria-hidden="true" className="size-4 text-(--accent)" />
              Assistant behavior
            </div>
            <p className="mb-0 mt-3 text-sm leading-7 text-(--foreground-soft)">
              {mode === "history"
                ? "The model rereads the whole chat, infers what has already happened, then guesses the next best question."
                : "The backend gives the model the current facts, the missing field, and a narrow job: produce the next useful turn."}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 lg:p-6">
          <div className="grid gap-3">
            {fields.map((field) => {
              const isComplete = completedFields.includes(field.key);
              const isActive = field.key === activeField.key && !isComplete;

              return (
                <div
                  key={field.key}
                  className={clsx(
                    "flex min-h-14 items-center justify-between gap-3 rounded-[1.1rem] border px-4 py-3",
                    isComplete
                      ? "border-(--accent-line) bg-(--accent-soft)"
                      : isActive
                        ? "border-amber-500/40 bg-amber-500/10"
                        : "border-(--border) bg-(--surface)",
                  )}
                >
                  <div>
                    <p className="m-0 text-sm text-(--foreground)" style={{ fontWeight: 600 }}>
                      {field.label}
                    </p>
                    <p className="m-0 mt-1 text-sm text-(--foreground-soft)">
                      {isComplete ? field.value : isActive ? "Ask this next" : "Still missing"}
                    </p>
                  </div>
                  {isComplete ? <Check aria-hidden="true" className="size-5 text-(--accent)" /> : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.2rem] border border-(--border) bg-(--surface-inset) p-4">
            <p className="m-0 text-[0.7rem] uppercase tracking-[0.22em] text-(--foreground-soft)">Structured Output</p>
            <pre className="m-0 mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.82rem] leading-6 text-(--foreground)">
              {JSON.stringify(
                {
                  message: completedFields.length === fields.length
                    ? "All set. I have enough to continue."
                    : `What should I know about the ${activeField.label.toLowerCase()}?`,
                  is_ready: completedFields.length === fields.length,
                  suggestions: completedFields.length === fields.length ? [] : suggestionSets[activeField.key],
                  next_field: completedFields.length === fields.length ? null : activeField.key,
                  state: statePreview,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={collectNextField}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--accent-line) bg-(--accent-soft) px-4 text-sm text-(--foreground) transition hover:border-(--accent)"
            >
              {completedFields.length === fields.length ? <RotateCcw aria-hidden="true" className="size-4" /> : <ArrowRight aria-hidden="true" className="size-4" />}
              {completedFields.length === fields.length ? "Reset flow" : "Answer next field"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCompletedFields(["goal"]);
                setTurns(6);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-4 text-sm text-(--foreground-soft) transition hover:text-(--foreground)"
            >
              <Shuffle aria-hidden="true" className="size-4" />
              Replay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-(--border) bg-(--surface-inset) px-4 py-3">
      <p className="m-0 text-[0.68rem] uppercase tracking-[0.2em] text-(--foreground-soft)">{label}</p>
      <p className="m-0 mt-2 text-xl text-(--foreground)" style={{ fontWeight: 600 }}>
        {value}
      </p>
    </div>
  );
}
