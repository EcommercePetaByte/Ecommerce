import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Logo from "../../components/Logo/Logo";
import { Eye, EyeOff, LogIn } from "lucide-react";
import "./Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🔹 Decodifica el JWT de Google
function decodeJwt(jwt) {
  try {
    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const Login = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState(() => localStorage.getItem("remember_user") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(!!localStorage.getItem("remember_user"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // GOOGLE
  const googleDivRef = useRef(null);
  const [gisReady, setGisReady] = useState(false);

  // 🔹 Cargar SDK de Google
  useEffect(() => {
    const scriptId = "google-identity-services";
    if (document.getElementById(scriptId)) {
      setGisReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.id = scriptId;
    s.onload = () => setGisReady(true);
    s.onerror = () => setGisReady(false);
    document.head.appendChild(s);
  }, []);

  // 🔹 Inicializar Google Sign-In
  useEffect(() => {
    if (!gisReady || !googleDivRef.current) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        const payload = decodeJwt(response.credential);
        if (!payload?.email) return;
        localStorage.setItem("remember_user", payload.email);
        localStorage.setItem("isAuthenticated", "true");
        onRegister?.(payload.name || payload.email, payload.email, "oauth_google");
        navigate("/");
      },
      ux_mode: "popup",
    });

    window.google?.accounts.id.renderButton(googleDivRef.current, {
      theme: document.documentElement.dataset.theme === "light" ? "outline" : "filled_black",
      size: "large",
      shape: "pill",
      text: "continue_with",
      logo_alignment: "left",
      width: "100",
    });
  }, [gisReady, navigate, onRegister]);

  // 🔹 Limpia errores si cambia input
  useEffect(() => {
    if (error) setError("");
  }, [username, email, password, isRegister]);

  const validate = () => {
    if (!username.trim()) return "Ingresá tu usuario.";
    if (isRegister) {
      if (!EMAIL_RE.test(email)) return "Ingresá un correo válido.";
      if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    } else {
      if (!password) return "Ingresá tu contraseña.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      if (remember) localStorage.setItem("remember_user", username);
      else localStorage.removeItem("remember_user");

      if (isRegister) {
        onRegister?.(username, email, password);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
      } else {
        const ok = onLogin?.(username, password);
        if (ok) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("remember_user", username);
          navigate("/");
        } else {
          setError("Usuario o contraseña incorrectos.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fallback: botón custom si no hay client ID
  const handleGoogleFallback = () => {
    const alias = "usuario.google@example.com";
    localStorage.setItem("remember_user", alias);
    localStorage.setItem("isAuthenticated", "true");
    onRegister?.("Usuario Google", alias, "oauth_google");
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="login-card">
        <div className="login-header"><Logo /></div>
        <h2 className="login-title">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {error && <div className="alert">{error}</div>}

        {/* ------- OAuth Google ------- */}
        <div className="oauth-block">
          <div className="oauth-grid">
            <div className="oauth-provider">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div ref={googleDivRef} className="google-btn-portal" />
              ) : (
                <button className="oauth-fallback" onClick={handleGoogleFallback}>
                  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.4l6.8-6.8C35.8 2.2 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.2l7.9 6.1C12.6 13.5 17.8 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8.1h12.7c-.6 3.4-2.7 6.3-5.8 8.2l9 7c5.3-4.9 6.6-12.1 6.6-19.2z"/>
                    <path fill="#FBBC05" d="M10.4 28.3c-1-3-1-6.2 0-9.2l-7.9-6.1C.9 16.6 0 20.2 0 24c0 3.7.9 7.4 2.6 10.9l7.8-6.6z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-9-7c-2.5 1.6-5.9 2.6-7 2.6-6.2 0-11.4-4-13.6-9.7l-7.9 6.1C6.4 42.6 14.6 48 24 48z"/>
                  </svg>
                  Continuar con Google
                </button>
              )}
            </div>
          </div>
          <div className="oauth-divider"><span>o</span></div>
        </div>

        {/* ------- Form tradicional ------- */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="pass-wrap">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder={isRegister ? "Mínimo 6 caracteres" : "Tu contraseña"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="icon-ghost"
                aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isRegister && (
            <div className="row-between">
              <label className="check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                className="link-ghost"
                onClick={() => alert("Funcionalidad en construcción")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button type="submit" className="categorias-btn cta" disabled={loading}>
            {loading ? (isRegister ? "Creando…" : "Ingresando…") : (isRegister ? "Registrarse" : "Ingresar")}
          </button>
        </form>

        <p className="alt">
          {isRegister ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <button
            type="button"
            className="link-ghost"
            onClick={() => setIsRegister((v) => !v)}
          >
            {isRegister ? "Iniciá sesión" : "Creá una aquí"}
          </button>
        </p>

        <div className="foot-hint">
          <LogIn size={14} />
          <span>También podés iniciar sesión con Google. Configurá tu Client ID en <code>.env</code>.</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
