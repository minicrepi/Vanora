import { useState, useEffect } from "react";
import { supabase } from "./supabase";

function Fahrzeuge({ user, onAuswaehlen }) {
  const [fahrzeuge, setFahrzeuge] = useState([]);
  const [ansicht, setAnsicht] = useState("liste"); // "liste" oder "neu"
  const [name, setName] = useState("");
  const [typ, setTyp] = useState("");
  const [laenge, setLaenge] = useState("");
  const [hoehe, setHoehe] = useState("");
  const [gewicht, setGewicht] = useState("");
  const [laedt, setLaedt] = useState(true);

  useEffect(() => {
    ladeFahrzeuge();
  }, []);

  async function ladeFahrzeuge() {
    setLaedt(true);
    const { data, error } = await supabase
      .from("fahrzeuge")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setFahrzeuge(data || []);
    setLaedt(false);
  }

  async function speichernFahrzeug() {
    if (!name || !typ || !laenge || !hoehe) return;

    const { error } = await supabase.from("fahrzeuge").insert({
      user_id: user.id,
      name: name,
      typ: typ,
      laenge: parseFloat(laenge),
      hoehe: parseFloat(hoehe),
      gewicht: parseFloat(gewicht) || null,
    });

    if (!error) {
      setName(""); setTyp(""); setLaenge("");
      setHoehe(""); setGewicht("");
      setAnsicht("liste");
      ladeFahrzeuge();
    }
  }

  async function loeschenFahrzeug(id) {
    await supabase.from("fahrzeuge").delete().eq("id", id);
    ladeFahrzeuge();
  }

  if (laedt) {
    return (
      <div style={containerStyle}>
        <p style={{ color: "#a0a0c0" }}>Fahrzeuge werden geladen...</p>
      </div>
    );
  }

  // Neues Fahrzeug Formular
  if (ansicht === "neu") {
    return (
      <div style={containerStyle}>
        <button onClick={() => setAnsicht("liste")} style={zurueckStyle}>← Zurück</button>
        <h2 style={{ fontSize: "1.5rem", margin: "0.5rem 0 1.5rem" }}>Fahrzeug hinzufügen</h2>

        <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Eingabe label="Name (z.B. VW T5)" placeholder="Mein Camper" wert={name} onChange={setName} typ="text" />

          <div>
            <p style={{ fontSize: "0.82rem", color: "#a0a0c0", margin: "0 0 4px" }}>Fahrzeugtyp</p>
            <select
              value={typ}
              onChange={(e) => setTyp(e.target.value)}
              style={{ width: "100%", padding: "11px 12px", boxSizing: "border-box", backgroundColor: "#0f3460", color: "white", border: "1px solid #2a2a5a", borderRadius: "10px", fontSize: "1rem" }}
            >
              <option value="">Bitte wählen...</option>
              <option value="wohnmobil">Wohnmobil / Campervan</option>
              <option value="kastenwagen">Kastenwagen / Transporter</option>
              <option value="auto_dachzelt">Auto mit Dachzelt</option>
            </select>
          </div>

          <Eingabe label="Länge (in Meter)" placeholder="z.B. 6.5" wert={laenge} onChange={setLaenge} />
          <Eingabe label="Höhe (in Meter)" placeholder="z.B. 2.8" wert={hoehe} onChange={setHoehe} />
          <Eingabe label="Gewicht (in kg)" placeholder="z.B. 3500" wert={gewicht} onChange={setGewicht} />

          <button
            onClick={speichernFahrzeug}
            disabled={!name || !typ || !laenge || !hoehe}
            style={{
              width: "100%", padding: "13px",
              backgroundColor: name && typ && laenge && hoehe ? "#1D9E75" : "#2a2a4a",
              color: "white", border: "none", borderRadius: "10px",
              fontSize: "1rem", cursor: "pointer", fontWeight: "bold", marginTop: "0.5rem"
            }}
          >
            Fahrzeug speichern →
          </button>
        </div>
      </div>
    );
  }

  // Fahrzeugliste
  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>🚐 Meine Fahrzeuge</h2>
      <p style={{ color: "#a0a0c0", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
        Wähle dein heutiges Fahrzeug
      </p>

      <div style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {fahrzeuge.length === 0 && (
          <p style={{ color: "#606080", textAlign: "center", fontSize: "0.9rem" }}>
            Noch keine Fahrzeuge gespeichert.
          </p>
        )}

        {fahrzeuge.map((f) => (
          <div key={f.id} style={{
            backgroundColor: "#16213e", border: "1px solid #2a2a4a",
            borderRadius: "12px", padding: "1rem 1.2rem",
            display: "flex", alignItems: "center", gap: "12px"
          }}>
            <span style={{ fontSize: "1.8rem" }}>
              {f.typ === "wohnmobil" ? "🚐" : f.typ === "kastenwagen" ? "🚚" : "🚗"}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "500", fontSize: "0.95rem" }}>{f.name}</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#606080" }}>
                {f.laenge}m · {f.hoehe}m Höhe {f.gewicht ? `· ${f.gewicht}kg` : ""}
              </p>
            </div>
            <button
              onClick={() => onAuswaehlen(f)}
              style={{
                padding: "7px 14px", backgroundColor: "#1D9E75",
                color: "white", border: "none", borderRadius: "8px",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: "bold"
              }}
            >
              Wählen
            </button>
            <button
              onClick={() => loeschenFahrzeug(f.id)}
              style={{
                padding: "7px 10px", backgroundColor: "transparent",
                color: "#ff6b6b", border: "1px solid #ff6b6b",
                borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem"
              }}
            >
              🗑️
            </button>
          </div>
        ))}

        <button
          onClick={() => setAnsicht("neu")}
          style={{
            width: "100%", padding: "13px", backgroundColor: "transparent",
            color: "#1D9E75", border: "1.5px solid #1D9E75",
            borderRadius: "10px", fontSize: "1rem", cursor: "pointer",
            fontWeight: "bold", marginTop: "0.5rem"
          }}
        >
          + Fahrzeug hinzufügen
        </button>
      </div>
    </div>
  );
}

function Eingabe({ label, placeholder, wert, onChange, typ = "number" }) {
  return (
    <div>
      <p style={{ fontSize: "0.82rem", color: "#a0a0c0", margin: "0 0 4px" }}>{label}</p>
      <input
        type={typ}
        placeholder={placeholder}
        value={wert}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 12px", boxSizing: "border-box",
          backgroundColor: "#0f3460", color: "white",
          border: "1px solid #2a2a5a", borderRadius: "10px",
          fontSize: "1rem", outline: "none"
        }}
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
  alignSelf: "flex-start", marginBottom: "0.5rem"
};

export default Fahrzeuge;