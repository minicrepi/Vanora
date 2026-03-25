import { useState, useEffect } from "react";
import Karte from "./Karte";
import Login from "./Login";
import Fahrzeuge from "./Fahrzeuge";
import { supabase } from "./supabase";

function App() {
  const [schritt, setSchritt] = useState("start");
  const [profil, setProfil] = useState({
    hauptmodus: null,
    typ: null,
    uebernachtung: null,
  });
  const [user, setUser] = useState(null);
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLaedt(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setSchritt("start");
    setProfil({ hauptmodus: null, typ: null, uebernachtung: null });
  }

  function weiter(feld, wert, naechsterSchritt) {
    setProfil((alt) => ({ ...alt, [feld]: wert }));
    setSchritt(naechsterSchritt);
  }

  if (laedt) {
    return (
      <div style={{ backgroundColor: "#1a1a2e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Arial, sans-serif" }}>
        <p>🌍 Vanora lädt...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  // FAHRZEUG-AUSWAHL aus Datenbank
  if (schritt === "fahrzeuge") {
    return (
      <Fahrzeuge
        user={user}
        onAuswaehlen={(fahrzeug) => {
          setProfil((alt) => ({
            ...alt,
            typ: fahrzeug.typ,
            laenge: String(fahrzeug.laenge),
            hoehe: String(fahrzeug.hoehe),
            gewicht: String(fahrzeug.gewicht || ""),
          }));
          setSchritt("uebernachtung");
        }}
      />
    );
  }

  if (schritt === "start") {
    return (
      <Screen titel="🌍 Vanora" untertitel="Finde deinen perfekten Schlafplatz">
        <Kachel emoji="🚐" titel="Mit Fahrzeug" sub="Wohnmobil · Kastenwagen · Auto mit Dachzelt" farbe="#1D9E75" bg="#0a2a1e"
          onClick={() => weiter("hauptmodus", "fahrzeug", "fahrzeuge")} />
        <Kachel emoji="🎒" titel="Ohne Fahrzeug" sub="Wanderer · Backpacker · Zelt & Biwak" farbe="#5B8CDB" bg="#0a1a2e"
          onClick={() => weiter("hauptmodus", "ohnefahrzeug", "typ")} />
        <button onClick={handleLogout} style={{ ...zurueckStyle, color: "#ff6b6b", borderColor: "#ff6b6b", width: "100%", maxWidth: "400px" }}>
          Logout
        </button>
      </Screen>
    );
  }

  if (schritt === "typ") {
    const optionen = [
      { id: "wanderer",   emoji: "🥾", label: "Wanderer / Trekking" },
      { id: "backpacker", emoji: "🎒", label: "Backpacker" },
      { id: "zelt",       emoji: "⛺", label: "Zelt & Biwak" },
    ];
    return (
      <Screen zurueck={() => setSchritt("start")} breadcrumb="Ohne Fahrzeug" titel="Wie bist du unterwegs?">
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
    const zurueckSchritt = profil.hauptmodus === "fahrzeug" ? "fahrzeuge" : "typ";
    return (
      <Screen zurueck={() => setSchritt(zurueckSchritt)} titel="Was suchst du?" untertitel="Wähle deinen Übernachtungsstil">
        {optionen.map((o) => (
          <Zeile key={o.id} emoji={o.emoji} label={o.label} sub={o.sub} onClick={() => weiter("uebernachtung", o.id, "karte")} />
        ))}
      </Screen>
    );
  }

  if (schritt === "karte") {
    return (
      <div style={{ ...containerStyle, padding: 0, justifyContent: "flex-start" }}>
        <div style={{ width: "100%", backgroundColor: "#16213e", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #2a2a4a" }}>
          <button onClick={() => setSchritt("uebernachtung")} style={{ ...zurueckStyle, padding: "6px 12px" }}>←</button>
          <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>🗺️ Vanora</span>
          <span style={{ fontSize: "0.8rem", color: "#606080", marginLeft: "auto" }}>
            {user.email.split("@")[0]}
          </span>
          <button onClick={handleLogout} style={{ ...zurueckStyle, padding: "6px 12px", fontSize: "0.75rem", color: "#ff6b6b", borderColor: "#ff6b6b" }}>
            Logout
          </button>
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