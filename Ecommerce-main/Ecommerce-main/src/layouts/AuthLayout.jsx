import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
}
