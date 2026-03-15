import { useState } from "react";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert("Login failed");
    }

  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

    </div>
  );
};

export default Login;