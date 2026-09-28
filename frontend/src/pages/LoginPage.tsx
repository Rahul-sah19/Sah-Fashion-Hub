import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { ErrorMessage, inputClass, primaryBtn } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useNav, type Page } from "@/context/NavContext";

export default function LoginPage({ next }: { next?: Page }) {
  const { login } = useAuth();
  const { navigate } = useNav();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(next ?? (user.role === "admin" ? { name: "admin" } : { name: "dashboard" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your SAH Fashion Hub account"
      footer={
        <>
          New here?{" "}
          <button
            onClick={() => navigate({ name: "register", next })}
            className="font-semibold text-rose-600 hover:text-rose-700"
          >
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={error} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={submitting} className={`${primaryBtn} w-full py-3`}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </AuthLayout>
  );
}
