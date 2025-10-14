import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

export default function LogAdmin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (username === "admin" && password === "1234") {
      setError("");
      onLogin();
      navigate("/admin");
    } else {
      setError("Credenciales incorrectas.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // centra horizontalmente
        alignItems: "center",     // centra verticalmente
        minHeight: "100vh",       // altura completa de la ventana
        width: "100vw",           // ancho completo
        margin: 0,
        padding: 0,
        background: "var(--surface)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "var(--surface)",
          padding: "32px 24px",
          borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,.08)",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h2 style={{ marginBottom: "8px", textAlign: "center" }}>
          Acceso Administrador
        </h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
          }}
        />
        {error && (
          <div
            style={{
              color: "#d32f2f",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          style={{
            background: "var(--brand)",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
