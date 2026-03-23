import { useState } from "react";
import { supabase } from "./supabase";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
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
        <h2 style={{ fontSize: "1.2rem", color: "#1D9E75", marginBottom: "1.5rem" }}>
          Anmelden
        </h2>

        <label style={{ fontSize: "0.85rem", color: "#a0a0c0" }}>Email</label>
        <input
          type="email"
          placeholder="deine@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block", width: "100%", padding: "11px 12px",
            boxSizing: "border-box", marginBottom: "1rem", marginTop: "4px",
            backgroundColor: "#0f3460", color: "white",
            border: "1px solid #2a2a5a", borderRadius: "10px",
            fontSize: "1rem", outline: "none"
          }}
        />

        <label style={{ fontSize: "0.85rem", color: "#a0a0c0" }}>Passwort</label>
        <input
          type="password"
          placeholder="••••••••"
          value={passwort}
          onChange={(e) => setPasswort(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            display: "block", width: "100%", padding: "11px 12px",
            boxSizing: "border-box", marginBottom: "1.5rem", marginTop: "4px",
            backgroundColor: "#0f3460", color: "white",
            border: "1px solid #2a2a5a", borderRadius: "10px",
            fontSize: "1rem", outline: "none"
          }}
        />

        {fehler && (
          <p style={{
            color: "#ff6b6b", fontSize: "0.85rem",
            marginBottom: "1rem", textAlign: "center"
          }}>
            ⚠️ {fehler}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={laedt || !email || !passwort}
          style={{
            width: "100%", padding: "13px",
            backgroundColor: email && passwort ? "#1D9E75" : "#2a2a4a",
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "1rem", cursor: "pointer", fontWeight: "bold"
          }}
        >
          {laedt ? "Wird angemeldet..." : "Anmelden →"}
        </button>
      </div>
    </div>
  );
}

export default Login;