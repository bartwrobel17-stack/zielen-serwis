"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Circle, ExternalLink, Eye, EyeOff, Leaf, LockKeyhole, LogOut, Phone, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

const tasks = [
  { id: "photos", title: "Sprawdź zdjęcia i film w sekcji głównej", detail: "Upewnij się, że materiały pokazują prawdziwe ogrody i rośliny." },
  { id: "phone", title: "Potwierdź numer telefonu i obszar dojazdu", detail: "Dane kontaktowe są widoczne na stronie i w asystencie." },
  { id: "reviews", title: "Zaktualizuj opinie klientów", detail: "Publikuj wyłącznie prawdziwe, zweryfikowane opinie." },
  { id: "chat", title: "Przetestuj odpowiedzi asystenta", detail: "Sprawdź wycenę, usługi, terminy i kontakt." },
];

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState({});
  const [lastVisit, setLastVisit] = useState("");

  async function checkSession() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/session", { cache: "no-store" });
      const data = await response.json();
      setConfigured(data.configured);
      setAuthenticated(data.authenticated);
    } catch {
      setError("Nie udało się sprawdzić sesji. Odśwież stronę.");
    } finally { setLoading(false); }
  }

  useEffect(() => {
    checkSession();
    try {
      const saved = window.localStorage.getItem("zs-admin-checklist");
      if (saved) setDone(JSON.parse(saved));
      setLastVisit(new Intl.DateTimeFormat("pl-PL", { dateStyle: "long" }).format(new Date()));
    } catch {}
  }, []);

  async function login(event) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Logowanie nie powiodło się.");
      setPassword(""); setAuthenticated(true);
    } catch (e) { setError(e.message || "Wystąpił błąd."); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthenticated(false);
  }

  function toggleTask(id) {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    try { window.localStorage.setItem("zs-admin-checklist", JSON.stringify(next)); } catch {}
  }

  if (loading) return <main className="admin-screen"><div className="admin-loading"><span className="admin-spinner" /> Sprawdzam bezpieczną sesję…</div></main>;

  if (!authenticated) return <main className="admin-screen">
    <a className="admin-back" href="/"><ArrowLeft size={16} /> Wróć na stronę</a>
    <section className="admin-login-card">
      <div className="admin-brand"><span><Leaf size={25} /></span><div><strong>ZIELEŃ SERWIS</strong><small>PANEL WŁAŚCICIELA</small></div></div>
      <div className="admin-lock"><LockKeyhole size={24} /></div>
      <p className="admin-kicker">STREFA PRYWATNA</p>
      <h1>Witaj ponownie.</h1>
      <p className="admin-muted">Zaloguj się, aby otworzyć panel zarządzania firmą.</p>
      {configured === false && <div className="admin-alert"><ShieldCheck size={18} /><span>Panel wymaga konfiguracji w Vercel. Dodaj zmienne środowiskowe <code>ADMIN_PASSWORD</code> oraz <code>ADMIN_SESSION_SECRET</code>, a następnie ponownie wdroż stronę.</span></div>}
      <form onSubmit={login} className="admin-login-form">
        <label htmlFor="admin-password">Hasło właściciela</label>
        <div className="admin-password-wrap"><input id="admin-password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Wpisz hasło" autoComplete="current-password" required disabled={configured === false} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-primary" disabled={busy || configured === false}>{busy ? "Logowanie…" : "Zaloguj bezpiecznie"} <ArrowUpRight size={17} /></button>
      </form>
      <p className="admin-security-note"><LockKeyhole size={13} /> Sesja zabezpieczona podpisanym ciasteczkiem HttpOnly.</p>
    </section>
  </main>;

  return <main className="admin-screen admin-dashboard">
    <header className="admin-topbar"><a className="admin-brand" href="/"><span><Leaf size={23} /></span><div><strong>ZIELEŃ SERWIS</strong><small>PANEL WŁAŚCICIELA</small></div></a><div className="admin-top-actions"><span className="admin-status"><i /> Panel zabezpieczony</span><button onClick={logout} className="admin-logout"><LogOut size={16} /> Wyloguj</button></div></header>
    <div className="admin-main">
      <div className="admin-welcome"><div><p className="admin-kicker">CENTRUM ZARZĄDZANIA</p><h1>Dzień dobry. <em>Dbajmy o rozwój.</em></h1><p className="admin-muted">Skróty do najważniejszych działań i kontrola jakości strony.</p></div><span className="admin-date">{lastVisit}</span></div>
      <section className="admin-stat-grid">
        <article className="admin-stat-card"><span className="admin-stat-icon"><Eye size={20} /></span><span className="admin-stat-label">WIZYTÓWKA ONLINE</span><strong>Aktywna</strong><small>Strona publiczna</small><a href="/" target="_blank" rel="noreferrer">Otwórz stronę <ExternalLink size={14} /></a></article>
        <article className="admin-stat-card"><span className="admin-stat-icon"><Phone size={20} /></span><span className="admin-stat-label">KONTAKT</span><strong>795 548 125</strong><small>Telefon firmy</small><a href="tel:+48795548125">Zadzwoń <ArrowUpRight size={14} /></a></article>
        <article className="admin-stat-card"><span className="admin-stat-icon"><Sparkles size={20} /></span><span className="admin-stat-label">ASYSTENT WWW</span><strong>Aktywny na stronie</strong><small>Odpowiada na pytania informacyjne</small><a href="/#kontakt" target="_blank" rel="noreferrer">Przetestuj na stronie <ArrowUpRight size={14} /></a></article>
      </section>
      <div className="admin-content-grid">
        <section className="admin-card admin-checklist"><div className="admin-card-heading"><div><p className="admin-kicker">LISTA KONTROLNA</p><h2>Jakość strony</h2></div><span className="admin-progress">{tasks.filter(t => done[t.id]).length}/{tasks.length}</span></div><div className="admin-progress-track"><span style={{ width: (tasks.filter(t => done[t.id]).length / tasks.length * 100) + "%" }} /></div>{tasks.map(task => <button key={task.id} className={"admin-task " + (done[task.id] ? "is-done" : "")} onClick={() => toggleTask(task.id)}><span className="admin-task-check">{done[task.id] ? <CheckCircle2 size={20} /> : <Circle size={20} />}</span><span><strong>{task.title}</strong><small>{task.detail}</small></span></button>)}<p className="admin-local-note">Lista kontrolna zapisuje się w tej przeglądarce na tym urządzeniu.</p></section>
        <section className="admin-card admin-quick-actions"><p className="admin-kicker">SZYBKIE DZIAŁANIA</p><h2>Co chcesz zrobić?</h2><a href="/#kontakt" target="_blank" rel="noreferrer"><span><Phone size={18} /></span><div><strong>Przejdź do kontaktu</strong><small>Sprawdź formularz i dane firmy</small></div><ArrowUpRight size={17} /></a><a href="/#uslugi" target="_blank" rel="noreferrer"><span><Leaf size={18} /></span><div><strong>Sprawdź ofertę</strong><small>Usługi ogrodnicze prezentowane klientom</small></div><ArrowUpRight size={17} /></a><a href="/#realizacje" target="_blank" rel="noreferrer"><span><Eye size={18} /></span><div><strong>Sprawdź galerię</strong><small>Zdjęcia i inspiracje ogrodowe</small></div><ArrowUpRight size={17} /></a><button onClick={checkSession}><span><RefreshCw size={18} /></span><div><strong>Odśwież status sesji</strong><small>Sprawdź aktualny stan logowania</small></div><ArrowUpRight size={17} /></button></section>
      </div>
      <footer className="admin-footer"><span>© {new Date().getFullYear()} Zieleń Serwis</span><span>Panel właściciela · Dostęp ograniczony</span><a href="/">Powrót na stronę <ArrowLeft size={14} /></a></footer>
    </div>
  </main>;
}
