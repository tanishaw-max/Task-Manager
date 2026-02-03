import { useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";
import "./LoginPage.css";

const LoginPage = () => {
  const authContext = useAuth();
  const { login, error: authError, clearError } = authContext || {};
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (authError && clearError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (clearError) clearError();
    setLoading(true);
    
    try {
      if (!form.email || !form.password) {
        throw new Error('Please fill in all fields');
      }
      
      const res = await api.login(form);
      
      if (!res.data || !res.data.user || !res.data.token) {
        throw new Error('Invalid response from server');
      }
      
      if (login) {
        login(res.data.user, res.data.token);
        navigate("/");
      } else {
        throw new Error('Authentication system not available');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title" aria-label="Task Manager">
            <span className="brand-icon" aria-hidden="true" />
            <span className="brand-text">Task Manager</span>
          </h1>
          <p>Streamline your workflow with intelligent task management.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="login-hint">
          New here?{" "}
          <Link to="/register" className="link-text">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

