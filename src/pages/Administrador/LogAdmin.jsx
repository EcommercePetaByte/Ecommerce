import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"; // tu instancia de axios con token configurado
import "./admin.css";

export default function LogAdmin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // POST al backend
      const res = await api.post("/auth/login", { username, password });
      const data = res.data;

      if (data?.token) {
        // Guardamos el token
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("isAuthenticated", "true");

        // Verificamos rol de admin
        if (data.roles?.includes("ADMIN")) {
          onLogin();
          navigate("/admin");
        } else {
          setError("No tenés permisos de administrador.");
        }
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error login admin:", err);
      setError("Ocurrió un error al conectarse al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
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
          disabled={loading}
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
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
