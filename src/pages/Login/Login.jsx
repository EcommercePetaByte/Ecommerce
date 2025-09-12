import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout/AuthLayout";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 👉 llamamos a la función que viene de App.jsx
    onLogin(username, password);
  };

  return (
    <AuthLayout>
      <h2 className="login-title">Iniciar Sesión</h2>
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

        <button type="submit" className="btn-login">Ingresar</button>
      </form>

      <p className="register-text">
        ¿No tienes cuenta?{" "}
        <button className="btn-register">Crea una aquí</button>
      </p>
    </AuthLayout>
  );
};

export default Login;
