import "./login.css";
import { useState } from "react";

function LoginContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(email, password);
  };

  return (
    <div className="loginContainer">
      <h1 className="loginTitle">Login</h1>

      <form onSubmit={handleLoginSubmit}>
        <div className=" loginInputContainer">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className=" loginInputContainer">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="buttonContainer">
          <button type="button" className="registerButton Button">
            Register
          </button>
          <button type="submit" className="loginButton Button">
            Login
          </button>
        </div>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginContainer;
