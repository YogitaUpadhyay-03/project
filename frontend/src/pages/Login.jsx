import { useState } from "react";
import "./Login.css";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert("Login failed");
    }

  };

  return (

    <div className="login-page">

      {/* animated gradient balls */}
      <div className="glow-ball ball1"></div>
      <div className="glow-ball ball2"></div>
      <div className="glow-ball ball3"></div>

      <div className="login-card">

        <h2 className="title">Realtime Editor</h2>
        <p className="subtitle">Login to continue</p>

        <input
          className="input-field"
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">

          <input
            className="input-field"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          >

            {showPassword ?

              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 6c-5 0-9.27 3.11-11 6 1.73 2.89 6 6 11 6s9.27-3.11 11-6c-1.73-2.89-6-6-11-6zm0 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
              </svg>

            :

              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 10.5c1.73 2.89 6 6 11 6s9.27-3.11 11-6c-1.73-2.89-6-6-11-6zm0 9.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
              </svg>

            }

          </span>

        </div>

        <button className="login-btn" onClick={login}>
          Login
        </button>

      </div>

    </div>

  );

};

export default Login;