"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Local mini-app · state in this browser
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Data is stored in localStorage on this origin only. Portfolio demo — not a multi-user product.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

function uid() {
  return crypto.randomUUID();
}

type Note = { id: string; title: string; body: string; updatedAt: number };

export default function Home() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes-app-v1", [
    {
      id: "1",
      title: "Welcome",
      body: "This note lives in localStorage.\n\nCreate more on the left.",
      updatedAt: Date.now(),
    },
  ]);
  const [activeId, setActiveId] = useState<string | null>("1");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!activeId && notes[0]) setActiveId(notes[0].id);
  }, [notes, activeId]);

  const filtered = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.body.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const active = notes.find((n) => n.id === activeId) ?? null;

  const create = () => {
    const id = uid();
    const note: Note = { id, title: "Untitled", body: "", updatedAt: Date.now() };
    setNotes((prev) => [note, ...prev]);
    setActiveId(id);
  };

  return (
    <Shell title="Notes App" subtitle="Capture ideas quickly. Search, edit, and keep everything on this browser.">
      <div className="grid min-h-[32rem] gap-4 md:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-2 flex gap-2">
            <Button onClick={create}>New</Button>
            <input
              className={inputClass}
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ul className="max-h-[28rem] space-y-1 overflow-auto">
            {filtered.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(n.id)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                    n.id === activeId
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <div className="truncate font-medium">{n.title || "Untitled"}</div>
                  <div className={`truncate text-xs ${n.id === activeId ? "opacity-80" : "text-zinc-500"}`}>
                    {new Date(n.updatedAt).toLocaleString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          {active ? (
            <div className="flex h-full flex-col gap-3">
              <div className="flex gap-2">
                <input
                  className={`${inputClass} text-lg font-semibold`}
                  value={active.title}
                  onChange={(e) =>
                    setNotes((prev) =>
                      prev.map((n) =>
                        n.id === active.id ? { ...n, title: e.target.value, updatedAt: Date.now() } : n
                      )
                    )
                  }
                />
                <Button
                  variant="danger"
                  onClick={() => {
                    setNotes((prev) => prev.filter((n) => n.id !== active.id));
                    setActiveId(null);
                  }}
                >
                  Delete
                </Button>
              </div>
              <textarea
                className={`${inputClass} min-h-[24rem] flex-1 font-mono`}
                value={active.body}
                onChange={(e) =>
                  setNotes((prev) =>
                    prev.map((n) =>
                      n.id === active.id ? { ...n, body: e.target.value, updatedAt: Date.now() } : n
                    )
                  )
                }
                placeholder="Write…"
              />
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Select or create a note.</p>
          )}
        </section>
      </div>
    </Shell>
  );
}
