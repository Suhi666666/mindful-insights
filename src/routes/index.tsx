import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { theories, type Theory } from "@/data/theories";
import { catalog, TOTAL_THEORIES } from "@/data/catalog";
import { useLearned, encouragement } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "懂一点 · 闲时学一个理论" },
      {
        name: "description",
        content:
          "无聊的时候打开它，随机弹出一个心理学或经济学理论，像翻卡片一样从浅入深，讲到您完全听懂。",
      },
    ],
  }),
  component: Index,
});

function pickRandom(exceptId?: string): Theory {
  const pool = exceptId ? theories.filter((t) => t.id !== exceptId) : theories;
  return pool[Math.floor(Math.random() * pool.length)];
}

function Index() {
  const [started, setStarted] = useState(false);
  const [theory, setTheory] = useState<Theory>(() => theories[0]);
  const [page, setPage] = useState(0); // 0 = cover, 1..N = pages, N+1 = takeaway
  const [flipKey, setFlipKey] = useState(0);

  const totalPages = theory.pages.length;
  const isCover = page === 0;
  const isTakeaway = page === totalPages + 1;
  const currentPageIndex = page - 1;

  const startNew = useCallback(() => {
    const next = pickRandom(started ? theory.id : undefined);
    setTheory(next);
    setPage(0);
    setStarted(true);
    setFlipKey((k) => k + 1);
  }, [theory.id, started]);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(p + 1, totalPages + 1));
    setFlipKey((k) => k + 1);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(p - 1, 0));
    setFlipKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        if (isTakeaway) startNew();
        else goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, isTakeaway, goNext, goPrev, startNew]);

  const progress = useMemo(() => {
    if (isCover) return 0;
    if (isTakeaway) return 1;
    return page / (totalPages + 1);
  }, [page, totalPages, isCover, isTakeaway]);

  // when user reaches takeaway, auto-mark matching catalog entry as learned
  const { learned, mark } = useLearned();
  useEffect(() => {
    if (!isTakeaway) return;
    const match = catalog.find((c) => c.nameZh === theory.name);
    if (match) mark(match.id);
  }, [isTakeaway, theory.name, mark]);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:py-12">
      <BackgroundDecor />

      <section className="mx-auto mb-8 max-w-3xl">
        <ProgressHero learnedCount={learned.size} />
      </section>

      <section className="mx-auto max-w-3xl">
        {!started ? (
          <CoverIntro onStart={startNew} />
        ) : (
          <div className="relative">
            <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
              <FieldTag field={theory.field} />
              <span className="tabular-nums">
                {isCover
                  ? "封面"
                  : isTakeaway
                  ? "小结"
                  : `第 ${page} / ${totalPages} 页`}
              </span>
            </div>

            <ProgressBar progress={progress} />

            <div
              key={flipKey}
              className="paper-card animate-flip-in mt-5 min-h-[460px] rounded-2xl px-7 py-10 sm:px-12 sm:py-14"
              style={{ perspective: "1200px" }}
            >
              {isCover && <CoverPage theory={theory} />}
              {!isCover && !isTakeaway && (
                <ContentPage
                  page={theory.pages[currentPageIndex]}
                  index={currentPageIndex}
                />
              )}
              {isTakeaway && <TakeawayPage theory={theory} />}
            </div>

            <NavBar
              isCover={isCover}
              isTakeaway={isTakeaway}
              onPrev={goPrev}
              onNext={goNext}
              onAnother={startNew}
            />
          </div>
        )}
      </section>

      <footer className="mx-auto mt-16 max-w-3xl text-center text-xs text-muted-foreground">
        按 ← → 翻页，空格继续 · 想看全部理论？
        <Link to="/catalog" className="ml-1 underline underline-offset-4 hover:text-ink">
          打开 500+ 理论大全 →
        </Link>
      </footer>
    </main>
  );
}

function ProgressHero({ learnedCount }: { learnedCount: number }) {
  const pct = Math.min(100, Math.round((learnedCount / TOTAL_THEORIES) * 100));
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border bg-card/70 px-5 py-4 backdrop-blur sm:gap-7 sm:px-7 sm:py-5">
      <div className="relative shrink-0">
        <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
          <circle cx="44" cy="44" r={r} stroke="oklch(0.85 0.03 75)" strokeWidth="8" fill="none" className="opacity-40" />
          <circle
            cx="44"
            cy="44"
            r={r}
            stroke="url(#pg)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.75 0.18 60)" />
              <stop offset="50%" stopColor="oklch(0.6 0.2 25)" />
              <stop offset="100%" stopColor="oklch(0.55 0.2 330)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center serif text-base text-ink tabular-nums">
          {pct}%
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="serif text-2xl text-ink tabular-nums">{learnedCount}</span>
          <span className="text-xs text-ink-soft">/ {TOTAL_THEORIES} 个理论</span>
        </div>
        <div className="mt-1 truncate text-xs text-ink-soft">{encouragement(pct)}</div>
        <Link
          to="/catalog"
          className="mt-1 inline-block text-[11px] text-primary underline-offset-4 hover:underline"
        >
          查看大全 →
        </Link>
      </div>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{ background: "oklch(0.85 0.13 65 / 0.55)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.7 0.1 30 / 0.45)" }}
      />
    </>
  );
}

function CoverIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="paper-card animate-float-in rounded-2xl px-7 py-14 text-center sm:px-12 sm:py-20">
      <p className="serif text-sm tracking-[0.3em] text-muted-foreground">
        A LITTLE BIT OF WISDOM
      </p>
      <h1 className="serif mt-5 text-4xl leading-tight text-ink sm:text-5xl">
        无聊的时候，
        <br />
        随手学一个理论。
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft">
        我们会随机抽一个心理学或经济学的小理论，
        像翻一张张卡片一样，从浅到深讲给您听——
        就像在跟奶奶聊天，一点都不绕。
      </p>
      <button
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.03] hover:shadow-xl"
      >
        随便给我抽一个 →
      </button>
      <p className="mt-5 text-xs text-muted-foreground">
        共收录 {theories.length} 个理论，每次随机一个
      </p>
    </div>
  );
}

function CoverPage({ theory }: { theory: Theory }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <span className="serif text-xs tracking-[0.35em] text-muted-foreground">
        TODAY'S THEORY · 今日理论
      </span>
      <h2 className="serif mt-6 text-4xl leading-tight text-ink sm:text-6xl">
        {theory.name}
      </h2>
      <div className="mt-6 h-px w-16 bg-border" />
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
        “{theory.oneLine}”
      </p>
      <span className="mt-10 text-xs text-muted-foreground">
        点 “下一页”，我慢慢讲给您听 →
      </span>
    </div>
  );
}

function ContentPage({
  page,
  index,
}: {
  page: { title: string; body: string };
  index: number;
}) {
  return (
    <article className="flex h-full flex-col">
      <div className="flex items-baseline gap-4">
        <span className="serif text-5xl text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="serif text-2xl text-ink sm:text-3xl">{page.title}</h3>
      </div>
      <div className="mt-8 h-px w-full bg-border/70" />
      <p className="mt-8 text-lg leading-[1.9] text-ink sm:text-xl">
        {page.body}
      </p>
    </article>
  );
}

function TakeawayPage({ theory }: { theory: Theory }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center text-center">
      <div
        aria-hidden
        className="animate-stamp absolute right-4 top-4 select-none rounded-md border-2 border-primary/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary/80"
      >
        Got it · 听懂啦
      </div>
      <span className="serif text-xs tracking-[0.3em] text-muted-foreground">
        一句话记住它
      </span>
      <p className="serif mt-6 max-w-xl text-3xl leading-snug text-ink sm:text-4xl">
        “{theory.takeaway}”
      </p>
      <div className="mt-8 h-px w-16 bg-border" />
      <p className="mt-6 text-sm text-ink-soft">
        刚才讲的是 ——{" "}
        <span className="serif text-base text-ink">{theory.name}</span>
      </p>
    </div>
  );
}

function NavBar({
  isCover,
  isTakeaway,
  onPrev,
  onNext,
  onAnother,
}: {
  isCover: boolean;
  isTakeaway: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAnother: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={isCover}
        className="paper-tab rounded-full px-5 py-2.5 text-sm text-ink-soft transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        ← 上一页
      </button>

      <button
        onClick={onAnother}
        className="text-xs text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
      >
        换一个理论
      </button>

      {isTakeaway ? (
        <button
          onClick={onAnother}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition hover:scale-[1.03]"
        >
          再来一个 ↻
        </button>
      ) : (
        <button
          onClick={onNext}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-background shadow-md transition hover:scale-[1.03]"
        >
          下一页 →
        </button>
      )}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-border/60">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.max(4, progress * 100)}%` }}
      />
    </div>
  );
}

function FieldTag({ field }: { field: Theory["field"] }) {
  const isPsych = field === "心理学";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide"
      style={{
        borderColor: isPsych
          ? "oklch(0.7 0.12 300 / 0.4)"
          : "oklch(0.7 0.13 45 / 0.4)",
        color: isPsych ? "oklch(0.4 0.13 300)" : "oklch(0.4 0.13 45)",
        background: isPsych
          ? "oklch(0.95 0.04 300 / 0.5)"
          : "oklch(0.95 0.05 60 / 0.5)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: isPsych ? "oklch(0.55 0.18 300)" : "oklch(0.6 0.18 45)",
        }}
      />
      {field}
    </span>
  );
}
