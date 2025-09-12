import { useState } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "¡Hola! Soy tu asistente. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState("");

  const predefinedOptions = [
    "Ver productos",
    "Estado de mi pedido",
    "Ayuda con cuenta"
  ];

  const sendMessage = (text) => {
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    // Simulación de respuesta automática
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: `Has seleccionado: "${text}"` }]);
    }, 500);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Asistente</div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message ${msg.from === "bot" ? "bot" : "user"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-options">
        {predefinedOptions.map((opt, i) => (
          <button key={i} className="option-btn" onClick={() => sendMessage(opt)}>
            {opt}
          </button>
        ))}
      </div>

      <form
        className="chatbot-input"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
