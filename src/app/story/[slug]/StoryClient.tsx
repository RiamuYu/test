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
        "w-full rounded-2xl px-3 py-2 text-left text-xs font-semibold sm:px-5 sm:py-4 sm:text-base",
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
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [hasTriedFullscreen, setHasTriedFullscreen] = useState(false);
  const [dismissRotateHint, setDismissRotateHint] = useState(false);
  const [pendingChoiceResult, setPendingChoiceResult] = useState<{
    lines: DialogueLine[];
    next:
      | {
          type: "node";
          nextId: string;
          effect?: Parameters<typeof applyEffect>[2];
          addHistoryFrom?: string;
        }
      | {
          type: "event";
          choiceId: string;
        };
  } | null>(null);
  const [choiceCheckpoints, setChoiceCheckpoints] = useState<
    Array<{
      state: ReturnType<typeof createInitialState>;
      transcript: Array<{ speaker: string; text: string }>;
      lineIndex: number;
      visibleChars: number;
      pendingChoiceResult: {
        lines: DialogueLine[];
        next:
          | {
              type: "node";
              nextId: string;
              effect?: Parameters<typeof applyEffect>[2];
              addHistoryFrom?: string;
            }
          | {
              type: "event";
              choiceId: string;
            };
      } | null;
    }>
  >([]);

  const node = scenario.nodes[state.nodeId];
  const activeEvent = useMemo(() => {
    if (state.mode !== "event" || !state.activeEventId) return null;
    return scenario.quickEvents?.find((e) => e.id === state.activeEventId) ?? null;
  }, [scenario.quickEvents, state.activeEventId, state.mode]);

  const currentBackgroundUrl = useMemo(() => {
    const backgrounds = scenario.assets?.backgrounds;
    if (!backgrounds) return null;
    if (state.mode === "event" && activeEvent?.backgroundId) {
      return backgrounds[activeEvent.backgroundId] ?? null;
    }
    if (node?.backgroundId) {
      return backgrounds[node.backgroundId] ?? null;
    }
    if (state.mode === "event" && state.resumeTo) {
      const resumeNode = scenario.nodes[state.resumeTo];
      if (resumeNode?.backgroundId) return backgrounds[resumeNode.backgroundId] ?? null;
    }
    return null;
  }, [activeEvent?.backgroundId, node?.backgroundId, scenario.assets?.backgrounds, scenario.nodes, state.mode, state.resumeTo]);

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

  const renderedLines = pendingChoiceResult ? pendingChoiceResult.lines : currentLines;
  const currentLine = renderedLines[lineIndex] ?? null;
  const atEndOfLines = lineIndex >= Math.max(0, renderedLines.length - 1);
  const currentText = currentLine?.text ?? "";
  const isTyping = visibleChars < currentText.length;
  const displayedText = currentText.slice(0, visibleChars);
  const portraitByCharacterId = scenario.assets?.characters ?? {};
  const speakingCharacterIds = useMemo(() => {
    const ids: string[] = [];
    for (const line of currentLines) {
      if (!line.speakerId) continue;
      if (!portraitByCharacterId[line.speakerId]) continue;
      if (!ids.includes(line.speakerId)) ids.push(line.speakerId);
    }
    return ids;
  }, [currentLines, portraitByCharacterId]);
  const shownPortraitIds = useMemo(() => {
    if (speakingCharacterIds.length >= 2) return speakingCharacterIds.slice(0, 2);
    return speakingCharacterIds.slice(0, 1);
  }, [speakingCharacterIds]);
  const isMobileLandscape = isMobileDevice && isLandscape;

  useEffect(() => {
    setLineIndex(0);
  }, [pendingChoiceResult, state.activeEventId, state.mode, state.nodeId]);

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
    if (typeof window === "undefined") return;
    const check = () => {
      const mobileMq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
      const landscapeMq = window.matchMedia("(orientation: landscape)");
      setIsMobileDevice(mobileMq.matches);
      setIsLandscape(landscapeMq.matches);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function tryEnterFullscreen() {
    if (typeof document === "undefined") return;
    if (!isMobileLandscape) return;
    if (document.fullscreenElement) return;
    const root = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
    };
    try {
      if (root.requestFullscreen) {
        await root.requestFullscreen();
      } else if (root.webkitRequestFullscreen) {
        await root.webkitRequestFullscreen();
      }
    } catch {
      // Some mobile browsers still require explicit user gesture.
    }
  }

  useEffect(() => {
    if (!isMobileLandscape || hasTriedFullscreen) return;
    setHasTriedFullscreen(true);
    void tryEnterFullscreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileLandscape, hasTriedFullscreen]);

  useEffect(() => {
    // When we enter a new node/event, append its first line to transcript for history.
    if (!currentLines.length) return;
    const first = currentLines[0]!;
    const speaker = first.speakerId ? displayNameById[first.speakerId] ?? "" : "";
    setTranscript((prev) => [...prev, { speaker, text: first.text }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.activeEventId, state.mode, state.nodeId]);

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
    const ln = renderedLines[nextIndex];
    if (!ln) return;
    const speaker = ln.speakerId ? displayNameById[ln.speakerId] ?? "" : "";
    setTranscript((prev) => [...prev, { speaker, text: ln.text }]);
  }

  function advanceLine() {
    if (lineIndex >= renderedLines.length - 1) return;
    const next = lineIndex + 1;
    setLineIndex(next);
    pushTranscriptForLine(next);
  }

  function onDialogueClick() {
    void tryEnterFullscreen();
    if (!currentText) return;
    if (isTyping) {
      setVisibleChars(currentText.length);
      return;
    }
    if (pendingChoiceResult) {
      if (!atEndOfLines) {
        advanceLine();
        return;
      }
      if (pendingChoiceResult.next.type === "node") {
        goTo(
          pendingChoiceResult.next.nextId,
          pendingChoiceResult.next.effect,
          pendingChoiceResult.next.addHistoryFrom,
        );
      } else {
        acceptEvent(pendingChoiceResult.next.choiceId, true);
      }
      setPendingChoiceResult(null);
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
    resultLines?: DialogueLine[],
    resultLine?: DialogueLine,
  ) {
    setChoiceCheckpoints((prev) => [
      ...prev,
      {
        state,
        transcript,
        lineIndex,
        visibleChars,
        pendingChoiceResult,
      },
    ]);

    const normalizedResultLines =
      resultLines && resultLines.length ? resultLines : resultLine ? [resultLine] : [];
    if (normalizedResultLines.length) {
      setTranscript((prev) => {
        return [
          ...prev,
          { speaker: "", text: `▶ Bạn chọn: ${choiceLabel}` },
          ...normalizedResultLines.map((ln) => ({
            speaker: ln.speakerId ? displayNameById[ln.speakerId] ?? "" : "",
            text: ln.text,
          })),
        ];
      });
      setPendingChoiceResult({
        lines: normalizedResultLines,
        next: {
          type: "node",
          nextId,
          effect,
          addHistoryFrom: state.mode === "node" ? state.nodeId : undefined,
        },
      });
      return;
    }

    setTranscript((prev) => {
      return [...prev, { speaker: "", text: `▶ Bạn chọn: ${choiceLabel}` }];
    });
    goTo(nextId, effect, state.mode === "node" ? state.nodeId : undefined);
  }

  function acceptEvent(choiceId: string, resolvePending = false) {
    if (!resolvePending && state.mode === "event") {
      setChoiceCheckpoints((prev) => [
        ...prev,
        {
          state,
          transcript,
          lineIndex,
          visibleChars,
          pendingChoiceResult,
        },
      ]);
    }

    setState((prev) => {
      if (prev.mode !== "event" || !prev.activeEventId || !prev.resumeTo) return prev;
      const qe = scenario.quickEvents?.find((e) => e.id === prev.activeEventId);
      const picked = qe?.choices.find((c) => c.id === choiceId);
      if (!qe || !picked) return prev;
      if (picked.requires && !evalPredicate(prev, picked.requires)) return prev;
      const pickedResultLines =
        picked.resultLines && picked.resultLines.length
          ? picked.resultLines
          : picked.resultLine
            ? [picked.resultLine]
            : [];
      if (pickedResultLines.length && !resolvePending) {
        setTranscript((t) => [
          ...t,
          ...pickedResultLines.map((ln) => ({
            speaker: ln.speakerId ? displayNameById[ln.speakerId] ?? "" : "",
            text: ln.text,
          })),
        ]);
        setPendingChoiceResult({
          lines: pickedResultLines,
          next: { type: "event", choiceId },
        });
        return prev;
      }

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
    if (isTyping) {
      setVisibleChars(currentText.length);
      return;
    }

    if (lineIndex > 0) {
      setLineIndex((i) => Math.max(0, i - 1));
      setVisibleChars(renderedLines[Math.max(0, lineIndex - 1)]?.text.length ?? 0);
      setTranscript((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
      return;
    }

    setChoiceCheckpoints((prev) => {
      if (!prev.length) return prev;
      const snapshot = prev[prev.length - 1]!;
      setState(snapshot.state);
      setTranscript(snapshot.transcript);
      setLineIndex(snapshot.lineIndex);
      setVisibleChars(snapshot.visibleChars);
      setPendingChoiceResult(snapshot.pendingChoiceResult);
      return prev.slice(0, -1);
    });
  }

  function skipToNextChoice() {
    if (!currentLines.length) return;
    if (atEndOfLines && !isTyping) return;

    const endIndex = Math.max(0, currentLines.length - 1);
    setLineIndex(endIndex);
    setVisibleChars(currentLines[endIndex]?.text.length ?? 0);

    const skipped = currentLines.slice(lineIndex + 1);
    if (!skipped.length) return;
    setTranscript((prev) => [
      ...prev,
      ...skipped.map((ln) => ({
        speaker: ln.speakerId ? displayNameById[ln.speakerId] ?? "" : "",
        text: ln.text,
      })),
    ]);
  }

  function reset() {
    setState(createInitialState(scenario));
    setTranscript([]);
    setShowHistory(false);
    setLineIndex(0);
    setVisibleChars(0);
    setPendingChoiceResult(null);
    setChoiceCheckpoints([]);
  }

  const showRotateHint = isMobileDevice && !isLandscape && !dismissRotateHint;

  return (
    <div
      className={[
        "relative flex min-h-[100svh] flex-col text-[var(--foreground)]",
        isMobileDevice && isLandscape ? "h-[100svh] overflow-hidden" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-[430px] w-[430px] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      {showRotateHint ? (
        <div className="relative z-20 mx-auto mt-3 w-full max-w-md px-4 text-center">
          <div className="vn-glass relative rounded-3xl p-4 pr-12 sm:p-5">
            <button
              type="button"
              onClick={() => setDismissRotateHint(true)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-pink-200/80 bg-white/80 text-lg font-bold text-fuchsia-900 hover:bg-pink-50"
              aria-label="Đóng gợi ý xoay ngang"
            >
              ✕
            </button>
            <div className="vn-title text-lg font-extrabold text-fuchsia-900 sm:text-xl">
              Mẹo: xoay ngang để trải nghiệm đẹp hơn
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
              Bạn vẫn có thể chơi ở chế độ dọc, nhưng xoay ngang sẽ hiển thị khung thoại và nhân vật cân đối hơn.
            </p>
          </div>
        </div>
      ) : null}

      {/* Full-screen background */}
      <div className="pointer-events-none absolute inset-0">
        {currentBackgroundUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={currentBackgroundUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/15" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-white/75 to-pink-50/75" />
        )}
      </div>

      {/* Overlay stage for event choices */}
      <div
        className={[
          "relative z-10 mx-auto flex w-full flex-1 items-center justify-center px-3 sm:px-6",
          isMobileLandscape ? "py-1" : isMobileDevice ? "py-2" : "py-6",
        ].join(" ")}
      >
        {atEndOfLines && !isTyping && !pendingChoiceResult ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div
              className={[
                "pointer-events-auto w-full max-w-2xl space-y-2",
                isMobileLandscape
                  ? "max-h-[42svh] overflow-y-auto rounded-2xl border border-white/40 bg-black/20 p-2 backdrop-blur-sm"
                  : "",
              ].join(" ")}
            >
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
                      onClick={() =>
                        onPickChoice(
                          choice.label,
                          choice.next,
                          choice.effect,
                          choice.resultLines,
                          choice.resultLine,
                        )
                      }
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
      <div
        className={[
          "relative mx-auto w-full max-w-6xl px-3 sm:px-6",
          isMobileLandscape ? "pb-1" : isMobileDevice ? "pb-2" : "pb-6",
        ].join(" ")}
      >
        {isMobileDevice && !isLandscape ? (
          <div className="mb-2 text-center text-xs font-medium text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Gợi ý: xoay ngang để nhìn rõ hơn, hoặc tiếp tục chơi ở dọc nếu bạn thấy ổn.
          </div>
        ) : null}

        {shownPortraitIds.length > 0 ? (
          <div
            className={[
              "pointer-events-none absolute right-2 z-20 sm:right-6",
              isMobileLandscape
                ? "bottom-[calc(100%+1px)]"
                : isMobileDevice
                  ? "bottom-[calc(100%+4px)]"
                  : "bottom-[calc(100%+8px)]",
            ].join(" ")}
            aria-hidden="true"
          >
            <div
              className={[
                "relative",
                isMobileLandscape ? "h-[44svh] w-[280px]" : isMobileDevice ? "h-[32svh] w-[210px]" : "h-[38vh] w-[360px]",
              ].join(" ")}
            >
              {shownPortraitIds.map((characterId, index) => {
                const portraitUrl = portraitByCharacterId[characterId];
                if (!portraitUrl) return null;
                const isSpeaking = currentLine?.speakerId === characterId;
                const heightAdjustClass =
                  characterId === "tuan"
                    ? isMobileLandscape
                      ? "h-[38svh] max-h-[248px]"
                      : isMobileDevice
                      ? "h-[28svh] max-h-[184px]"
                      : "h-[33vh] max-h-[295px]"
                    : isMobileLandscape
                      ? "h-[44svh] max-h-[298px]"
                      : isMobileDevice
                      ? "h-[32svh] max-h-[210px]"
                      : "h-[38vh] max-h-[340px]";
                const positionClass =
                  shownPortraitIds.length === 1
                    ? "right-0 z-30"
                    : index === 0
                      ? "right-0 z-30"
                      : isMobileLandscape
                        ? "right-[98px] z-20"
                        : "right-[86px] z-20";
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={characterId}
                    src={portraitUrl}
                    alt=""
                    className={[
                      "absolute bottom-0 select-none object-contain transition-all duration-300",
                      heightAdjustClass,
                      positionClass,
                      isSpeaking
                        ? "opacity-100 saturate-110 brightness-105 drop-shadow-[0_10px_22px_rgba(255,255,255,0.35)]"
                        : "opacity-72 saturate-75 brightness-50",
                    ].join(" ")}
                    draggable={false}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onDialogueClick}
          className={[
            "relative w-full rounded-2xl border-2 border-white/85 bg-gradient-to-b from-pink-200/88 via-pink-300/74 to-pink-400/66 text-left shadow-[0_16px_34px_rgba(236,72,153,0.24)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200/90",
            isMobileLandscape
              ? "h-[30svh] p-2"
              : isMobileDevice
                ? "h-[24svh] p-2.5"
                : "h-[194px] p-4 sm:h-[212px] sm:p-5 lg:h-[226px]",
          ].join(" ")}
        >
          {currentLine?.speakerId ? (
            <div className="absolute -top-9 left-6 inline-flex min-w-[138px] justify-center rounded-md border-2 border-white bg-gradient-to-b from-white via-pink-50 to-pink-200 px-4 py-1 text-sm font-extrabold tracking-wide text-[#7a2758] shadow-[0_8px_18px_rgba(236,72,153,0.22)] sm:-top-10 sm:left-8 sm:text-base">
              {displayNameById[currentLine.speakerId] ?? ""}
            </div>
          ) : null}

          <div className="flex h-full flex-col rounded-xl border border-white/80 bg-[radial-gradient(circle_at_9px_9px,rgba(236,72,153,0.15)_1.3px,transparent_1.3px)] [background-size:18px_18px] bg-white/38 px-4 py-3 sm:px-7 sm:py-5">
            <div
              className={[
                "min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap ddlc-outline-text",
                isMobileLandscape
                  ? "text-[0.88rem] leading-5"
                  : "text-[0.93rem] leading-6 sm:text-[1.24rem] sm:leading-9",
              ].join(" ")}
            >
              {displayedText}
            </div>
            {!atEndOfLines && !isTyping ? (
              <div className="mt-3 text-sm font-semibold tracking-wide text-fuchsia-900/65">
                (Bấm để tiếp tục)
              </div>
            ) : null}
          </div>
        </button>

        <div
          className={[
            "mt-1.5 flex flex-col gap-1.5 rounded-xl border border-pink-200/90 bg-white/72 px-2.5 py-1.5 shadow-[0_6px_16px_rgba(217,70,161,0.16)] sm:mt-2 sm:gap-2 sm:px-3 sm:py-2 sm:flex-row sm:items-center sm:justify-between",
            isMobileLandscape ? "mt-1 py-1" : "",
          ].join(" ")}
        >
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-3 py-1.5 text-xs font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              ⌂ Menu
            </Link>
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-3 py-1.5 text-xs font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              ↶ Back
            </button>
            <button
              type="button"
              onClick={skipToNextChoice}
              disabled={atEndOfLines && !isTyping}
              className={[
                "inline-flex items-center gap-1.5 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-3 py-1.5 text-xs font-bold text-fuchsia-900 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                atEndOfLines && !isTyping
                  ? "cursor-not-allowed opacity-60"
                  : "hover:from-pink-50 hover:to-pink-200/95",
              ].join(" ")}
            >
              ⤼ Skip
            </button>
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-3 py-1.5 text-xs font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
            >
              ☰ History
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-pink-200/80 bg-gradient-to-b from-pink-50/95 to-pink-100/90 px-3 py-1.5 text-xs font-bold text-fuchsia-900 hover:from-pink-50 hover:to-pink-200/95 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
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

