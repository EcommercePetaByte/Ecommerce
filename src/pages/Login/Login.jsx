import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import Logo from "../../components/Logo/Logo";

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
      navigate("/"); // redirige al home tras registrarse
    } else {
      // Login
      const success = onLogin(username, password); // 👈 debe devolver true/false
      if (success) {
        navigate("/"); // solo redirige si login correcto
      } else {
        alert("Usuario o contraseña incorrectos"); // alerta si falla
      }
    }
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

        {isRegister && (
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
        )}

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
    </AuthLayout>
  );
};

export default Login;