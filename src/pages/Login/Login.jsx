import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import "./Login.css";

const Login = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 👈 nuevo estado para email
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      onRegister(username, email, password); // 👉 registro con email
    } else {
      onLogin(username, password);
    }
  };

  return (
    <AuthLayout>
      <h2 className="login-title">
        {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
      </h2>

      <form className="login-form" onSubmit={handleSubmit}>
        {/* Usuario */}
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

        {/* 👇 Campo extra solo cuando está en modo registro */}
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

        {/* Contraseña */}
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
