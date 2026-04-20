"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  applyAutoUnlockRoutes,
  applyEffect,
  createInitialState,
  evalPredicate,
  pickQuickEvent,
  type DialogueLine,
  type Scenario,
} from "@/lib/story-format";

function StatPill({ label, value }: { label: string; value: number }) {
  const tone =
    value >= 75
      ? "border border-emerald-200/80 bg-emerald-50/85 text-emerald-800"
      : value >= 50
        ? "border border-sky-200/80 bg-sky-50/85 text-sky-800"
        : value >= 25
          ? "border border-fuchsia-200/70 bg-fuchsia-50/80 text-fuchsia-800"
          : "border border-rose-200/80 bg-rose-50/85 text-rose-800";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-sm ${tone}`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button" 
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full rounded-2xl px-5 py-4 text-left text-base font-semibold",
        "border border-pink-200/70 bg-gradient-to-b from-pink-50/95 to-pink-100/90 text-fuchsia-900 shadow-[0_6px_18px_rgba(244,114,182,0.28)] transition-all",
        disabled
          ? "opacity-55 grayscale-[0.1]"
          : "hover:from-pink-50 hover:to-pink-200/95 hover:shadow-[0_8px_22px_rgba(244,114,182,0.34)] active:translate-y-[1px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/90",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function StoryClient({ scenario }: { scenario: Scenario }) {
  const [state, setState] = useState(() => createInitialState(scenario));
  const [lineIndex, setLineIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string }>>([]);
  const [visibleChars, setVisibleChars] = useState(0);

  const node = scenario.nodes[state.nodeId];
  const activeEvent = useMemo(() => {
    if (state.mode !== "event" || !state.activeEventId) return null;
    return scenario.quickEvents?.find((e) => e.id === state.activeEventId) ?? null;
  }, [scenario.quickEvents, state.activeEventId, state.mode]);

  const characterNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of scenario.characters) map[c.id] = c.name;
    return map;
  }, [scenario.characters]);

  const displayNameById = useMemo(() => {
    return { ...characterNameById, ...state.nameOverrides };
  }, [characterNameById, state.nameOverrides]);

  const currentLines: DialogueLine[] = useMemo(() => {
    if (state.mode === "event" && activeEvent) {
      return (
        activeEvent.lines ??
        activeEvent.body.map((t) => ({ text: t }))
      );
    }
    if (!node) return [];
    return node.lines ?? node.body.map((t) => ({ text: t }));
  }, [activeEvent, node, state.mode]);

  const currentLine = currentLines[lineIndex] ?? null;
  const atEndOfLines = lineIndex >= Math.max(0, currentLines.length - 1);
  const currentText = currentLine?.text ?? "";
  const isTyping = visibleChars < currentText.length;
  const displayedText = currentText.slice(0, visibleChars);

  useEffect(() => {
    setLineIndex(0);
  }, [state.activeEventId, state.mode, state.nodeId]);

  useEffect(() => {
    setVisibleChars(0);
  }, [lineIndex, state.activeEventId, state.mode, state.nodeId]);

  useEffect(() => {
    if (!currentText) return;
    if (!isTyping) return;
    const timer = window.setTimeout(() => {
      setVisibleChars((c) => Math.min(c + 1, currentText.length));
    }, 16);
    return () => window.clearTimeout(timer);
  }, [currentText, isTyping, visibleChars]);

  useEffect(() => {
    // When we enter a new node/event, append its first line to transcript for history.
    if (!currentLines.length) return;
    const first = currentLines[0]!;
    const speaker = first.speakerId ? displayNameById[first.speakerId] ?? "" : "";
    setTranscript((prev) => [...prev, { speaker, text: first.text }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeEventId, state.mode, state.nodeId]);

  const statPills = useMemo(
    () =>
      scenario.stats.map((d) => ({
        id: d.id,
        label: d.shortLabel ?? d.label,
        value: state.stats[d.id] ?? 0,
      })),
    [scenario.stats, state.stats],
  );

  const availableChoices = useMemo(() => {
    if (!node || state.mode !== "node") return [];
    return node.choices.map((c) => ({
      choice: c,
      enabled: evalPredicate(state, c.requires),
    }));
  }, [node, state]);

  const availableEventChoices = useMemo(() => {
    if (!activeEvent || state.mode !== "event") return [];
    return activeEvent.choices.map((c) => ({
      choice: c,
      enabled: evalPredicate(state, c.requires),
    }));
  }, [activeEvent, state]);

  function pushTranscriptForLine(nextIndex: number) {
    const ln = currentLines[nextIndex];
    if (!ln) return;
    const speaker = ln.speakerId ? displayNameById[ln.speakerId] ?? "" : "";
    setTranscript((prev) => [...prev, { speaker, text: ln.text }]);
  }

  function advanceLine() {
    if (lineIndex >= currentLines.length - 1) return;
    const next = lineIndex + 1;
    setLineIndex(next);
    pushTranscriptForLine(next);
  }

  function onDialogueClick() {
    if (!currentText) return;
    if (isTyping) {
      setVisibleChars(currentText.length);
      return;
    }
    if (!atEndOfLines) {
      advanceLine();
    }
  }

  function goTo(nextNodeId: string, effect: Parameters<typeof applyEffect>[2], addHistoryFrom?: string) {
    setState((prev) => {
      let next = prev;

      function pickRedirectBy(checkIds: string[]) {
        const checks = scenario.checks ?? [];
        for (const c of checks) {
          if (!checkIds.includes(c.id)) continue;
          if (evalPredicate(next, c.when)) return c.goto;
        }
        return null;
      }

      if (addHistoryFrom) {
        next = { ...next, history: [...next.history, addHistoryFrom] };
      }

      next = applyEffect(scenario, next, effect);
      next = applyAutoUnlockRoutes(scenario, next);

      // Route-specific ending logic: only resolve when reaching endingAuto.
      let resolvedNodeId = nextNodeId;
      if (nextNodeId === "endingAuto") {
        const endingChecks = [
          "check_bad",
          "check_secret",
          "check_good",
          "check_neutral",
        ];
        const picked =
          pickRedirectBy(endingChecks) ??
          (next.stats.A >= 50 && next.stats.S >= 40 ? "endingNeutral" : "endingBad");
        resolvedNodeId = picked;
      }

      next = { ...next, mode: "node", nodeId: resolvedNodeId };

      // Global checks (bad early, etc.)
      const globalChecks = ["check_bad_early_1", "check_bad_early_2"];
      const redirect = nextNodeId === "endingAuto" ? null : pickRedirectBy(globalChecks);
      if (redirect && redirect !== next.nodeId) {
        next = { ...next, nodeId: redirect };
      }

      // Quick events (only while in normal nodes)
      if (scenario.nodes[next.nodeId]?.kind !== "ending") {
        const qe = pickQuickEvent(scenario, next);
        if (qe) {
          next = {
            ...next,
            mode: "event",
            activeEventId: qe.id,
            resumeTo: next.nodeId,
            seenQuickEvents: [...next.seenQuickEvents, qe.id],
          };
        }
      }

      return next;
    });
  }

  function onPickChoice(
    choiceLabel: string,
    nextId: string,
    effect: Parameters<typeof applyEffect>[2] | undefined,
  ) {
    setTranscript((prev) => [...prev, { speaker: "", text: `▶ Bạn chọn: ${choiceLabel}` }]);
    goTo(nextId, effect, state.mode === "node" ? state.nodeId : undefined);
  }

  function acceptEvent(choiceId: string) {
    setState((prev) => {
      if (prev.mode !== "event" || !prev.activeEventId || !prev.resumeTo) return prev;
      const qe = scenario.quickEvents?.find((e) => e.id === prev.activeEventId);
      const picked = qe?.choices.find((c) => c.id === choiceId);
      if (!qe || !picked) return prev;
      if (picked.requires && !evalPredicate(prev, picked.requires)) return prev;

      let next = applyEffect(scenario, prev, picked.effect);
      next = applyAutoUnlockRoutes(scenario, next);
      next = {
        ...next,
        mode: "node",
        nodeId: prev.resumeTo,
        activeEventId: undefined,
        resumeTo: undefined,
      };

      const checks = scenario.checks ?? [];
      for (const c of checks) {
        if (!["check_bad_early_1", "check_bad_early_2"].includes(c.id)) continue;
        if (evalPredicate(next, c.when)) {
          next = { ...next, nodeId: c.goto };
          break;
        }
      }
      return next;
    });
  }

  function skipEvent() {
    setState((prev) => {
      if (prev.mode !== "event" || !prev.resumeTo) return prev;
      return {
        ...prev,
        mode: "node",
        nodeId: prev.resumeTo,
        activeEventId: undefined,
        resumeTo: undefined,
      };
    });
  }

  function back() {
    if (lineIndex > 0) {
      setLineIndex((i) => Math.max(0, i - 1));
      setTranscript((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
      return;
    }

    setState((prev) => {
      if (prev.mode === "event") {
        return {
          ...prev,
          mode: "node",
          activeEventId: undefined,
          resumeTo: undefined,
        };
      }
      if (prev.history.length === 0) return prev;
      const history = prev.history.slice();
      const prevId = history.pop()!;
      return { ...prev, nodeId: prevId, history };
    });
  }

  function reset() {
    setState(createInitialState(scenario));
    setTranscript([]);
    setShowHistory(false);
    setLineIndex(0);
  }

  return (
    <div className="relative flex min-h-[100svh] flex-col text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-[430px] w-[430px] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      {/* Top HUD */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
        <div className="vn-glass flex flex-wrap items-center justify-center gap-3 rounded-2xl p-4 sm:gap-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {statPills.map((p) => (
              <StatPill key={p.id} label={p.label} value={p.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Stage (background/characters later) */}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-6 sm:px-6">
        <div className="h-full w-full rounded-3xl border border-pink-200/60 bg-gradient-to-b from-white/75 to-pink-50/75 shadow-[0_10px_24px_rgba(217,70,161,0.16)]" />

        {atEndOfLines && !isTyping ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div className="pointer-events-auto w-full max-w-2xl space-y-3">
              {state.mode === "event" && activeEvent
                ? availableEventChoices.map(({ choice, enabled }) => (
                    <PrimaryButton
                      key={choice.id}
                      onClick={() => acceptEvent(choice.id)}
                      disabled={!enabled}
                    >
                      {choice.label}
                      {!enabled ? (
                        <div className="mt-1 text-sm font-medium text-fuchsia-700/60">(Chưa đủ điều kiện)</div>
                      ) : null}
                    </PrimaryButton>
                  ))
                : availableChoices.map(({ choice, enabled }) => (
                    <PrimaryButton
                      key={choice.id}
                      onClick={() => onPickChoice(choice.label, choice.next, choice.effect)}
                      disabled={!enabled}
                    >
                      {choice.label}
                      {!enabled ? (
                        <div className="mt-1 text-sm font-medium text-fuchsia-700/60">(Chưa đủ điều kiện)</div>
                      ) : null}
                    </PrimaryButton>
                  ))}
              {state.mode === "event" && activeEvent && !activeEvent.forced ? (
                <PrimaryButton onClick={skipEvent}>Bỏ qua</PrimaryButton>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Dialogue + Controls */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6">
        <button
          type="button"
          onClick={onDialogueClick}
          className="relative h-[194px] w-full rounded-2xl border-2 border-white/85 bg-gradient-to-b from-pink-200/88 via-pink-300/74 to-pink-400/66 p-4 text-left shadow-[0_16px_34px_rgba(236,72,153,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200/90 sm:h-[212px] sm:p-5 lg:h-[226px]"
        >
          {currentLine?.speakerId ? (
            <div className="absolute -top-9 left-6 inline-flex min-w-[138px] justify-center rounded-md border-2 border-white bg-gradient-to-b from-white via-pink-50 to-pink-200 px-4 py-1 text-sm font-extrabold tracking-wide text-[#7a2758] shadow-[0_8px_18px_rgba(236,72,153,0.22)] sm:-top-10 sm:left-8 sm:text-base">
              {displayNameById[currentLine.speakerId] ?? ""}
            </div>
          ) : null}

          <div className="flex h-full flex-col rounded-xl border border-white/80 bg-[radial-gradient(circle_at_9px_9px,rgba(236,72,153,0.15)_1.3px,transparent_1.3px)] [background-size:18px_18px] bg-white/38 px-6 py-4 sm:px-7 sm:py-5">
            <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap text-[1.12rem] leading-8 sm:text-[1.24rem] sm:leading-9 ddlc-outline-text">
              {displayedText}
            </div>
            {!atEndOfLines && !isTyping ? (
              <div className="mt-3 text-sm font-semibold tracking-wide text-fuchsia-900/65">
                (Bấm để tiếp tục)
              </div>
            ) : null}
          </div>
        </button>

        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-pink-200/90 bg-white/72 px-3 py-2 shadow-[0_6px_16px_rgba(217,70,161,0.16)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-4 py-2 text-sm font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95"
            >
              ⌂ Menu
            </Link>
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-4 py-2 text-sm font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95"
            >
              ↶ Back
            </button>
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center gap-2 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-4 py-2 text-sm font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95"
            >
              ☰ History
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-4 py-2 text-sm font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95"
          >
            ↻ Restart
          </button>
        </div>
      </div>

      {showHistory ? (
        <div
          className="fixed inset-0 z-50 bg-fuchsia-950/35 p-4 backdrop-blur-[2px] sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowHistory(false)}
        >
          <div
            className="vn-glass mx-auto flex h-full max-w-3xl flex-col rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-pink-200/70 p-4 sm:p-5">
              <div>
                <div className="text-xs font-semibold tracking-wide text-[var(--text-soft)]">History</div>
                <div className="text-sm font-semibold text-fuchsia-900">
                  Nhật ký hội thoại (tới hiện tại)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="rounded-xl border border-pink-200/70 bg-white/70 px-3 py-2 text-sm font-semibold text-fuchsia-900 hover:bg-pink-50"
              >
                Đóng
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-5">
              <div className="space-y-3 text-sm leading-6 text-[var(--foreground)]">
                {transcript.length ? (
                  transcript.map((t, i) => (
                    <div key={i} className="rounded-2xl border border-pink-200/70 bg-white/70 p-3">
                      {t.speaker ? (
                        <div className="mb-1 text-xs font-semibold tracking-wide text-[var(--text-soft)]">
                          {t.speaker}
                        </div>
                      ) : null}
                      <div className="whitespace-pre-wrap">{t.text}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-fuchsia-700/70">(Chưa có hội thoại.)</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

