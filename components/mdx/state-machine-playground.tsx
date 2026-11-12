"use client";

import { clsx } from "clsx";
import { useMemo, useState } from "react";

type Mode = "history" | "state";
type FieldKey = "goal" | "audience" | "timeline";

type Field = { key: FieldKey; label: string; value: string };

const fields: [Field, ...Field[]] = [
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

type StateMachinePlaygroundProps = {
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export function StateMachinePlayground({
  headingLevel = 3,
}: StateMachinePlaygroundProps = {}) {
  const Heading = `h${headingLevel}` as const;
  const [mode, setMode] = useState<Mode>("history");
  const [turns, setTurns] = useState(6);
  const [completedFields, setCompletedFields] = useState<FieldKey[]>(["goal"]);

  const activeField =
    fields.find((field) => !completedFields.includes(field.key)) ??
    fields[fields.length - 1] ??
    fields[0];

  const stats = useMemo(() => {
    if (mode === "history") {
      return {
        tokens: 450 + turns * 380,
        latency: 0.7 + turns * 0.31,
        correctness: clamp(
          101 - turns * 4.3 - completedFields.length * 2.5,
          58,
          98,
        ),
      };
    }

    return {
      tokens: 460 + completedFields.length * 70,
      latency: 0.78 + completedFields.length * 0.06,
      correctness: clamp(93 + completedFields.length * 1.4, 90, 98),
    };
  }, [completedFields.length, mode, turns]);

  const statePreview = fields.reduce<Record<FieldKey, string | null>>(
    (accumulator, field) => {
      accumulator[field.key] = completedFields.includes(field.key)
        ? field.value
        : null;
      return accumulator;
    },
    { goal: null, audience: null, timeline: null },
  );

  function collectNextField() {
    const nextField = fields.find(
      (field) => !completedFields.includes(field.key),
    );

    if (!nextField) {
      setCompletedFields([]);
      setTurns(1);
      return;
    }

    setCompletedFields((current) => [...current, nextField.key]);
    setTurns((current) => clamp(current + 1, 1, 12));
  }

  return (
    <section className="my-8 overflow-hidden  border border-(--rule) bg-(--paper)  lg:my-10">
      <div className="border-b border-(--rule)  px-4 py-4 sm:px-5 lg:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            className="m-0 text-xl leading-tight text-(--ink) sm:text-2xl"
            style={{ fontWeight: 600 }}
          >
            Transcript memory vs explicit state
          </Heading>
          <div className="grid grid-cols-2 gap-2  border border-(--rule) bg-(--paper-sunk) p-1">
            <button
              type="button"
              aria-pressed={mode === "history"}
              onClick={() => setMode("history")}
              className={clsx(
                "inline-flex min-h-10 items-center justify-center gap-2  px-3 text-sm",
                mode === "history"
                  ? "bg-(--paper-sunk) font-semibold text-(--ink) "
                  : "text-(--ink-soft) hover:text-(--ink)",
              )}
            >
              History
            </button>
            <button
              type="button"
              aria-pressed={mode === "state"}
              onClick={() => setMode("state")}
              className={clsx(
                "inline-flex min-h-10 items-center justify-center gap-2  px-3 text-sm",
                mode === "state"
                  ? "bg-(--paper-sunk) font-semibold text-(--ink) "
                  : "text-(--ink-soft) hover:text-(--ink)",
              )}
            >
              State
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border-b border-(--rule) p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric
              label="Tokens"
              value={`~${stats.tokens.toLocaleString()}`}
            />
            <Metric label="Latency" value={`${stats.latency.toFixed(1)}s`} />
            <Metric
              label="Correct flow"
              value={formatPercent(stats.correctness)}
            />
          </div>

          <p aria-live="polite" className="sr-only">
            {`Turn ${turns} of 12. ~${stats.tokens.toLocaleString()} tokens used, ${formatPercent(stats.correctness)} correct flow.`}
          </p>

          <label className="mt-6 block">
            <span className="flex items-center justify-between text-sm text-(--ink-soft)">
              Conversation turns
              <span className="ledger-face text-(--ink)">{turns}</span>
            </span>
            <input
              type="range"
              min="1"
              max="12"
              value={turns}
              aria-valuetext={`Turn ${turns} of 12`}
              onChange={(event) => setTurns(Number(event.target.value))}
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-6  border border-(--rule) bg-(--paper-sunk) p-4">
            <div className="flex items-center gap-2 text-sm text-(--ink)">
              Assistant behavior
            </div>
            <p className="mb-0 mt-3 text-sm leading-7 text-(--ink-soft)">
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
                    "flex min-h-14 items-center justify-between gap-3  border px-4 py-3",
                    isComplete
                      ? "border-(--ink) bg-(--paper)"
                      : isActive
                        ? "border-(--ink) bg-(--paper)"
                        : "border-(--rule) bg-(--paper)",
                  )}
                >
                  <div>
                    <p
                      className="m-0 text-sm text-(--ink)"
                      style={{ fontWeight: 600 }}
                    >
                      {field.label}
                    </p>
                    <p className="m-0 mt-1 text-sm text-(--ink-soft)">
                      {isComplete
                        ? field.value
                        : isActive
                          ? "Ask this next"
                          : "Still missing"}
                    </p>
                  </div>
                  {isComplete ? (
                    <span className="ledger-face text-[0.8125rem] text-(--ink)">
                      done
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5  border border-(--rule) bg-(--paper-sunk) p-4">
            <p className="m-0 ledger-face text-[0.8125rem] text-(--pencil)">
              Structured Output
            </p>
            {/* biome-ignore lint/a11y/useSemanticElements: a <pre> scroll container cannot be a <section>; role="region" names it for AT */}
            <pre
              role="region"
              aria-label="State output" // biome-ignore lint/a11y/noNoninteractiveTabindex: horizontally-scrollable region must be keyboard-focusable (WCAG 2.1.1)
              tabIndex={0}
              className="m-0 mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[0.82rem] leading-6 text-(--ink)"
            >
              {JSON.stringify(
                {
                  message:
                    completedFields.length === fields.length
                      ? "All set. I have enough to continue."
                      : `What should I know about the ${activeField.label.toLowerCase()}?`,
                  is_ready: completedFields.length === fields.length,
                  suggestions:
                    completedFields.length === fields.length
                      ? []
                      : suggestionSets[activeField.key],
                  next_field:
                    completedFields.length === fields.length
                      ? null
                      : activeField.key,
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
              className="inline-flex min-h-11 items-center gap-2  border border-(--ink) bg-(--paper) px-4 text-sm text-(--ink) hover:border-(--ink)"
            >
              {completedFields.length === fields.length
                ? "Reset flow"
                : "Answer next field"}
            </button>
            <button
              type="button"
              onClick={() => {
                setCompletedFields(["goal"]);
                setTurns(6);
              }}
              className="inline-flex min-h-11 items-center gap-2  border border-(--rule) bg-(--paper) px-4 text-sm text-(--ink-soft) hover:text-(--ink)"
            >
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
    <div className="border border-(--rule) bg-(--paper-sunk) px-4 py-3">
      <p className="m-0 ledger-face text-[0.8125rem] text-(--pencil)">
        {label}
      </p>
      <p className="m-0 mt-2 text-xl text-(--ink)" style={{ fontWeight: 600 }}>
        {value}
      </p>
    </div>
  );
}
