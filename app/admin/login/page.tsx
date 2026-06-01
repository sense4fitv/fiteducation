"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-section-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white font-poppins tracking-tight">
            Fit<span className="text-accent-primary">Education</span>
          </h1>
          <p className="text-text-secondary-dark text-sm mt-2">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-card-dark border border-card-border rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white font-poppins mb-6">
            Sign in
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary-dark mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-section-dark border border-card-border rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary-dark focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="admin@fiteducation.ro"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary-dark mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-section-dark border border-card-border rounded-lg px-4 py-2.5 text-white text-sm placeholder-text-secondary-dark focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-accent-secondary/20 border border-accent-primary/40 rounded-lg px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-primary hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg px-4 py-3 transition-colors font-poppins"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
