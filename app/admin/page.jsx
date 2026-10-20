"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Check, ChevronRight, CircleHelp,
  Eye, FileText, Globe2, Image as ImageIcon, LayoutDashboard, Leaf, Menu,
  MessageSquareText, Palette, Phone, Plus, Save, Settings2, ShieldCheck,
  Sparkles, Sprout, Trash2, Upload, X
} from "lucide-react";

const STORAGE_KEY = "zs-admin-site-settings-v2";
const DEFAULTS = {
  brand: "Zieleń Serwis",
  phone: "795 548 125",
  email: "",
  address: "Szosa Bydgoska 22, 86-065 Łochowo",
  area: "Łochowo, Bydgoszcz i okolice",
  since: "2000",
  heroEyebrow: "KOMPLEKSOWE USŁUGI OGRODNICZE",
  heroTitle: "Ogród, w którym chce się zostać.",
  heroText: "Od projektu i wyceny po zakup materiałów, transport, wykonanie i pielęgnację. Kompleksowo dbamy o ogrody i tereny zieleni od 2000 roku.",
  aboutTitle: "Ogród to nie tylko miejsce. To codzienność, którą projektujemy.",
  aboutText: "Zieleń Serwis od 2000 roku świadczy kompleksowe usługi ogrodnicze. Prowadzimy klienta przez cały proces: od projektu i wyceny, przez zakup i transport materiałów, po wykonanie oraz pielęgnację ogrodu i terenów zieleni.",
  ctaText: "Porozmawiajmy o ogrodzie",
  accent: "#a9c989",
  services: [
    { title: "Projektowanie ogrodów", desc: "Przemyślana koncepcja, która łączy Twoje pomysły z charakterem miejsca i wygodą codziennego użytkowania.", active: true },
    { title: "Zakładanie ogrodów", desc: "Od przygotowania terenu i prac ziemnych po trawnik, nasadzenia i ostatnie dopracowane detale.", active: true },
    { title: "Pielęgnacja zieleni", desc: "Regularna troska o rośliny i trawnik, by ogród dobrze wyglądał przez cały sezon.", active: true },
    { title: "Systemy nawadniania", desc: "Wygodne podlewanie dopasowane do ogrodu, które pomaga dbać o rośliny bez codziennego wysiłku.", active: true },
    { title: "Oczka wodne i kaskady", desc: "Woda, która wnosi do ogrodu ruch, dźwięk i naturalny punkt przyciągający wzrok.", active: true },
    { title: "Nawierzchnie i mała architektura", desc: "Ścieżki, tarasy, podjazdy, pergole i elementy wykończenia, które porządkują przestrzeń.", active: true },
    { title: "Prace ziemne i miniładowarki", desc: "Przygotowanie terenu, niwelacja, transport ziemi i prace ziemne z wykorzystaniem miniładowarek.", active: true }
  ]
};

