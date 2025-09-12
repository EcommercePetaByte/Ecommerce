import { useState } from "react";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
      setCurrentPage("home");
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      {currentPage === "home" && <Home onNavigate={setCurrentPage} />}
      {currentPage === "login" && <Login onLogin={handleLogin} onNavigate={setCurrentPage} />}
    </>
  );
}

export default App;
