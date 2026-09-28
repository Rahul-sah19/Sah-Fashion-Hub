import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { ErrorMessage, inputClass, primaryBtn } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useNav, type Page } from "@/context/NavContext";

export default function RegisterPage({ next }: { next?: Page }) {
  const { register } = useAuth();
  const { navigate } = useNav();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(next ?? { name: "dashboard" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join SAH Fashion Hub to track orders and shop faster"
      footer={
        <>
          Already have an account?{" "}
          <button
            onClick={() => navigate({ name: "login", next })}
            className="font-semibold text-rose-600 hover:text-rose-700"
          >
            Log in
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorMessage message={error} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sita Sharma"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
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
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            placeholder="Re-enter your password"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={submitting} className={`${primaryBtn} w-full py-3`}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