const navItems = [
  { id: "overview", label: "Przegląd", icon: LayoutDashboard },
  { id: "content", label: "Treści strony", icon: FileText },
  { id: "services", label: "Usługi", icon: Sprout },
  { id: "contact", label: "Kontakt i firma", icon: Phone },
  { id: "appearance", label: "Wygląd", icon: Palette },
  { id: "settings", label: "Ustawienia", icon: Settings2 }
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box}
.admin-shell{min-height:100vh;background:#f4f6f1;color:#1b261c;font-family:'DM Sans',sans-serif}
.admin-sidebar{background:#15251a;color:#eaf1e6;width:250px;flex-shrink:0;padding:24px 16px;display:flex;flex-direction:column;min-height:100vh}
.admin-logo{display:flex;gap:12px;align-items:center;padding:4px 10px 28px;border-bottom:1px solid #ffffff1a;margin-bottom:22px}
.admin-logo-mark{height:40px;width:40px;border-radius:13px;background:#a9c989;color:#18301c;display:grid;place-items:center}
.admin-nav{display:flex;align-items:center;gap:11px;width:100%;padding:12px 13px;border:0;background:transparent;color:#afbeae;border-radius:11px;text-align:left;cursor:pointer;font:500 13px 'DM Sans',sans-serif;margin:3px 0;transition:.18s}
.admin-nav:hover{background:#ffffff0b;color:#fff}
.admin-nav.active{background:#a9c989;color:#1b2b1d;font-weight:700}
.admin-main{min-width:0;flex:1;padding:28px clamp(18px,3.3vw,48px) 48px}
.admin-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:28px}
.admin-eyebrow{font-size:10px;letter-spacing:1.9px;font-weight:800;color:#71806f;text-transform:uppercase}
.admin-h1{font:700 clamp(26px,3vw,36px)/1.15 'Manrope',sans-serif;letter-spacing:-1.1px;margin:7px 0 8px;color:#1b261c}
.admin-sub{font-size:13px;color:#748071;line-height:1.65;margin:0}
.admin-card{background:#fff;border:1px solid #e5e9e0;border-radius:18px;padding:22px;box-shadow:0 5px 20px #243b2410;min-width:0}
.admin-stat{background:#fff;border:1px solid #e5e9e0;border-radius:16px;padding:19px;min-width:0}
.admin-stat-icon{height:38px;width:38px;border-radius:12px;display:grid;place-items:center;background:#edf4e7;color:#547744;margin-bottom:16px}
.admin-label{font-size:11px;font-weight:700;color:#5d6b5b;display:block;margin-bottom:7px}
.admin-input,.admin-textarea,.admin-select{width:100%;border:1px solid #dfe5db;border-radius:10px;padding:12px 13px;background:#fbfcfa;color:#1b261c;font:13px 'DM Sans',sans-serif;outline:none;transition:.18s}
.admin-input:focus,.admin-textarea:focus,.admin-select:focus{border-color:#7e9f67;box-shadow:0 0 0 3px #a9c98930;background:#fff}
.admin-textarea{resize:vertical;min-height:100px;line-height:1.65}
.admin-field{margin-bottom:17px}
.admin-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 15px;border-radius:10px;border:1px solid #dce4d6;background:#fff;color:#31452f;font:700 12px 'DM Sans',sans-serif;cursor:pointer;transition:.18s;text-decoration:none}
.admin-btn:hover{transform:translateY(-1px);border-color:#9ab58a}
.admin-btn.primary{background:#24462c;border-color:#24462c;color:#fff}
.admin-btn.primary:hover{background:#315a38}
.admin-btn.soft{background:#edf4e7;border-color:#edf4e7;color:#35572e}
.admin-btn.danger{color:#a43f35;border-color:#f0d9d5;background:#fff9f8}
.admin-badge{display:inline-flex;align-items:center;gap:6px;border-radius:99px;padding:6px 9px;font-size:10px;font-weight:700;background:#edf4e7;color:#426337}
.admin-divider{height:1px;background:#edf0e9;margin:20px 0}
.admin-service{display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:start;gap:13px;padding:17px 0;border-bottom:1px solid #edf0e9}
.admin-service:last-child{border-bottom:0}
.admin-number{height:34px;width:34px;border-radius:10px;display:grid;place-items:center;background:#eff4eb;color:#4c6d3d;font-size:11px;font-weight:800}
.admin-mini{font-size:11px;color:#7b8678;line-height:1.6}
.admin-toggle{width:37px;height:22px;border-radius:20px;border:0;padding:3px;cursor:pointer;display:flex;align-items:center;transition:.2s}
.admin-toggle span{width:16px;height:16px;border-radius:50%;background:white;box-shadow:0 1px 3px #0002;transition:.2s}
.admin-toggle.on{background:#6c9255;justify-content:flex-end}
.admin-toggle.off{background:#c9d0c5;justify-content:flex-start}
.admin-preview{background:#17271c;color:#edf3e8;border-radius:16px;padding:26px;position:relative;overflow:hidden}
.admin-preview:after{content:'';position:absolute;width:190px;height:190px;border:1px solid #a9c98935;border-radius:50%;right:-55px;top:-60px;box-shadow:0 0 0 25px #a9c98908,0 0 0 50px #a9c98905}
.admin-preview h3{font:600 29px/1.2 'Manrope',sans-serif;letter-spacing:-.8px;margin:13px 0}
.admin-preview p{font-size:12px;line-height:1.8;color:#bac7b7;max-width:500px}
.admin-color{height:35px;width:35px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 1px #d5ddd0;cursor:pointer}
@media(max-width:850px){.admin-layout{display:block!important}.admin-sidebar{min-height:unset;width:100%;padding:14px;position:relative}.admin-logo{padding-bottom:13px;margin-bottom:10px}.admin-nav-list{display:flex;overflow:auto;gap:5px}.admin-nav{white-space:nowrap;width:auto;flex-shrink:0;padding:10px}.admin-side-bottom{display:none}.admin-main{padding:22px 15px 35px}.admin-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.admin-content-grid{grid-template-columns:minmax(0,1fr)!important}}
`;

export default function AdminPage() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [active, setActive] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [importText, setImportText] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };
  const updateService = (index, key, value) => {
    setSettings(prev => ({ ...prev, services: prev.services.map((service, i) => i === index ? { ...service, [key]: value } : service) }));
    setSaved(false);
  };
  const save = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setToast("Zmiany zapisane w tej przeglądarce");
      window.setTimeout(() => setToast(""), 3200);
    } catch {
      setToast("Nie udało się zapisać zmian — sprawdź ustawienia przeglądarki");
    }
  };
  const reset = () => {
    if (!window.confirm("Przywrócić domyślne ustawienia panelu? Twoje lokalne zmiany zostaną zastąpione.")) return;
    setSettings(DEFAULTS);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
    setToast("Przywrócono ustawienia domyślne");
    window.setTimeout(() => setToast(""), 3200);
  };
  const addService = () => {
    setSettings(prev => ({ ...prev, services: [...prev.services, { title: "Nowa usługa", desc: "Opis usługi do uzupełnienia.", active: true }] }));
    setSaved(false);
  };
  const exportSettings = async () => {
    const text = JSON.stringify(settings, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setToast("Konfiguracja skopiowana do schowka");
    } catch {
      setImportText(text);
      setToast("Skopiuj konfigurację z pola tekstowego");
    }
    window.setTimeout(() => setToast(""), 3200);
  };
  const importSettings = () => {
    try {
      const parsed = JSON.parse(importText);
      setSettings({ ...DEFAULTS, ...parsed });
      setSaved(false);
      setToast("Konfiguracja wczytana — kliknij Zapisz zmiany");
    } catch {
      setToast("Nieprawidłowy JSON. Wklej konfigurację wyeksportowaną z panelu.");
    }
    window.setTimeout(() => setToast(""), 3200);
  };
  const activeServices = useMemo(() => settings.services.filter(s => s.active).length, [settings.services]);

  const field = (label, key, options = {}) => (
    <div className="admin-field" key={key}>
      <label className="admin-label" htmlFor={"field-" + key}>{label}</label>
      {options.multiline
        ? <textarea id={"field-" + key} className="admin-textarea" value={settings[key] ?? ""} rows={options.rows || 4} onChange={e => update(key, e.target.value)} placeholder={options.placeholder || ""} />
        : <input id={"field-" + key} className="admin-input" value={settings[key] ?? ""} onChange={e => update(key, e.target.value)} placeholder={options.placeholder || ""} />}
      {options.help && <p className="admin-mini" style={{ margin: "6px 0 0" }}>{options.help}</p>}
    </div>
  );

  return (
    <div className="admin-shell">
      <style>{css}</style>
      <div className="admin-layout" style={{ display: "flex", minHeight: "100vh" }}>
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <span className="admin-logo-mark"><Leaf size={23}/></span>
            <span><strong style={{ font: "800 14px Manrope,sans-serif", letterSpacing: ".4px" }}>ZIELEŃ SERWIS</strong><span style={{ display: "block", fontSize: 10, color: "#a9c989", letterSpacing: 1.5, marginTop: 4 }}>STUDIO WŁAŚCICIELA</span></span>
          </div>
          <div className="admin-nav-list">
            {navItems.map(item => {
              const Icon = item.icon;
              return <button key={item.id} className={"admin-nav " + (active === item.id ? "active" : "")} onClick={() => { setActive(item.id); setMobileMenu(false); }}>
                <Icon size={16}/>{item.label}{active === item.id && <ChevronRight size={14} style={{ marginLeft: "auto" }}/>}
              </button>;
            })}
          </div>
          <div className="admin-side-bottom" style={{ marginTop: "auto", padding: "20px 10px 2px" }}>
            <div style={{ borderTop: "1px solid #ffffff1c", paddingTop: 18 }}>
              <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 10 }}><span style={{ width: 7, height: 7, background: "#a9c989", borderRadius: "50%" }}/><span style={{ fontSize: 11, color: "#c5d1c0" }}>Panel gotowy do edycji</span></div>
              <p style={{ fontSize: 10, lineHeight: 1.7, color: "#819381", margin: 0 }}>Zapis lokalny · bez konta i hasła</p>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <div className="admin-eyebrow">ZIELEŃ SERWIS / PANEL</div>
              <h1 className="admin-h1">{navItems.find(n => n.id === active)?.label || "Panel"}</h1>
              <p className="admin-sub">Zarządzaj treścią i ustawieniami swojej strony w jednym miejscu.</p>
            </div>
            <div style={{ display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
              <a className="admin-btn" href="/" target="_blank" rel="noreferrer"><Eye size={15}/> Podgląd strony <ArrowUpRight size={14}/></a>
              <button className="admin-btn primary" onClick={save}><Save size={15}/>{saved ? "Zapisano" : "Zapisz zmiany"}</button>
            </div>
          </div>

          {!loaded ? <div className="admin-card">Wczytywanie ustawień…</div> : <>
            {active === "overview" && <>
              <div className="admin-stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 14, marginBottom: 18 }}>
                {[
                  { label: "USŁUGI NA STRONIE", value: activeServices, icon: Sprout, note: "pozycje aktywne" },
                  { label: "DANE KONTAKTOWE", value: settings.phone ? "OK" : "Uzupełnij", icon: Phone, note: "telefon firmy" },
                  { label: "TREŚĆ HERO", value: settings.heroTitle.trim() ? "Gotowa" : "Brak", icon: FileText, note: "główny nagłówek" },
                  { label: "ZAPIS ZMIAN", value: saved ? "Zapisano" : "Robocze", icon: Activity, note: saved ? "ustawienia zapisane" : "masz niezapisane zmiany" }
                ].map((stat, i) => { const Icon = stat.icon; return <div className="admin-stat" key={i}><div className="admin-stat-icon"><Icon size={18}/></div><div className="admin-eyebrow" style={{ fontSize: 9, letterSpacing: 1.1 }}>{stat.label}</div><div style={{ font: "700 24px Manrope,sans-serif", margin: "7px 0 4px", overflowWrap: "anywhere" }}>{stat.value}</div><div className="admin-mini">{stat.note}</div></div>; })}
              </div>
              <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(280px,.75fr)", gap: 18 }}>
                <section className="admin-card">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", marginBottom: 18 }}>
                    <div><div className="admin-eyebrow">SZYBKI START</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0 5px" }}>Co chcesz dziś zmienić?</h2><p className="admin-sub">Przejdź prosto do wybranej części witryny.</p></div>
                    <span className="admin-stat-icon"><Sparkles size={18}/></span>
                  </div>
                  {[
                    { id: "content", icon: FileText, title: "Nagłówki i teksty", desc: "Edytuj główny przekaz, opis firmy i przycisk kontaktowy." },
                    { id: "services", icon: Sprout, title: "Oferta usług", desc: "Zmień nazwy i opisy, dodaj nową pozycję albo ukryj usługę." },
                    { id: "contact", icon: Phone, title: "Dane firmy", desc: "Telefon, adres, obszar działania i podstawowe informacje." },
                    { id: "appearance", icon: Palette, title: "Kolor akcentu", desc: "Dobierz kolor przewodni i zobacz go w podglądzie." }
                  ].map((item, i) => { const Icon = item.icon; return <button key={item.id} onClick={() => setActive(item.id)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 13, padding: "14px 0", border: 0, borderBottom: i === 3 ? 0 : "1px solid #edf0e9", background: "transparent", cursor: "pointer", color: "#1b261c" }}><span className="admin-stat-icon" style={{ margin: 0, flexShrink: 0 }}><Icon size={17}/></span><span style={{ flex: 1 }}><strong style={{ display: "block", fontSize: 13, marginBottom: 4 }}>{item.title}</strong><span className="admin-mini">{item.desc}</span></span><ChevronRight size={16} color="#81907c"/></button>; })}
                </section>
                <section className="admin-preview">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: settings.accent, fontSize: 9, letterSpacing: 1.7, fontWeight: 800 }}><span style={{ height: 6, width: 6, borderRadius: 8, background: settings.accent }}/>{settings.heroEyebrow}</span>
                  <h3>{settings.heroTitle}</h3>
                  <p>{settings.heroText}</p>
                  <span style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "11px 14px", background: settings.accent, color: "#17271c", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>{settings.ctaText}<ArrowUpRight size={14}/></span>
                  <div style={{ marginTop: 28, paddingTop: 15, borderTop: "1px solid #ffffff20", display: "flex", gap: 8, alignItems: "center", fontSize: 10, color: "#b9c8b4" }}><Phone size={13}/>{settings.phone}<span style={{ marginLeft: "auto" }}>{settings.area}</span></div>
                </section>
              </div>
              <div className="admin-card" style={{ marginTop: 18, display: "flex", alignItems: "start", gap: 13 }}>
                <span className="admin-stat-icon" style={{ margin: 0, flexShrink: 0 }}><CircleHelp size={18}/></span>
                <div><strong style={{ fontSize: 13 }}>Ważne: jak działa zapis?</strong><p className="admin-sub" style={{ marginTop: 5 }}>Na tym etapie zmiany są zapisywane w pamięci tej przeglądarki. Nie zmieniają automatycznie publicznej strony dla wszystkich odwiedzających. Niżej możesz skopiować konfigurację, aby wdrożyć ją do witryny.</p></div>
              </div>
            </>}

            {active === "content" && <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(270px,.75fr)", gap: 18 }}>
              <section className="admin-card"><div className="admin-eyebrow">STRONA GŁÓWNA</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0 20px" }}>Treści i nagłówki</h2>
                {field("Mały nagłówek nad tytułem", "heroEyebrow")}
                {field("Główny tytuł", "heroTitle", { multiline: true, rows: 2, help: "To pierwsza rzecz, którą klient czyta po wejściu na stronę." })}
                {field("Opis pod tytułem", "heroText", { multiline: true, rows: 5 })}
                <div className="admin-divider"/>
                {field("Nagłówek sekcji „O nas”", "aboutTitle", { multiline: true, rows: 2 })}
                {field("Opis firmy", "aboutText", { multiline: true, rows: 5 })}
                {field("Tekst przycisku kontaktowego", "ctaText")}
              </section>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <section className="admin-preview"><span style={{ color: settings.accent, fontSize: 9, letterSpacing: 1.5, fontWeight: 800 }}>{settings.heroEyebrow}</span><h3>{settings.heroTitle}</h3><p>{settings.heroText}</p><span style={{ background: settings.accent, color: "#17271c", display: "inline-block", padding: "10px 13px", borderRadius: 8, fontSize: 11, fontWeight: 800 }}>{settings.ctaText}</span></section>
                <section className="admin-card"><div className="admin-eyebrow">DOBRA PRAKTYKA</div><h3 style={{ font: "700 16px Manrope,sans-serif", margin: "8px 0" }}>Pisz konkretnie</h3><p className="admin-sub">Krótki nagłówek, jasna korzyść dla klienta i czytelne wezwanie do kontaktu zwykle sprawdzają się lepiej niż długi, ogólny tekst.</p></section>
              </div>
            </div>}

            {active === "services" && <section className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap", marginBottom: 8 }}><div><div className="admin-eyebrow">OFERTA</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0 5px" }}>Usługi firmy</h2><p className="admin-sub">Zmieniaj opisy, dodawaj pozycje i ukrywaj usługi, których nie chcesz prezentować.</p></div><button className="admin-btn primary" onClick={addService}><Plus size={15}/> Dodaj usługę</button></div>
              {settings.services.map((service, i) => <div className="admin-service" key={i}>
                <div className="admin-number">{String(i + 1).padStart(2, "0")}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="admin-field"><label className="admin-label" htmlFor={"service-title-" + i}>Nazwa usługi</label><input id={"service-title-" + i} className="admin-input" value={service.title} onChange={e => updateService(i, "title", e.target.value)}/></div>
                  <div className="admin-field" style={{ marginBottom: 8 }}><label className="admin-label" htmlFor={"service-desc-" + i}>Opis</label><textarea id={"service-desc-" + i} className="admin-textarea" rows={2} value={service.desc} onChange={e => updateService(i, "desc", e.target.value)}/></div>
                  <span className="admin-mini">{service.active ? "Widoczna w konfiguracji" : "Ukryta w konfiguracji"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "end", gap: 12 }}><button className={"admin-toggle " + (service.active ? "on" : "off")} aria-label={service.active ? "Ukryj usługę" : "Pokaż usługę"} onClick={() => updateService(i, "active", !service.active)}><span/></button><button className="admin-btn danger" aria-label="Usuń usługę" onClick={() => { if (window.confirm("Usunąć tę usługę z konfiguracji?")) { setSettings(prev => ({ ...prev, services: prev.services.filter((_, j) => j !== i) })); setSaved(false); } }}><Trash2 size={14}/></button></div>
              </div>)}
              <div className="admin-divider"/><div className="admin-mini">Aktywne usługi: <strong>{activeServices}</strong> z {settings.services.length}</div>
            </section>}

            {active === "contact" && <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(260px,.7fr)", gap: 18 }}>
              <section className="admin-card"><div className="admin-eyebrow">DANE PODSTAWOWE</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0 20px" }}>Informacje o firmie</h2>
                {field("Nazwa firmy", "brand")}
                {field("Telefon", "phone", { help: "Wpisz numer w formacie czytelnym dla klientów." })}
                {field("E-mail", "email", { placeholder: "np. kontakt@twojadomena.pl" })}
                {field("Adres", "address")}
                {field("Obszar działania", "area")}
                {field("Działamy od (rok)", "since")}
              </section>
              <section className="admin-card"><span className="admin-stat-icon"><Phone size={18}/></span><div className="admin-eyebrow">PODGLĄD KONTAKTU</div><h3 style={{ font: "700 22px Manrope,sans-serif", margin: "9px 0" }}>{settings.phone || "Dodaj numer telefonu"}</h3><p className="admin-sub">{settings.brand}</p><div className="admin-divider"/><p className="admin-sub" style={{ marginBottom: 8 }}>{settings.address}</p><p className="admin-sub">{settings.area}</p>{settings.email && <p className="admin-sub" style={{ marginTop: 8 }}>{settings.email}</p>}</section>
            </div>}

            {active === "appearance" && <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(270px,.8fr)", gap: 18 }}>
              <section className="admin-card"><div className="admin-eyebrow">IDENTYFIKACJA WIZUALNA</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0 20px" }}>Kolor przewodni</h2><p className="admin-sub" style={{ marginBottom: 18 }}>Wybierz odcień pasujący do charakteru marki.</p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>{["#a9c989", "#7fae7b", "#d0b879", "#91b8b0", "#c2a1bd", "#e0a477"].map(color => <button key={color} className="admin-color" aria-label={"Wybierz kolor " + color} onClick={() => update("accent", color)} style={{ background: color, outline: settings.accent === color ? "2px solid #24462c" : "none", outlineOffset: 3 }}/>)}</div>
                <div className="admin-field"><label className="admin-label" htmlFor="custom-accent">Własny kolor HEX</label><div style={{ display: "flex", gap: 9 }}><input id="custom-accent" type="color" value={/^#[0-9a-f]{6}$/i.test(settings.accent) ? settings.accent : "#a9c989"} onChange={e => update("accent", e.target.value)} style={{ height: 42, width: 54, border: "1px solid #dfe5db", borderRadius: 10, background: "#fff", padding: 4 }}/><input className="admin-input" value={settings.accent} onChange={e => update("accent", e.target.value)} aria-label="Kod koloru HEX"/></div></div>
              </section>
              <section className="admin-preview" style={{ background: "#17271c" }}><div style={{ color: settings.accent, fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>ZIELEŃ SERWIS</div><h3 style={{ fontSize: 30 }}>Naturalnie. Po Twojemu.</h3><p>Podgląd kolorystyczny Twojej marki. Zmiana koloru w tej sekcji aktualizuje próbkę.</p><span style={{ display: "inline-flex", gap: 8, alignItems: "center", padding: "12px 15px", background: settings.accent, color: "#17271c", borderRadius: 8, fontWeight: 800, fontSize: 11 }}><Leaf size={15}/> Zieleń, która zostaje</span></section>
            </div>}

            {active === "settings" && <div className="admin-content-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(260px,.8fr)", gap: 18 }}>
              <section className="admin-card"><div className="admin-eyebrow">KOPIA KONFIGURACJI</div><h2 style={{ font: "700 20px Manrope,sans-serif", margin: "8px 0" }}>Eksport i import</h2><p className="admin-sub" style={{ marginBottom: 18 }}>Skopiuj ustawienia do przekazania programiście lub wczytaj wcześniej wyeksportowany plik JSON.</p><div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 16 }}><button className="admin-btn primary" onClick={exportSettings}><Upload size={15}/> Eksportuj konfigurację</button><button className="admin-btn" onClick={() => setImportText(JSON.stringify(settings, null, 2))}>Pokaż JSON</button></div><label className="admin-label" htmlFor="config-json">Konfiguracja JSON</label><textarea id="config-json" className="admin-textarea" rows={10} value={importText} onChange={e => setImportText(e.target.value)} placeholder="Kliknij „Pokaż JSON” lub wklej wyeksportowaną konfigurację…"/><div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 10 }}><button className="admin-btn soft" onClick={importSettings}>Wczytaj konfigurację</button><button className="admin-btn" onClick={() => setImportText("")}>Wyczyść pole</button></div></section>
              <section className="admin-card"><span className="admin-stat-icon"><ShieldCheck size={18}/></span><div className="admin-eyebrow">PRYWATNOŚĆ I DOSTĘP</div><h3 style={{ font: "700 17px Manrope,sans-serif", margin: "9px 0" }}>Panel bez logowania</h3><p className="admin-sub">Panel nie wymaga hasła, zgodnie z ustaleniem. Oznacza to, że każda osoba znająca adres /admin może go otworzyć. Nie wpisuj tu danych poufnych.</p><div className="admin-divider"/><button className="admin-btn danger" onClick={reset}><Trash2 size={15}/> Przywróć domyślne ustawienia</button></section>
            </div>}
          </>}
          <footer style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 25, paddingTop: 18, borderTop: "1px solid #e2e8dd", color: "#879182", fontSize: 10 }}>
            <span>© {new Date().getFullYear()} Zieleń Serwis · Studio właściciela</span><span style={{ display: "flex", gap: 6, alignItems: "center" }}><ShieldCheck size={12}/> Panel bez hasła · zmiany lokalne</span>
          </footer>
        </main>
      </div>
      {toast && <div role="status" style={{ position: "fixed", right: 20, bottom: 20, zIndex: 50, maxWidth: "calc(100vw - 40px)", background: "#1e3925", color: "#f4f8f0", padding: "14px 18px", borderRadius: 12, boxShadow: "0 12px 35px #14241940", fontSize: 12, display: "flex", gap: 9, alignItems: "center" }}><Check size={16} color="#a9c989"/>{toast}</div>}
    </div>
  );
}
