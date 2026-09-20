import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { govtSignupApi } from "../../services/govtAuth.service";

export default function GovtSignup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await govtSignupApi(email, password, fullName, department);
      navigate("/govt/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07140E]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B2117]/90 via-[#071A10]/70 to-[#050B08]" />

      <div className="relative z-10 flex min-h-screen flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <header className="bg-[#0B1A12] border-b border-white/[0.08] px-6 py-5 sm:px-10" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}>
          <nav className="mx-auto flex max-w-7xl items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E3A63F]" />
              <span className="text-sm font-semibold tracking-wide text-[#F4F1E8]">
                Geo Rakshak
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#1a3a2a] text-[10px] font-semibold tracking-widest text-[#4ade80] uppercase">
                Government Portal
              </span>
            </div>
          </nav>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[440px] rounded-2xl border border-white/[0.12] bg-[#0B2117]/90 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.5)] px-7 py-8 sm:px-9 sm:py-9">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#E3A63F]" />
              <span className="text-xs font-medium tracking-wide text-[#A9B9A8]">
                Government Official Portal
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-[#F4F1E8] mb-2">
              Official Registration
            </h1>
            <p className="text-sm text-[#A9B9A8] mb-7 leading-relaxed">
              Create your government official account. A unique Gov ID will be issued.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="govt-name" className="block text-sm font-medium text-[#A9B9A8] mb-1.5">
                  Full Name
                </label>
                <input
                  id="govt-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#223B29] bg-[#0a1f14] px-4 py-2.5 text-sm text-[#F4F1E8] placeholder-[#5a7a60] focus:border-[#E3A63F] focus:outline-none focus:ring-1 focus:ring-[#E3A63F] transition-colors"
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>

              <div>
                <label htmlFor="govt-email" className="block text-sm font-medium text-[#A9B9A8] mb-1.5">
                  Official Email
                </label>
                <input
                  id="govt-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[#223B29] bg-[#0a1f14] px-4 py-2.5 text-sm text-[#F4F1E8] placeholder-[#5a7a60] focus:border-[#E3A63F] focus:outline-none focus:ring-1 focus:ring-[#E3A63F] transition-colors"
                  placeholder="you@government.in"
                />
              </div>

              <div>
                <label htmlFor="govt-dept" className="block text-sm font-medium text-[#A9B9A8] mb-1.5">
                  Department
                </label>
                <input
                  id="govt-dept"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-[#223B29] bg-[#0a1f14] px-4 py-2.5 text-sm text-[#F4F1E8] placeholder-[#5a7a60] focus:border-[#E3A63F] focus:outline-none focus:ring-1 focus:ring-[#E3A63F] transition-colors"
                  placeholder="NDMA / SDMA / District Admin"
                />
              </div>

              <div>
                <label htmlFor="govt-password" className="block text-sm font-medium text-[#A9B9A8] mb-1.5">
                  Password
                </label>
                <input
                  id="govt-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-[#223B29] bg-[#0a1f14] px-4 py-2.5 text-sm text-[#F4F1E8] placeholder-[#5a7a60] focus:border-[#E3A63F] focus:outline-none focus:ring-1 focus:ring-[#E3A63F] transition-colors"
                  placeholder="Min 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#E3A63F] px-4 py-2.5 text-sm font-semibold text-[#07140E] hover:bg-[#EDB454] focus:outline-none focus:ring-2 focus:ring-[#E3A63F] focus:ring-offset-2 focus:ring-offset-[#0B2117] transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Create Official Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#8FA98C]">
              Already registered?{" "}
              <Link
                to="/govt/login"
                className="font-medium text-[#E3A63F] hover:text-[#EDB454] transition-colors"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-3 text-center text-sm text-[#5a7a60]">
              <Link to="/signup" className="hover:text-[#A9B9A8] transition-colors">
                ← Citizen registration
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
