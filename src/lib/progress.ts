import { useEffect, useState, useCallback } from "react";

const KEY = "learned-theories-v1";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
  window.dispatchEvent(new CustomEvent("learned-changed"));
}

export function useLearned() {
  const [learned, setLearned] = useState<Set<string>>(() => read());

  useEffect(() => {
    const sync = () => setLearned(read());
    window.addEventListener("learned-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("learned-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = new Set(read());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write(next);
    setLearned(next);
  }, []);

  const mark = useCallback((id: string) => {
    const next = new Set(read());
    next.add(id);
    write(next);
    setLearned(next);
  }, []);

  const clear = useCallback(() => {
    write(new Set());
    setLearned(new Set());
  }, []);

  return { learned, toggle, mark, clear };
}

export function encouragement(pct: number): string {
  if (pct === 0) return "今天就从一个理论开始吧 ✨";
  if (pct < 5) return "起步了！每一个理论都是一颗星星 🌱";
  if (pct < 10) return "稳稳地往前走，知识在悄悄堆高 💪";
  if (pct < 20) return "已经超过大多数人了，继续！";
  if (pct < 40) return `太棒了！你已掌握 ${pct}% 的理论！`;
  if (pct < 60) return `了不起，过半路程在望 🚀`;
  if (pct < 80) return `学者气质显现，继续往上 📚`;
  if (pct < 100) return `就差最后一段冲刺啦 🏁`;
  return "全部攻克！您是行走的百科全书 🏆";
}
