import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { AuthContext } from "../context/AuthContext";
//import banner from '../assets/images/landing/LandingPage_1.jpg'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login({ email, password });
      login(res);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{
        //backgroundImage: `url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="card shadow-lg p-4" style={{ width: "380px"}}>
        <h4 className="text-center mb-4">Login</h4>

        <form onSubmit={submit} >
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>

      </div>
    </div>
  );
}
