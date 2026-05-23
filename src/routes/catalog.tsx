import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { catalog, categories, TOTAL_THEORIES } from "@/data/catalog";
import { useLearned, encouragement } from "@/lib/progress";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "理论大全 · 500+ 理论 · 懂一点" },
      {
        name: "description",
        content: "心理学、社会学、经济学、哲学等 500+ 跨学科理论分类目录，可搜索、可勾选、可追踪进度。",
      },
    ],
  }),
  component: CatalogPage,
});

const CAT_HUES: Record<string, string> = {
  psychology: "300",
  sociology: "200",
  economics: "45",
  philosophy: "260",
  politics: "10",
  education: "150",
  management: "85",
  communication: "230",
  science: "170",
  interdisciplinary: "330",
};

function tagStyle(cat: string) {
  const h = CAT_HUES[cat] ?? "60";
  return {
    background: `oklch(0.94 0.05 ${h} / 0.5)`,
    color: `oklch(0.35 0.14 ${h})`,
    borderColor: `oklch(0.75 0.12 ${h} / 0.5)`,
  } as React.CSSProperties;
}

function CatalogPage() {
  const { learned, toggle, clear } = useLearned();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [onlyTodo, setOnlyTodo] = useState(false);

  const list = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return catalog.filter((t) => {
      if (cat !== "all" && t.cat !== cat) return false;
      if (onlyTodo && learned.has(t.id)) return false;
      if (!qq) return true;
      return (
        t.nameZh.toLowerCase().includes(qq) ||
        t.nameEn.toLowerCase().includes(qq) ||
        t.proposer.toLowerCase().includes(qq) ||
        String(t.num) === qq
      );
    });
  }, [q, cat, onlyTodo, learned]);

  const pct = Math.round((learned.size / TOTAL_THEORIES) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="serif text-3xl text-ink sm:text-4xl">理论大全</h1>
        <p className="mt-2 text-sm text-ink-soft">
          收录 {TOTAL_THEORIES} 个跨学科理论。勾选你已经听懂的，进度会自动保存在本地。
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              我的学习进度
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="serif text-3xl text-ink">{learned.size}</span>
              <span className="text-sm text-ink-soft">/ {TOTAL_THEORIES} · {pct}%</span>
            </div>
            <div className="mt-1 text-xs text-ink-soft">{encouragement(pct)}</div>
          </div>
          {learned.size > 0 && (
            <button
              onClick={() => {
                if (confirm("确定清空全部进度？")) clear();
              }}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-ink hover:underline"
            >
              清空进度
            </button>
          )}
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="progress-gradient h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
      </section>

      <section className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索理论名 / 英文名 / 提出者…"
          className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm text-ink shadow-sm outline-none focus:border-primary"
        />
        <label className="flex shrink-0 items-center gap-2 text-xs text-ink-soft">
          <input
            type="checkbox"
            checked={onlyTodo}
            onChange={(e) => setOnlyTodo(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          只看未学
        </label>
      </section>

      <section className="mb-5 -mx-1 flex flex-wrap gap-1.5">
        <CatChip active={cat === "all"} onClick={() => setCat("all")}>
          全部 · {catalog.length}
        </CatChip>
        {categories.map((c) => {
          const count = catalog.filter((t) => t.cat === c.id).length;
          return (
            <CatChip
              key={c.id}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
              style={cat === c.id ? tagStyle(c.id) : undefined}
            >
              {c.zh} · {count}
            </CatChip>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {list.map((t) => {
          const done = learned.has(t.id);
          return (
            <div
              key={t.id}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md"
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => toggle(t.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-primary"
                aria-label={`mark ${t.nameZh}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    #{t.num}
                  </span>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px]"
                    style={tagStyle(t.cat)}
                  >
                    {t.catZh}
                  </span>
                </div>
                <Link
                  to="/theory/$id"
                  params={{ id: t.id }}
                  className={`mt-1 block truncate serif text-base ${done ? "text-ink-soft line-through" : "text-ink"} group-hover:text-primary`}
                >
                  {t.nameZh}
                </Link>
                <div className="truncate text-xs text-ink-soft">
                  {t.nameEn}
                  {t.proposer ? ` · ${t.proposer}` : ""}
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-ink-soft">
            没有匹配的理论，试试别的关键词～
          </div>
        )}
      </section>
    </main>
  );
}

function CatChip({
  active,
  onClick,
  children,
  style,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border bg-card text-ink-soft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
