"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SCENARIO_CARDS, type ScenarioCard } from "@/lib/scenarios";

export default function Home() {
  const [selected, setSelected] = useState<ScenarioCard | null>(null);
  const cards = useMemo(() => SCENARIO_CARDS, []);

  return (
    <div className="relative flex flex-1 flex-col text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
        <header className="space-y-3">
          <div className="text-xs font-semibold tracking-wide text-[var(--text-soft)]">Chọn tình huống</div>
          <h1 className="vn-title text-balance text-3xl font-extrabold tracking-tight text-fuchsia-900 sm:text-4xl">
            Your Body, Your Choices
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--text-soft)]">
            Chọn một tình huống để bắt đầu. Mỗi tình huống là một câu chuyện riêng, nằm ở một
            đường dẫn khác.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:mt-10">
          {cards.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSelected(s)}
              className="vn-glass group rounded-3xl p-6 text-left transition-all hover:translate-y-[-1px] hover:shadow-[0_14px_30px_rgba(217,70,161,0.22)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="vn-title text-lg font-extrabold tracking-tight text-fuchsia-900">{s.title}</div>
                  {s.tagline ? (
                    <div className="text-sm font-semibold text-fuchsia-800/85">{s.tagline}</div>
                  ) : null}
                  <div className="text-sm leading-6 text-[var(--text-soft)]">{s.summary}</div>
                  <div className="text-sm leading-6 text-[var(--text-soft)]">
                    <span className="font-semibold text-fuchsia-800/85">Bạn vào vai:</span> {s.roleplayAs}
                  </div>
                </div>
                <div className="mt-1 shrink-0 rounded-full border border-pink-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-fuchsia-800 shadow-sm group-hover:bg-pink-50">
                  Xem
                </div>
              </div>
              <div className="mt-4 text-xs font-medium text-fuchsia-700/70">
                Đường dẫn: <span className="font-mono text-fuchsia-800/80">/story/{s.slug}</span>
              </div>
            </button>
          ))}
        </section>

        <footer className="mt-12 text-center text-xs text-fuchsia-700/70">Made by Riamu</footer>
      </main>

      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-fuchsia-950/35 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelected(null)}
        >
          <div
            className="vn-glass w-full max-w-xl rounded-3xl p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-wide text-white/60">
                  Câu chuyện
                </div>
                <div className="vn-title text-xl font-extrabold tracking-tight text-fuchsia-900 sm:text-2xl">{selected.title}</div>
                {selected.tagline ? (
                  <div className="text-sm font-semibold text-fuchsia-800/85">{selected.tagline}</div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl border border-pink-200/70 bg-white/70 px-3 py-2 text-sm font-semibold text-fuchsia-900 hover:bg-pink-50"
              >
                Đóng
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-pink-200/70 bg-white/70 p-4">
                <div className="text-xs font-semibold tracking-wide text-[var(--text-soft)]">
                  Nhân vật chính
                </div>
                <div className="mt-2 text-base font-semibold text-fuchsia-900">
                  {selected.mainCharacter.name}
                  {typeof selected.mainCharacter.age === "number"
                    ? ` (${selected.mainCharacter.age} tuổi)`
                    : ""}
                </div>
                {selected.mainCharacter.bio ? (
                  <div className="mt-1 text-sm leading-6 text-[var(--text-soft)]">
                    {selected.mainCharacter.bio}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-pink-200/70 bg-white/70 p-4">
                <div className="text-xs font-semibold tracking-wide text-[var(--text-soft)]">
                  Bạn sẽ nhập vai
                </div>
                <div className="mt-2 text-sm leading-6 text-[var(--text-soft)]">{selected.roleplayAs}</div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Link
                  href={`/story/${selected.slug}`}
                  className="inline-flex items-center justify-center rounded-xl border border-pink-200/80 bg-gradient-to-b from-pink-100 to-pink-200 px-4 py-3 text-sm font-semibold text-fuchsia-900 shadow-[0_8px_20px_rgba(217,70,161,0.24)] hover:from-pink-50 hover:to-pink-200"
                >
                  Bắt đầu
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
