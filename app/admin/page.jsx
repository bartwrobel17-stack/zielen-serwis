"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Circle, ExternalLink, Eye, Leaf, Phone, RefreshCw, Sparkles } from "lucide-react";

const tasks = [
  { id: "photos", title: "Sprawdź zdjęcia i film", detail: "Upewnij się, że materiały pasują do oferty firmy." },
  { id: "phone", title: "Potwierdź dane kontaktowe", detail: "Telefon i obszar działania powinny być aktualne." },
  { id: "reviews", title: "Sprawdź opinie klientów", detail: "Pokazuj tylko prawdziwe, zweryfikowane opinie." },
  { id: "chat", title: "Przetestuj asystenta strony", detail: "Sprawdź odpowiedzi o usługach, wycenie i kontakcie." },
];

const styles = {
  page: { minHeight: "100vh", padding: "28px clamp(18px, 5vw, 72px) 40px", background: "#11150f", color: "#f2f1e9", fontFamily: "DM Sans, sans-serif" },
  wrap: { maxWidth: 1120, margin: "0 auto" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap", paddingBottom: 24, borderBottom: "1px solid rgba(230,237,220,.13)" },
  brand: { display: "flex", alignItems: "center", gap: 12, color: "#f2f1e9", textDecoration: "none" },
  mark: { width: 44, height: 44, display: "grid", placeItems: "center", border: "1px solid rgba(183,214,154,.65)", borderRadius: "50%", color: "#b7d69a" },
  small: { display: "block", marginTop: 5, fontSize: 10, letterSpacing: 2, color: "#a2a99b" },
  link: { display: "inline-flex", alignItems: "center", gap: 8, color: "#cde5b5", textDecoration: "none", fontSize: 13 },
  hero: { padding: "54px 0 32px" },
  kicker: { color: "#b7d69a", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, margin: "0 0 14px" },
  h1: { fontSize: "clamp(34px, 5vw, 56px)", lineHeight: 1.08, fontWeight: 500, letterSpacing: -1.8, margin: "0 0 16px" },
  muted: { color: "#aeb6a7", fontSize: 14, lineHeight: 1.8, maxWidth: 680, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 235px), 1fr))", gap: 16, marginTop: 26 },
  card: { border: "1px solid rgba(230,237,220,.13)", borderRadius: 14, background: "#191f17", padding: 22, minWidth: 0 },
  icon: { width: 42, height: 42, display: "grid", placeItems: "center", color: "#b7d69a", borderRadius: 10, background: "rgba(183,214,154,.1)", marginBottom: 18 },
  label: { color: "#a2a99b", fontSize: 10, letterSpacing: 1.7, margin: "0 0 10px" },
  cardTitle: { fontSize: 19, fontWeight: 600, margin: "0 0 8px", overflowWrap: "anywhere" },
  cardText: { color: "#aeb6a7", fontSize: 12, lineHeight: 1.7, margin: "0 0 18px" },
  cardLink: { display: "inline-flex", alignItems: "center", gap: 8, color: "#cde5b5", textDecoration: "none", fontSize: 12 },
  sectionTitle: { fontSize: 24, fontWeight: 500, margin: "0 0 6px" },
  task: { display: "flex", gap: 13, width: "100%", textAlign: "left", padding: "17px 0", border: 0, borderBottom: "1px solid rgba(230,237,220,.1)", background: "transparent", color: "#f2f1e9", cursor: "pointer" },
  taskTitle: { display: "block", fontSize: 14, fontWeight: 600, marginBottom: 5 },
  taskDetail: { display: "block", color: "#aeb6a7", fontSize: 12, lineHeight: 1.6 },
  note: { color: "#a2a99b", fontSize: 11, lineHeight: 1.6, margin: "18px 0 0" },
};

