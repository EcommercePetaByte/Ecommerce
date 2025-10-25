import { useEffect, useRef, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Logo from "../../components/Logo/Logo";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import "./Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const Login = ({ setIsAuthenticated }) => {
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

  useEffect(() => {
    if (!gisReady || !googleDivRef.current) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        const payload = decodeJwt(response.credential);
        if (!payload?.email) return;

        try {
          const res = await axios.post("http://localhost:8080/api/auth/google", {
            email: payload.email,
            username: payload.name || payload.email.split("@")[0],
          });

          const jwt = res.data?.token;
          if (!jwt) throw new Error("No se recibió token del backend");

          localStorage.setItem("jwtToken", jwt);
          localStorage.setItem("remember_user", payload.email);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          navigate("/");
        } catch (err) {
          console.error("Error login Google:", err);
          setError("Error al iniciar sesión con Google");
        }
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
  }, [gisReady, navigate, setIsAuthenticated]);

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
        const res = await axios.post("http://localhost:8080/api/auth/register", {
          username,
          email,
          password,
        });
        const jwt = res.data?.token;
        if (jwt) {
          localStorage.setItem("jwtToken", jwt);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          navigate("/");
        }
      } else {
        const res = await axios.post("http://localhost:8080/api/auth/login", {
          username,
          password,
        });
        const jwt = res.data?.token;
        if (jwt) {
          localStorage.setItem("jwtToken", jwt);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          navigate("/");
        } else {
          setError("Usuario o contraseña incorrectos.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al conectarse al servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="login-card">
        <div className="login-header"><Logo /></div>
        <h2 className="login-title">{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {error && <div className="alert">{error}</div>}

        <div className="oauth-block">
          <div className="oauth-grid">
            <div className="oauth-provider">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <div ref={googleDivRef} className="google-btn-portal" />
              ) : (
                <button className="oauth-fallback">
                  Continuar con Google
                </button>
              )}
            </div>
          </div>
          <div className="oauth-divider"><span>o</span></div>
        </div>

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
