import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Logo from "../../components/Logo/Logo";
import BotonGoogle from "../../components/BotonGoogle/BotonGoogle.jsx";

import "./Login.css";

const Login = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      // Registro
      onRegister(username, email, password); 
      navigate("/"); 
    } else {
      // Login con email y contraseña
      const success = onLogin(email, password); 
      if (success) {
        navigate("/"); 
      } else {
        alert("Correo o contraseña incorrectos");
      }
    }
  };

  // Función para iniciar sesión / registrarse con Google
  const handleGoogleLogin = () => {
    // Aquí podrías integrar Firebase o Google OAuth
    alert("Función de inicio con Google aún no implementada");
  };

  return (
    <AuthLayout>
      <div className="login-header">
        <Logo />
      </div>

      <h2 className="login-title">
        {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
      </h2>

      <form className="login-form" onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>

        {!isRegister && (
          <p className="forgot-text">
            <button
              type="button"
              className="btn-forgot"
              onClick={() => navigate("/recuperar")}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <button type="submit" className="btn-login">
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
      </form>

      <p className="register-text">
        {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
        <button
          type="button"
          className="btn-register"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Inicia sesión aquí" : "Crea una aquí"}
        </button>
      </p>

      <div className="google-login-wrapper">
        <BotonGoogle
          onClick={handleGoogleLogin}
          texto={isRegister ? "Registrarse con Google" : "Iniciar sesión con Google"}
        />
      </div>
    </AuthLayout>
  );
};

export default Login;
