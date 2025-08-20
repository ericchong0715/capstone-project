import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row justify-content-center mt-5">
      <div className="card col-md-6 col-lg-4">
          <div className="card-body">
            <h4 className="mb-3">Register</h4>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button className="btn btn-primary w-100" disabled={busy}>
                {busy ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>
      </div>
    </div>
    </div>
  );
}