export default function AdminPage() {
  const [done, setDone] = useState({});
  const [today, setToday] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("zs-admin-checklist");
      if (saved) setDone(JSON.parse(saved));
      setToday(new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date()));
    } catch {}
  }, []);

  function toggleTask(id) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    try { window.localStorage.setItem("zs-admin-checklist", JSON.stringify(next)); } catch {}
  }

  const completed = tasks.filter(task => done[task.id]).length;

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <header style={styles.top}>
          <a href="/" style={styles.brand}>
            <span style={styles.mark}><Leaf size={24} /></span>
            <span><strong style={{ letterSpacing: 1.5 }}>ZIELEŃ SERWIS</strong><small style={styles.small}>PANEL WŁAŚCICIELA</small></span>
          </a>
          <a href="/" style={styles.link}><ArrowLeft size={16} /> Wróć na stronę</a>
        </header>

        <section style={styles.hero}>
          <p style={styles.kicker}>CENTRUM ZARZĄDZANIA · {today || "WITAJ"}</p>
          <h1 style={styles.h1}>Panel właściciela</h1>
          <p style={styles.muted}>Witaj! Ten panel jest teraz otwarty bez logowania i bez hasła. Możesz przejść do najważniejszych sekcji strony i korzystać z listy kontrolnej.</p>
        </section>

        <section style={styles.grid} aria-label="Szybkie skróty">
          <article style={styles.card}>
            <span style={styles.icon}><Eye size={21} /></span>
            <p style={styles.label}>WITRYNA</p>
            <h2 style={styles.cardTitle}>Strona główna</h2>
            <p style={styles.cardText}>Otwórz publiczną stronę i sprawdź, jak widzą ją klienci.</p>
            <a href="/" target="_blank" rel="noreferrer" style={styles.cardLink}>Otwórz stronę <ExternalLink size={14} /></a>
          </article>
          <article style={styles.card}>
            <span style={styles.icon}><Phone size={21} /></span>
            <p style={styles.label}>KONTAKT</p>
            <h2 style={styles.cardTitle}>795 548 125</h2>
            <p style={styles.cardText}>Dane kontaktowe firmy prezentowane na stronie.</p>
            <a href="tel:+48795548125" style={styles.cardLink}>Zadzwoń <ArrowUpRight size={14} /></a>
          </article>
          <article style={styles.card}>
            <span style={styles.icon}><Sparkles size={21} /></span>
            <p style={styles.label}>ASYSTENT WWW</p>
            <h2 style={styles.cardTitle}>Asystent strony</h2>
            <p style={styles.cardText}>Przetestuj odpowiedzi i przejdź do sekcji kontaktowej.</p>
            <a href="/#kontakt" target="_blank" rel="noreferrer" style={styles.cardLink}>Przetestuj <ArrowUpRight size={14} /></a>
          </article>
        </section>

        <section style={{ ...styles.card, marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
            <div>
              <p style={styles.kicker}>LISTA KONTROLNA</p>
              <h2 style={styles.sectionTitle}>Sprawdzenie strony</h2>
              <p style={{ ...styles.muted, fontSize: 12 }}>Zaznaczenia zapisują się lokalnie w tej przeglądarce.</p>
            </div>
            <strong style={{ color: "#b7d69a", fontSize: 14 }}>{completed}/{tasks.length} wykonane</strong>
          </div>
          <div style={{ height: 4, background: "rgba(230,237,220,.1)", borderRadius: 10, overflow: "hidden", margin: "20px 0 4px" }}>
            <div style={{ width: (completed / tasks.length * 100) + "%", height: "100%", background: "#b7d69a", transition: "width .2s" }} />
          </div>
          {tasks.map(task => (
            <button key={task.id} type="button" onClick={() => toggleTask(task.id)} style={styles.task}>
              <span style={{ color: done[task.id] ? "#b7d69a" : "#778170", flexShrink: 0, marginTop: 1 }}>
                {done[task.id] ? <CheckCircle2 size={21} /> : <Circle size={21} />}
              </span>
              <span>
                <span style={{ ...styles.taskTitle, textDecoration: done[task.id] ? "line-through" : "none", color: done[task.id] ? "#a2a99b" : "#f2f1e9" }}>{task.title}</span>
                <span style={styles.taskDetail}>{task.detail}</span>
              </span>
            </button>
          ))}
          <button type="button" onClick={() => { setDone({}); try { window.localStorage.removeItem("zs-admin-checklist"); } catch {} }} style={{ ...styles.link, marginTop: 18, border: 0, background: "transparent", padding: 0, cursor: "pointer" }}>
            <RefreshCw size={14} /> Wyczyść listę
          </button>
        </section>

        <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", paddingTop: 24, color: "#a2a99b", fontSize: 11 }}>
          <span>© {new Date().getFullYear()} Zieleń Serwis</span>
          <span>Panel bez logowania — dostępny dla każdego, kto zna adres /admin.</span>
        </footer>
      </div>
    </main>
  );
}
