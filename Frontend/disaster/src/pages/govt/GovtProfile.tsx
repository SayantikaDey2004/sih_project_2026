import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getGovtUser, fetchGovtProfile, govtLogout } from "../../services/govtAuth.service";
import { ArrowLeft, LogOut, Shield, Mail, Building2, User } from "lucide-react";

interface ProfileData {
  gov_id: string;
  email: string;
  full_name: string;
  department: string;
}

export default function GovtProfile() {
  const navigate = useNavigate();
  const user = getGovtUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGovtProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        // Fallback to token data
        if (user) {
          setProfile({
            gov_id: user.gov_id,
            email: user.email,
            full_name: user.full_name,
            department: user.department,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    govtLogout();
    navigate("/govt/login", { replace: true });
  };

  const fields = profile
    ? [
        { label: "Gov ID", value: profile.gov_id, icon: Shield, accent: "#E3A63F" },
        { label: "Full Name", value: profile.full_name, icon: User, accent: "#4ade80" },
        { label: "Email", value: profile.email, icon: Mail, accent: "#3b82f6" },
        { label: "Department", value: profile.department || "Not specified", icon: Building2, accent: "#a78bfa" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#07140E]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Header */}
      <header className="bg-[#0B1A12] border-b border-white/[0.08] px-6 py-4 sm:px-10" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#E3A63F]" />
            <span className="text-sm font-semibold tracking-wide text-[#F4F1E8]">
              Geo Rakshak
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-[#A9B9A8] hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
        {/* Back link */}
        <button
          onClick={() => navigate("/govt/dashboard")}
          className="flex items-center gap-1.5 text-sm text-[#A9B9A8] hover:text-[#F4F1E8] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-[#F4F1E8] mb-2">Official Profile</h1>
        <p className="text-[#A9B9A8] text-sm mb-8">
          Your government official account details
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E3A63F] border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="rounded-xl border border-[#223B29] bg-[#0B2117]/70 backdrop-blur-md p-5 flex items-center gap-4"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${f.accent}20` }}
                  >
                    <Icon size={20} style={{ color: f.accent }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#A9B9A8] uppercase mb-0.5">
                      {f.label}
                    </p>
                    <p className="text-base font-semibold text-[#F4F1E8]">
                      {f.value}
                    </p>
                  </div>
                </div>
              );
            })}

            {error && (
              <p className="text-xs text-yellow-500/70 mt-4">
                Note: Profile loaded from local token (server: {error})
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
