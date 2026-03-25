import { useState } from "react";
import { supabase } from "./supabase";

function Login({ onLogin }) {
  const [modus, setModus] = useState("login"); // "login" oder "registrieren"
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [name, setName] = useState("");
  const [fehler, setFehler] = useState("");
  const [erfolg, setErfolg] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function handleLogin() {
    setLaedt(true);
    setFehler("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: passwort,
    });
    if (error) {
      setFehler("Email oder Passwort falsch.");
      setLaedt(false);
      return;
    }
    onLogin(data.user);
    setLaedt(false);
  }

  async function handleRegistrieren() {
    setLaedt(true);
    setFehler("");
    setErfolg("");

    if (!name || !email || !passwort) {
      setFehler("Bitte alle Felder ausfüllen.");
      setLaedt(false);
      return;
    }
    if (passwort.length < 6) {
      setFehler("Passwort muss mindestens 6 Zeichen haben.");
      setLaedt(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: passwort,
      options: { data: { name: name } }
    });

    if (error) {
      setFehler("Registrierung fehlgeschlagen: " + error.message);
      setLaedt(false);
      return;
    }

    setErfolg("✅ Registrierung erfolgreich! Du kannst dich jetzt anmelden.");
    setModus("login");
    setPasswort("");
    setLaedt(false);
  }

  return (
    <div style={{
      backgroundColor: "#1a1a2e", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "Arial, sans-serif", color: "white", padding: "20px"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.3rem" }}>🌍 Vanora</h1>
      <p style={{ color: "#a0a0c0", marginBottom: "2.5rem" }}>
        Finde deinen perfekten Schlafplatz
      </p>

      <div style={{
        backgroundColor: "#16213e", borderRadius: "16px",
        padding: "2rem", width: "100%", maxWidth: "380px"
      }}>
        {/* Tab-Auswahl */}
        <div style={{ display: "flex", marginBottom: "1.5rem", borderRadius: "10px", overflow: "hidden", border: "1px solid #2a2a4a" }}>
          <button
            onClick={() => { setModus("login"); setFehler(""); setErfolg(""); }}
            style={{
              flex: 1, padding: "10px",
              backgroundColor: modus === "login" ? "#1D9E75" : "transparent",
              color: "white", border: "none", cursor: "pointer", fontSize: "0.9rem"
            }}
          >
            Anmelden
          </button>
          <button
            onClick={() => { setModus("registrieren"); setFehler(""); setErfolg(""); }}
            style={{
              flex: 1, padding: "10px",
              backgroundColor: modus === "registrieren" ? "#1D9E75" : "transparent",
              color: "white", border: "none", cursor: "pointer", fontSize: "0.9rem"
            }}
          >
            Registrieren
          </button>
        </div>

        {/* Name (nur bei Registrierung) */}
        {modus === "registrieren" && (
          <>
            <label style={{ fontSize: "0.85rem", color: "#a0a0c0" }}>Name</label>
            <input
              type="text"
              placeholder="Dein Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </>
        )}

        {/* Email */}
        <label style={{ fontSize: "0.85rem", color: "#a0a0c0" }}>Email</label>
        <input
          type="email"
          placeholder="deine@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* Passwort */}
        <label style={{ fontSize: "0.85rem", color: "#a0a0c0" }}>Passwort</label>
        <input
          type="password"
          placeholder="••••••••"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (modus === "login" ? handleLogin() : handleRegistrieren())}
          style={{ ...inputStyle, marginBottom: "1.5rem" }}
        />

        {/* Fehler & Erfolg */}
        {fehler && (
          <p style={{ color: "#ff6b6b", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
            ⚠️ {fehler}
          </p>
        )}
        {erfolg && (
          <p style={{ color: "#1D9E75", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
            {erfolg}
          </p>
        )}

        {/* Button */}
        <button
          onClick={modus === "login" ? handleLogin : handleRegistrieren}
          disabled={laedt || !email || !passwort}
          style={{
            width: "100%", padding: "13px",
            backgroundColor: email && passwort ? "#1D9E75" : "#2a2a4a",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "1rem", cursor: "pointer", fontWeight: "bold"
          }}
        >
          {laedt ? "Bitte warten..." : modus === "login" ? "Anmelden →" : "Konto erstellen →"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block", width: "100%", padding: "11px 12px",
  boxSizing: "border-box", marginBottom: "1rem", marginTop: "4px",
  backgroundColor: "#0f3460", color: "white",
  border: "1px solid #2a2a5a", borderRadius: "10px",
  fontSize: "1rem", outline: "none"
};

export default Login;