import { useState } from "react";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (username, password) => {
    // 👉 Aquí puedes poner validaciones reales, por ahora ejemplo:
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
          <Home />
      )}
    </>
  );
}

export default App;
