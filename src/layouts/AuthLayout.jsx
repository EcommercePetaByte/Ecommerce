import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-box">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;