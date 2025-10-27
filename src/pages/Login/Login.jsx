import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import AuthLayout from "../../layouts/AuthLayout.jsx";
// @ts-ignore
import Logo from "../../components/Logo/Logo";
import { Eye, EyeOff, LogIn } from "lucide-react";
// @ts-ignore
import api from "../../api.js"; // <-- Usamos tu instancia configurada con baseURL y token
// @ts-ignore
import "./Login.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Usamos una variable para el Client ID para evitar errores de 'import.meta'
const VITE_GOOGLE_CLIENT_ID = (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GOOGLE_CLIENT_ID : undefined) || null;


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
    const clientId = VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID no está configurado en .env");
      return;
    }

    window.google?.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        const payload = decodeJwt(response.credential);
        if (!payload?.email) return;

        try {
          const res = await api.post("/auth/google", {
            email: payload.email,
            username: payload.name || payload.email.split("@")[0],
          });

          const jwt = res.data?.token;
          const roles = res.data?.roles; // <-- MODIFICACIÓN: Extraer roles
          if (!jwt) throw new Error("No se recibió token del backend");

          localStorage.setItem("jwtToken", jwt);
          if (roles) { // <-- MODIFICACIÓN: Si existen roles
            localStorage.setItem("userRoles", JSON.stringify(roles)); // <-- MODIFICACIÓN: Guardarlos
          }
          localStorage.setItem("remember_user", payload.email);
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(true);
          navigate("/");
        } catch (err) {
          // --- MODIFICACIÓN GOOGLE ---
          console.error("Error login Google:", err);
          if (err.response) {
            // Error del backend al procesar el token de Google
            if (typeof err.response.data === 'string' && err.response.data.length < 100) {
              setError(err.response.data);
            } else {
              setError("Error del servidor al procesar el login con Google.");
            }
          } else if (err.request) {
            setError("No se pudo conectar con el servidor. Revisa tu conexión.");
          } else {
            setError("Ocurrió un error inesperado con Google.");
          }
          // --- FIN MODIFICACIÓN ---
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

      let res;
      if (isRegister) {
        res = await api.post("/auth/register", { username, email, password });
      } else {
        res = await api.post("/auth/login", { username, password });
      }

      const jwt = res.data?.token;
      const roles = res.data?.roles; // <-- MODIFICACIÓN: Extraer roles
      
      // Si la petición fue exitosa (2xx) y vino un token...
      if (jwt) {
        localStorage.setItem("jwtToken", jwt);
        if (roles) { // <-- MODIFICACIÓN: Si existen roles
          localStorage.setItem("userRoles", JSON.stringify(roles)); // <-- MODIFICACIÓN: Guardarlos
        }
        localStorage.setItem("isAuthenticated", "true");
        setIsAuthenticated(true);

        // Opcional: configuramos api para que use el token automáticamente
        // @ts-ignore
        api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

        navigate("/");
      } else {
         // Esto es por si el backend responde 200 pero sin token (no debería pasar)
         setError(isRegister ? "Error al registrarse." : "No se recibió respuesta del servidor.");
      }
    } catch (err) {
      // --- MODIFICACIÓN PRINCIPAL ---
      console.error("Error en handleSubmit:", err);

      if (err.response) {
        // El servidor respondió con un código de error (4xx, 5xx)
        if (err.response.status === 401) {
          setError("Usuario o contraseña incorrectos.");
        } else if (err.response.status === 400) {
          // El backend de registro envía un string como 'data' con el error
          if (typeof err.response.data === 'string' && err.response.data.length < 100) {
            setError(err.response.data); // Ej: "El email ya está en uso"
          } else {
            setError("Datos incorrectos. Revisa el formulario.");
          }
        } else {
          // Otros errores del servidor (500, 503, etc.)
          setError("Error del servidor. Inténtalo más tarde.");
        }
      } else if (err.request) {
        // La petición se hizo pero no se recibió respuesta (servidor caído, CORS)
        setError("No se pudo conectar con el servidor. Revisa tu conexión.");
      } else {
        // Error al configurar la petición (error de código antes de enviar)
        setError("Ocurrió un error inesperado.");
      }
      // --- FIN MODIFICACIÓN ---
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
              {VITE_GOOGLE_CLIENT_ID ? (
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

