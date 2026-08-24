"use client";

import { useEffect, useMemo, useState } from "react";

type Note = { id: string; title: string; body: string; updatedAt: number };

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch { /* keep the seeded notebook */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);
  return [value, setValue, ready] as const;
}

function dateLabel(timestamp: number) {
  return timestamp ? new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "NEW LEAF";
}

export default function Home() {
  const [notes, setNotes, ready] = useLocalStorage<Note[]>("notes-app-v1", [{ id: "1", title: "Welcome", body: "This note lives in localStorage.\n\nMake a new leaf when the thought arrives.", updatedAt: 0 }]);
  const [activeId, setActiveId] = useState("1");
  const [query, setQuery] = useState("");
  const active = notes.find((note) => note.id === activeId) ?? null;
  const filtered = useMemo(() => notes.filter((note) => `${note.title} ${note.body}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.updatedAt - a.updatedAt), [notes, query]);

  useEffect(() => {
    if (!active && notes[0]) setActiveId(notes[0].id);
  }, [active, notes]);

  const updateActive = (changes: Partial<Note>) => {
    if (!active) return;
    setNotes((current) => current.map((note) => note.id === active.id ? { ...note, ...changes, updatedAt: Date.now() } : note));
  };

  const createNote = () => {
    const id = crypto.randomUUID();
    setNotes((current) => [{ id, title: "Untitled note", body: "", updatedAt: Date.now() }, ...current]);
    setActiveId(id);
  };

  const deleteActive = () => {
    if (!active) return;
    const remaining = notes.filter((note) => note.id !== active.id);
    setNotes(remaining);
    setActiveId(remaining[0]?.id ?? "");
  };

  return (
    <main className="fieldbook-shell">
      <div className="fieldbook-frame">
        <header className="fieldbook-topbar">
          <a href="https://bookchaowalit.com" className="fieldbook-mark" aria-label="Bookchaowalit home"><span>BOOK</span> / FIELD</a>
          <span>ONE BROWSER / MANY LEAVES</span>
          <span>{ready ? `${notes.length} NOTES` : "OPENING NOTEBOOK"}</span>
        </header>

        <section className="fieldbook-intro">
          <div>
            <h1>Leave a mark.<br /><em>Find it later.</em></h1>
            <p>A quiet notebook for short thoughts, rough edges, and the sentence that should not disappear between tabs.</p>
          </div>
          <div className="fieldbook-swatch" aria-hidden="true"><span>LOCAL</span><b>01</b><span>NO SYNC</span></div>
        </section>

        <section className="notebook" aria-label="Local notes notebook">
          <aside className="note-index">
            <div className="index-title"><span>INDEX</span><span>{filtered.length} FOUND</span></div>
            <div className="index-actions"><button type="button" onClick={createNote}>+ New leaf</button><label><span className="sr-only">Search notes</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leaves" /></label></div>
            <div className="note-list">
              {filtered.length ? filtered.map((note, index) => (
                <button type="button" key={note.id} className={`note-row${active?.id === note.id ? " active" : ""}`} onClick={() => setActiveId(note.id)} aria-pressed={active?.id === note.id}>
                  <span className="note-tab">{String(index + 1).padStart(2, "0")}</span><span className="note-row-copy"><strong>{note.title || "Untitled note"}</strong><small>{dateLabel(note.updatedAt)}</small></span>
                </button>
              )) : <p className="empty-notes">No leaf matches this search.</p>}
            </div>
          </aside>

          <section className="note-sheet">
            {active ? <>
              <div className="sheet-bar"><span>LEAF / {String(notes.indexOf(active) + 1).padStart(2, "0")}</span><span>{dateLabel(active.updatedAt)}</span></div>
              <div className="sheet-content">
                <label className="title-field"><span className="sr-only">Note title</span><input value={active.title} onChange={(event) => updateActive({ title: event.target.value })} placeholder="Untitled note" /></label>
                <label className="body-field"><span className="sr-only">Note body</span><textarea value={active.body} onChange={(event) => updateActive({ body: event.target.value })} placeholder="Write the next line…" /></label>
                <div className="sheet-foot"><span>PLAIN TEXT / LOCAL STORAGE</span><button type="button" onClick={deleteActive}>Remove this leaf</button></div>
              </div>
            </> : <div className="no-note"><span className="no-note-mark">∷</span><p>Select a leaf or make a new one.</p><button type="button" onClick={createNote}>Open a new leaf</button></div>}
          </section>
        </section>

        <footer className="fieldbook-footer"><span>BOOK / DEV TOOLS</span><span>YOUR NOTES STAY ON THIS ORIGIN</span></footer>
      </div>
    </main>
  );
}
