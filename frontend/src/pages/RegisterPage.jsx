import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/useAuth";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.register(form);
      setSuccess("Registration successful! Logging you in...");
      if (res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        setTimeout(() => navigate("/"), 1000);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-[1.5rem] bg-[#f3f4f6]">
      <div
        className="w-full max-w-[480px] p-[2rem] rounded-[1.25rem] bg-white text-[#111827]
          shadow-[0_10px_30px_rgba(15,23,42,0.12)] border border-[#e5e7eb]
          max-[480px]:p-[1.5rem]"
      >
        {/* Header */}
        <div>
          <h1 className="inline-flex items-center gap-[0.6rem] whitespace-nowrap">
            <span
              className="inline-block w-[40px] h-[40px] rounded-[14px] bg-[#2563eb]
                shadow-[0_10px_24px_rgba(37,99,235,0.35)]"
              style={{
                WebkitMaskImage:
                  "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http://www.w3.org/2000/svg%27%20viewBox%3D%270%200%2024%2024%27%3E%3Cpath%20fill%3D%27%23000%27%20d%3D%27M7%207a3%203%200%201%201%200%206a3%203%200%200%201%200-6Zm10%2010a3%203%200%201%201%200%206a3%203%200%200%201%200-6ZM17%203a3%203%200%201%201%200%206a3%203%200%200%201%200-6ZM8.8%2012.2l6.4%203.6l1-1.7l-6.4-3.6l-1%201.7Zm6.4-4L8.8%2011.8l1%201.7l6.4-3.6l-1-1.7Z%27/%3E%3C/svg%3E\")",
                maskImage:
                  "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http://www.w3.org/2000/svg%27%20viewBox%3D%270%200%2024%2024%27%3E%3Cpath%20fill%3D%27%23000%27%20d%3D%27M7%207a3%203%200%201%201%200%206a3%203%200%200%201%200-6Zm10%2010a3%203%200%201%201%200%206a3%203%200%200%201%200-6ZM17%203a3%203%200%201%201%200%206a3%203%200%200%201%200-6ZM8.8%2012.2l6.4%203.6l1-1.7l-6.4-3.6l-1%201.7Zm6.4-4L8.8%2011.8l1%201.7l6.4-3.6l-1-1.7Z%27/%3E%3C/svg%3E\")",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "70%",
                maskSize: "70%",
              }}
              aria-hidden="true"
            />
            <span className="text-[clamp(1.5rem,5vw,2.35rem)] font-[900] tracking-[-0.03em] text-[#2563eb]">
              Task Manager
            </span>
          </h1>
          <p className="mt-[0.4rem] text-[0.9rem] text-[#6b7280]">
            Start organizing your work efficiently.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-[1.5rem] flex flex-col gap-[1rem]"
        >
          {[
            { id: "username", label: "Username", type: "text", ph: "johndoe" },
            { id: "email", label: "Email", type: "email", ph: "you@example.com" },
            { id: "password", label: "Password", type: "password", ph: "••••••••" },
            { id: "phone", label: "Phone", type: "tel", ph: "1234567890" },
            { id: "address", label: "Address", type: "text", ph: "123 Main St, City" },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-[0.4rem]">
              <label className="text-[0.85rem] text-[#4b5563]">{f.label}</label>
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                placeholder={f.ph}
                value={form[f.id]}
                onChange={handleChange}
                required
                className="px-[0.8rem] py-[0.6rem] rounded-[0.6rem] border border-[#d1d5db]
                  bg-white text-[#111827] text-[0.9rem]
                  focus:outline-none focus:border-[#2563eb]
                  focus:shadow-[0_0_0_1px_rgba(37,99,235,0.3)]"
              />
            </div>
          ))}

          {error && <div className="text-[0.85rem] text-[#fecaca]">{error}</div>}
          {success && (
            <div className="text-[0.85rem] text-[#86efac]">{success}</div>
          )}

          <button
            disabled={loading}
            className="w-full mt-[0.5rem] px-[1rem] py-[0.7rem] rounded-[0.8rem]
              bg-[#2563eb] text-[#f9fafb] font-[600]
              transition-[transform,box-shadow,filter] duration-200
              hover:brightness-105
              hover:shadow-[0_12px_30px_rgba(59,130,246,0.4)]
              hover:-translate-y-[1px]
              disabled:opacity-60 disabled:cursor-not-allowed
              disabled:shadow-none disabled:translate-y-0"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-[1rem] text-[0.8rem] text-[#9ca3af] text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#60a5fa] font-[500] hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
