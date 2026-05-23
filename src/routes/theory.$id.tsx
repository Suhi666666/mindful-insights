import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { catalog, type CatalogTheory } from "@/data/catalog";
import { details, type TheoryDetail } from "@/data/details";
import { useLearned } from "@/lib/progress";

export const Route = createFileRoute("/theory/$id")({
  head: ({ params }) => {
    const t = catalog.find((x) => x.id === params.id);
    const title = t ? `${t.nameZh} · 教科书解释 · 懂一点` : "理论 · 懂一点";
    return {
      meta: [
        { title },
        {
          name: "description",
          content: t
            ? `${t.nameZh} (${t.nameEn})${t.proposer ? " · " + t.proposer : ""} 的教科书式正式解释、关键概念与应用例子。`
            : "理论详解",
        },
      ],
    };
  },
  loader: ({ params }) => {
    const t = catalog.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return { theory: t };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="serif text-3xl">找不到这个理论</h1>
      <Link to="/catalog" className="mt-6 inline-block text-primary underline">回到大全</Link>
    </main>
  ),
  component: TheoryDetailPage,
});

function TheoryDetailPage() {
  const { theory } = Route.useLoaderData();
  const detail = details[theory.id] ?? generateFallback(theory);
  const { learned, toggle } = useLearned();
  const done = learned.has(theory.id);

  const idx = catalog.findIndex((x) => x.id === theory.id);
  const prev = idx > 0 ? catalog[idx - 1] : null;
  const next = idx < catalog.length - 1 ? catalog[idx + 1] : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-ink"
      >
        ← 返回理论大全
      </Link>

      <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-0.5">
            #{theory.num} · {theory.catZh}
          </span>
          {detail.year && (
            <span className="rounded-full border border-border px-2 py-0.5">
              {detail.year}
            </span>
          )}
          {theory.proposer && (
            <span className="rounded-full border border-border px-2 py-0.5">
              提出者：{theory.proposer}
            </span>
          )}
        </div>

        <h1 className="serif mt-4 text-3xl leading-tight text-ink sm:text-4xl">
          {theory.nameZh}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">{theory.nameEn}</p>

        <Section title="核心定义">
          <p className="leading-[1.9] text-ink">{detail.definition}</p>
        </Section>

        <Section title="关键概念">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {detail.keyConcepts.map((k, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-ink"
              >
                <span className="mr-2 text-primary">·</span>
                {k}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="实际应用例子">
          <ol className="space-y-2.5">
            {detail.examples.map((e, i) => (
              <li key={i} className="flex gap-3 text-ink leading-relaxed">
                <span className="serif shrink-0 text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
        </Section>

        {detail.related && detail.related.length > 0 && (
          <Section title="相关理论">
            <div className="flex flex-wrap gap-2">
              {detail.related.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-ink-soft"
                >
                  {r}
                </span>
              ))}
            </div>
          </Section>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <button
            onClick={() => toggle(theory.id)}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition ${
              done
                ? "bg-primary/10 text-primary"
                : "bg-primary text-primary-foreground hover:scale-[1.02]"
            }`}
          >
            {done ? "✓ 已掌握（再点取消）" : "我懂了，标为已掌握"}
          </button>
          <div className="flex gap-2 text-xs">
            {prev && (
              <Link
                to="/theory/$id"
                params={{ id: prev.id }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-ink-soft hover:text-ink"
              >
                ← {prev.nameZh}
              </Link>
            )}
            {next && (
              <Link
                to="/theory/$id"
                params={{ id: next.id }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-ink-soft hover:text-ink"
              >
                {next.nameZh} →
              </Link>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="serif mb-3 text-lg text-ink">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// Template-style fallback for theories without hand-written content
function generateFallback(t: CatalogTheory): TheoryDetail {
  const proposer = t.proposer ? `${t.proposer}` : "多位学者";
  return {
    definition: `${t.nameZh}（${t.nameEn}）是${t.catZh}领域的重要理论，由${proposer}提出与发展。它从${t.catZh}的视角出发，针对其研究对象提出一套系统的概念框架与解释机制，旨在帮助我们理解相关现象的规律、成因与影响。详细学术阐述可参阅本理论的原始文献与相关教科书。`,
    keyConcepts: [
      `${t.nameZh}的核心命题与基本假设`,
      `${t.catZh}视角下的分析单位与变量`,
      "理论提出的解释机制与因果路径",
      "适用边界与主要争议",
    ],
    examples: [
      `在${t.catZh}研究中，研究者使用${t.nameZh}解释相关现象的发生机制。`,
      "在政策与实践中，该理论被用于诊断问题与设计干预方案。",
      "在日常生活中，该理论提供了一种理解人与社会运作的视角。",
    ],
    related: [t.catZh + "其他经典理论"],
  };
}
