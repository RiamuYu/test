"use client";

import { useMemo, useState } from "react";
import {
  EVENTS,
  INITIAL_STATE,
  PARTNER_TRAITS,
  STORY,
  applyEffect,
  meetsRequirement,
  pickTriggeredEvent,
  resolveNext,
  type Choice,
  type GameState,
  type PartnerId,
  type PlayerIdentity,
  type StoryNodeId,
} from "@/lib/story";

function identityLabel(id: PlayerIdentity | null) {
  if (id === "male") return "Nam";
  if (id === "female") return "Nữ";
  if (id === "unspecified") return "Chưa xác định";
  return "—";
}

function partnerLabel(pid: PartnerId | null) {
  if (!pid) return "—";
  const p = PARTNER_TRAITS[pid];
  return `${p.name} (${p.vibe})`;
}

function StatPill({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const tone =
    value >= 4
      ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30"
      : value >= 1
        ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30"
        : value >= 0
          ? "bg-zinc-500/15 text-zinc-200 ring-1 ring-zinc-400/25"
          : "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/30";
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tone}`}
    >
      <span className="text-white/90">{label}</span>
      <span className="tabular-nums text-white/90">{value}</span>
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
        "w-full rounded-xl px-4 py-3 text-left text-sm font-semibold",
        "transition-colors",
        disabled
          ? "bg-white/5 text-white/40 ring-1 ring-white/10"
          : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 active:bg-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);

  const node = STORY[state.nodeId];
  const activeEvent = state.activeEventId
    ? EVENTS.find((e) => e.id === state.activeEventId) ?? null
    : null;

  const availableChoices = useMemo(() => {
    if (state.mode === "event") return [];
    return node.choices.map((c) => ({
      choice: c,
      enabled: meetsRequirement(state.stats, c.requires),
    }));
  }, [node.choices, state.stats]);

  const progress = useMemo(() => {
    const ended = Boolean(node.isEnding);
    const steps = state.history.length + 1;
    return ended ? "Kết thúc" : `Cảnh #${steps}`;
  }, [node.isEnding, state.history.length]);

  function go(nextId: StoryNodeId, choice?: Choice) {
    setState((prev) => {
      // “Chơi mới” luôn reset sạch.
      if (nextId === "start") return INITIAL_STATE;

      const withEffect = applyEffect(prev, choice?.effect);
      const resolvedNext = resolveNext(prev.nodeId, choice, withEffect);

      const nextState: GameState = {
        ...withEffect,
        mode: "story",
        nodeId: resolvedNext,
        history: [...prev.history, prev.nodeId],
      };

      const event = pickTriggeredEvent(nextState);
      if (!event) return nextState;

      return {
        ...nextState,
        mode: "event",
        activeEventId: event.id,
        resumeTo: resolvedNext,
        seenEvents: [...nextState.seenEvents, event.id],
      };
    });
  }

  function acceptEvent() {
    setState((prev) => {
      if (prev.mode !== "event" || !prev.activeEventId || !prev.resumeTo) return prev;
      const event = EVENTS.find((e) => e.id === prev.activeEventId);
      const after = applyEffect(prev, event?.effect);
      return {
        ...after,
        mode: "story",
        nodeId: prev.resumeTo,
        activeEventId: undefined,
        resumeTo: undefined,
      };
    });
  }

  function skipEvent() {
    setState((prev) => {
      if (prev.mode !== "event" || !prev.resumeTo) return prev;
      return {
        ...prev,
        mode: "story",
        nodeId: prev.resumeTo,
        activeEventId: undefined,
        resumeTo: undefined,
      };
    });
  }

  function back() {
    setState((prev) => {
      if (prev.mode === "event") {
        return {
          ...prev,
          mode: "story",
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
    setState(INITIAL_STATE);
  }

  return (
    <div className="relative flex flex-1 flex-col bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <div className="text-xs font-semibold tracking-wide text-white/60">
                {progress}
              </div>
              <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {state.mode === "event" && activeEvent ? activeEvent.title : node.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatPill label="Tình cảm" value={state.stats.affection} />
              <StatPill label="Tin tưởng" value={state.stats.trust} />
              <StatPill label="Hiểu biết" value={state.stats.knowledge} />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
              <div>
                <span className="font-semibold text-white/80">Nhân vật:</span>{" "}
                {identityLabel(state.identity)}
              </div>
              <div className="hidden sm:block text-white/20">•</div>
              <div>
                <span className="font-semibold text-white/80">Người yêu:</span>{" "}
                {partnerLabel(state.partner)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={back}
                disabled={state.mode === "story" && state.history.length === 0}
                className={[
                  "rounded-xl px-3 py-2 text-sm font-semibold",
                  state.mode === "story" && state.history.length === 0
                    ? "bg-white/5 text-white/35 ring-1 ring-white/10"
                    : "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 active:bg-white/20",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                ].join(" ")}
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-white/70 ring-1 ring-white/10 hover:bg-white/10 active:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-5">
          <div className="sm:col-span-3">
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-7">
              <div className="space-y-3 text-base leading-7 text-white/85">
                {(state.mode === "event" && activeEvent ? activeEvent.body : node.body).map(
                  (p, idx) => (
                  <p key={idx} className="whitespace-pre-wrap">
                    {p}
                  </p>
                  ),
                )}
              </div>
            </div>
          </div>

          <aside className="sm:col-span-2">
            <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5">
              <div className="mb-3 text-xs font-semibold tracking-wide text-white/60">
                {state.mode === "event" ? "Sự kiện đặc biệt" : "Lựa chọn"}
              </div>
              <div className="space-y-2">
                {state.mode === "event" && activeEvent ? (
                  <>
                    <PrimaryButton onClick={acceptEvent}>
                      {activeEvent.forced
                        ? "Tiếp tục (bắt buộc)"
                        : "Xem/áp dụng sự kiện (khuyến nghị)"}
                    </PrimaryButton>
                    {!activeEvent.forced ? (
                      <PrimaryButton onClick={skipEvent}>
                        Bỏ qua (không bắt buộc)
                      </PrimaryButton>
                    ) : null}
                  </>
                ) : (
                  availableChoices.map(({ choice, enabled }) => (
                    <PrimaryButton
                      key={choice.id}
                      onClick={() => go(choice.next, choice)}
                      disabled={!enabled}
                    >
                      {choice.label}
                      {!enabled ? (
                        <div className="mt-1 text-xs font-medium text-white/35">
                          (Chưa đủ điều kiện theo chỉ số hiện tại)
                        </div>
                      ) : null}
                    </PrimaryButton>
                  ))
                )}
              </div>

              <div className="mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <div className="text-xs font-semibold tracking-wide text-white/60">
                  Gợi ý nhanh
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-white/70">
                  <li>
                    “Tìm hiểu thêm” sẽ tăng <span className="font-semibold text-white/80">Hiểu biết</span> và mở kết thúc an toàn hơn.
                  </li>
                  <li>
                    <span className="font-semibold text-white/80">Tin tưởng</span> cao giúp bạn giao tiếp ranh giới dễ hơn.
                  </li>
                  <li>
                    Không có lựa chọn “đúng tuyệt đối” — quan trọng là bạn hiểu mình muốn gì và thấy an toàn.
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </section>

        <footer className="mt-10 text-center text-xs text-white/45">
          Made by Riamu
        </footer>
      </main>
    </div>
  );
}
