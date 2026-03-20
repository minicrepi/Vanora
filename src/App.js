import { useState } from "react";
import Karte from "./Karte";

function App() {
  const [schritt, setSchritt] = useState("start");
  const [profil, setProfil] = useState({
    hauptmodus: null,
    typ: null,
    uebernachtung: null,
  });

  function weiter(feld, wert, naechsterSchritt) {
    setProfil((alt) => ({ ...alt, [feld]: wert }));
    setSchritt(naechsterSchritt);
  }

  if (schritt === "start") {
    return (
      <Screen titel="🌍 Vanora" untertitel="Finde deinen perfekten Schlafplatz">
        <Kachel emoji="🚐" titel="Mit Fahrzeug" sub="Wohnmobil · Kastenwagen · Auto mit Dachzelt" farbe="#1D9E75" bg="#0a2a1e" onClick={() => weiter("hauptmodus", "fahrzeug", "typ")} />
        <Kachel emoji="🎒" titel="Ohne Fahrzeug" sub="Wanderer · Backpacker · Zelt & Biwak" farbe="#5B8CDB" bg="#0a1a2e" onClick={() => weiter("hauptmodus", "ohnefahrzeug", "typ")} />
      </Screen>
    );
  }

  if (schritt === "typ") {
    const optionen = profil.hauptmodus === "fahrzeug"
      ? [
          { id: "wohnmobil",     emoji: "🚐", label: "Wohnmobil / Campervan" },
          { id: "kastenwagen",   emoji: "🚚", label: "Kastenwagen / Transporter" },
          { id: "auto_dachzelt", emoji: "🚗", label: "Auto mit Dachzelt" },
        ]
      : [
          { id: "wanderer",   emoji: "🥾", label: "Wanderer / Trekking" },
          { id: "backpacker", emoji: "🎒", label: "Backpacker" },
          { id: "zelt",       emoji: "⛺", label: "Zelt & Biwak" },
        ];
    return (
      <Screen zurueck={() => setSchritt("start")} breadcrumb={profil.hauptmodus === "fahrzeug" ? "Mit Fahrzeug" : "Ohne Fahrzeug"} titel="Was passt zu dir?">
        {optionen.map((o) => (
          <Zeile key={o.id} emoji={o.emoji} label={o.label} onClick={() => weiter("typ", o.id, "uebernachtung")} />
        ))}
      </Screen>
    );
  }

  if (schritt === "uebernachtung") {
    const fahrzeugOptionen = [
      { id: "wildcampen", emoji: "🌿", label: "Wildcampen / Freies Stehen",    sub: "Abseits, kostenlos, Natur pur" },
      { id: "stellplatz", emoji: "🅿️",  label: "Offizieller Stellplatz",        sub: "Mit Strom, Wasser, Services" },
      { id: "camping",    emoji: "🏕️", label: "Campingplatz",                  sub: "Vollausgestatteter Platz" },
      { id: "rastplatz",  emoji: "⛽", label: "Rastplatz / Autobahnraststätte", sub: "Kurze Übernachtung unterwegs" },
    ];
    const naturOptionen = [
      { id: "wildcampen", emoji: "🌲", label: "Wildcampen in der Natur",      sub: "Freie Natur, ohne Infrastruktur" },
      { id: "huette",     emoji: "🏠", label: "Schutzhütte / Alm",            sub: "Bergunterkünfte, oft günstig" },
      { id: "camping",    emoji: "🏕️", label: "Campingplatz",                 sub: "Einfache Infrastruktur" },
      { id: "hostel",     emoji: "🛏️", label: "Hostel / Günstige Unterkunft", sub: "Für Stadtaufenthalte" },
    ];
    const optionen = profil.hauptmodus === "fahrzeug" ? fahrzeugOptionen : naturOptionen;
    const typLabel = { wohnmobil: "Wohnmobil", kastenwagen: "Kastenwagen", auto_dachzelt: "Auto mit Dachzelt", wanderer: "Wanderer", backpacker: "Backpacker", zelt: "Zelt & Biwak" }[profil.typ];
    return (
      <Screen zurueck={() => setSchritt("typ")} breadcrumb={typLabel} titel="Was suchst du?" untertitel="Wähle deinen Übernachtungsstil">
        {optionen.map((o) => (
          <Zeile key={o.id} emoji={o.emoji} label={o.label} sub={o.sub} onClick={() => weiter("uebernachtung", o.id, "profil")} />
        ))}
      </Screen>
    );
  }

  if (schritt === "profil") {
    const typLabel = { wohnmobil: "🚐 Wohnmobil", kastenwagen: "🚚 Kastenwagen", auto_dachzelt: "🚗 Auto mit Dachzelt", wanderer: "🥾 Wanderer", backpacker: "🎒 Backpacker", zelt: "⛺ Zelt & Biwak" }[profil.typ];
    const uebernachtungLabel = { wildcampen: "🌿 Wildcampen", stellplatz: "🅿️ Stellplatz", camping: "🏕️ Campingplatz", rastplatz: "⛽ Rastplatz", huette: "🏠 Schutzhütte", hostel: "🛏️ Hostel" }[profil.uebernachtung];

    if (profil.hauptmodus === "fahrzeug") {
      return (
        <Screen zurueck={() => setSchritt("uebernachtung")} breadcrumb={typLabel} titel="Dein Fahrzeug" untertitel="Einmalig eingeben — wird gespeichert">
          <Eingabe label="Länge (in Meter)" placeholder="z.B. 6.5" wert={profil.laenge || ""} onChange={(v) => setProfil((a) => ({ ...a, laenge: v }))} />
          <Eingabe label="Höhe (in Meter)" placeholder="z.B. 2.8" wert={profil.hoehe || ""} onChange={(v) => setProfil((a) => ({ ...a, hoehe: v }))} />
          <Eingabe label="Gewicht (in kg)" placeholder="z.B. 3500" wert={profil.gewicht || ""} onChange={(v) => setProfil((a) => ({ ...a, gewicht: v }))} />
          <button
            onClick={() => setSchritt("karte")}
            disabled={!profil.laenge || !profil.hoehe || !profil.gewicht}
            style={{ width: "100%", padding: "13px", backgroundColor: profil.laenge && profil.hoehe && profil.gewicht ? "#1D9E75" : "#2a2a4a", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold", marginTop: "0.5rem" }}
          >
            Weiter zur Karte →
          </button>
        </Screen>
      );
    }

    return (
      <Screen zurueck={() => setSchritt("uebernachtung")} breadcrumb={typLabel} titel="Dein Reiseprofil" untertitel="Damit wir passende Spots finden">
        <Zeile emoji="👤" label="Typ" sub={typLabel} />
        <Zeile emoji="🌙" label="Übernachtung" sub={uebernachtungLabel} />
        <button
          onClick={() => setSchritt("karte")}
          style={{ width: "100%", padding: "13px", backgroundColor: "#1D9E75", color: "white", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold", marginTop: "0.5rem" }}
        >
          Weiter zur Karte →
        </button>
      </Screen>
    );
  }

  if (schritt === "karte") {
    return (
      <div style={{ ...containerStyle, padding: 0, justifyContent: "flex-start" }}>
        <div style={{ width: "100%", backgroundColor: "#16213e", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #2a2a4a" }}>
          <button onClick={() => setSchritt("profil")} style={{ ...zurueckStyle, padding: "6px 12px" }}>←</button>
          <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>🗺️ Vanora</span>
          <span style={{ fontSize: "0.8rem", color: "#606080", marginLeft: "auto" }}>{profil.typ} · {profil.uebernachtung}</span>
          <button onClick={() => { setSchritt("start"); setProfil({ hauptmodus: null, typ: null, uebernachtung: null }); }} style={{ ...zurueckStyle, padding: "6px 12px", fontSize: "0.75rem" }}>↺</button>
        </div>
        <div style={{ width: "100%", flex: 1, minHeight: "calc(100vh - 60px)" }}>
          <Karte profil={profil} />
        </div>
      </div>
    );
  }
}

function Screen({ titel, untertitel, breadcrumb, zurueck, children }) {
  return (
    <div style={containerStyle}>
      {zurueck && <button onClick={zurueck} style={{ ...zurueckStyle, alignSelf: "flex-start", marginBottom: "0.5rem" }}>← Zurück</button>}
      {breadcrumb && <p style={{ fontSize: "0.8rem", color: "#606080", margin: "0 0 4px" }}>{breadcrumb}</p>}
      <h2 style={{ fontSize: "1.7rem", margin: "0 0 0.3rem" }}>{titel}</h2>
      {untertitel && <p style={{ color: "#a0a0c0", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>{untertitel}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "400px" }}>
        {children}
      </div>
    </div>
  );
}

function Kachel({ emoji, titel, sub, farbe, bg, onClick }) {
  return (
    <div onClick={onClick} style={{ backgroundColor: bg, border: `1.5px solid ${farbe}`, borderRadius: "16px", padding: "1.2rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
      <div style={{ marginLeft: "1rem" }}>
        <p style={{ fontWeight: "bold", fontSize: "1.05rem", margin: "0 0 3px" }}>{titel}</p>
        <p style={{ fontSize: "0.8rem", color: "#a0a0c0", margin: 0 }}>{sub}</p>
      </div>
      <span style={{ marginLeft: "auto", fontSize: "1.3rem", color: farbe }}>›</span>
    </div>
  );
}

function Zeile({ emoji, label, sub, onClick }) {
  return (
    <div onClick={onClick} style={{ backgroundColor: "#16213e", border: "1px solid #2a2a4a", borderRadius: "12px", padding: "0.9rem 1.2rem", cursor: onClick ? "pointer" : "default", display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: "1.6rem" }}>{emoji}</span>
      <div style={{ marginLeft: "0.9rem" }}>
        <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: "500" }}>{label}</p>
        {sub && <p style={{ margin: 0, fontSize: "0.8rem", color: "#606080" }}>{sub}</p>}
      </div>
      {onClick && <span style={{ marginLeft: "auto", color: "#606080" }}>›</span>}
    </div>
  );
}

function Eingabe({ label, placeholder, wert, onChange }) {
  return (
    <div>
      <p style={{ fontSize: "0.82rem", color: "#a0a0c0", margin: "0 0 4px" }}>{label}</p>
      <input type="number" placeholder={placeholder} value={wert} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "11px 12px", boxSizing: "border-box", backgroundColor: "#0f3460", color: "white", border: "1px solid #2a2a5a", borderRadius: "10px", fontSize: "1rem", outline: "none" }}
      />
    </div>
  );
}

const containerStyle = {
  backgroundColor: "#1a1a2e", minHeight: "100vh",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  fontFamily: "Arial, sans-serif", color: "white", padding: "24px 20px",
};

const zurueckStyle = {
  padding: "8px 18px", backgroundColor: "transparent",
  color: "#606080", border: "1px solid #2a2a4a",
  borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem",
};

export default App;