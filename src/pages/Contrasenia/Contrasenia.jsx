import { useState } from "react";
import "./Contrasenia.css";

const Contrasenia = () => {
  const [step, setStep] = useState(1); // 1 = pedir email, 2 = pedir código y nueva contraseña
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");

  const handleEnviarCodigo = (e) => {
    e.preventDefault();
    // acá iría la llamada al backend para mandar el código al email
    console.log("Enviar código a:", email);
    setStep(2);
  };

  const handleCambiarPassword = (e) => {
    e.preventDefault();
    if (nuevaPass !== confirmarPass) {
      alert("Las contraseñas no coinciden");
      return;
    }
    // acá iría la llamada al backend para validar el código y cambiar la contraseña
    console.log("Código:", codigo, "Nueva contraseña:", nuevaPass);
    alert("Tu contraseña fue cambiada con éxito");
  };

  return (
    <div className="recuperar-container">
      {step === 1 && (
        <form className="formulario" onSubmit={handleEnviarCodigo}>
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo electrónico y te enviaremos un código.</p>
          <input
            type="email"
            placeholder="Tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar código</button>
        </form>
      )}

      {step === 2 && (
        <form className="formulario" onSubmit={handleCambiarPassword}>
          <h2>Verificar Código</h2>
          <p>Revisa tu correo y escribe el código que recibiste.</p>
          <input
            type="text"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPass}
            onChange={(e) => setNuevaPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarPass}
            onChange={(e) => setConfirmarPass(e.target.value)}
            required
          />
          <button type="submit">Cambiar contraseña</button>
        </form>
      )}
    </div>
  );
};

export default Contrasenia;
