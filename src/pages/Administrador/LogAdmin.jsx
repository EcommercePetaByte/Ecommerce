import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "./admin.css";

export default function LogAdmin() {
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
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });
      const data = res.data;

      if (data?.token && data.roles?.includes("ROLE_ADMIN")) {
        localStorage.setItem("jwtToken", data.token);
        navigate("/admin");
      } else if (data?.token) {
        setError("No tenés permisos de administrador.");
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error en el login:", err);
      setError("Usuario o contraseña incorrectos o error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--surface)" }}>
      <form onSubmit={handleSubmit} style={{ background: "var(--surface)", padding: "32px 24px", borderRadius: "16px", minWidth: "320px", display: "flex", flexDirection: "column", gap: "18px" }}>
        <h2 style={{ textAlign: "center" }}>Acceso Administrador</h2>
        <input type="text" placeholder="Usuario o Email" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border)" }} />
        {error && <div style={{ color: "#d32f2f", fontWeight: "bold", textAlign: "center" }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ background: "var(--brand)", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}