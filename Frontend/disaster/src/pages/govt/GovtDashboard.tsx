import { useNavigate } from "react-router";
import { getGovtUser, govtLogout } from "../../services/govtAuth.service";
import { FileText, UserCircle, LogOut, Shield, BarChart3, AlertTriangle } from "lucide-react";

export default function GovtDashboard() {
  const navigate = useNavigate();
  const user = getGovtUser();

  const handleLogout = () => {
    govtLogout();
    navigate("/govt/login", { replace: true });
  };

  const navCards = [
    {
      title: "Reported Incidents",
      desc: "View disaster reports filed by citizens",
      icon: FileText,
      path: "/govt/reports",
      accent: "#ef4444",
    },
    {
      title: "Official Profile",
      desc: "View and manage your government profile",
      icon: UserCircle,
      path: "/govt/profile",
      accent: "#3b82f6",
    },
  ];

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/govt/profile")}
              className="text-sm text-[#A9B9A8] hover:text-[#F4F1E8] transition-colors flex items-center gap-1"
            >
              <UserCircle size={16} />
              {user?.full_name || "Official"}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-[#A9B9A8] hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#F4F1E8] mb-2">
            Welcome, {user?.full_name || "Official"}
          </h1>
          <p className="text-[#A9B9A8] text-sm">
            Government disaster monitoring and response dashboard
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-[#223B29] bg-[#0B2117]/70 backdrop-blur-md p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={20} className="text-[#4ade80]" />
              <span className="text-xs font-medium tracking-wider text-[#A9B9A8] uppercase">
                Gov ID
              </span>
            </div>
            <p className="text-lg font-mono font-bold text-[#E3A63F]">
              {user?.gov_id || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-[#223B29] bg-[#0B2117]/70 backdrop-blur-md p-5">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={20} className="text-[#3b82f6]" />
              <span className="text-xs font-medium tracking-wider text-[#A9B9A8] uppercase">
                Department
              </span>
            </div>
            <p className="text-lg font-semibold text-[#F4F1E8]">
              {user?.department || "Not specified"}
            </p>
          </div>

          <div className="rounded-xl border border-[#223B29] bg-[#0B2117]/70 backdrop-blur-md p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle size={20} className="text-[#ef4444]" />
              <span className="text-xs font-medium tracking-wider text-[#A9B9A8] uppercase">
                Status
              </span>
            </div>
            <p className="text-lg font-semibold text-[#4ade80]">
              Active
            </p>
          </div>
        </div>

        {/* Navigation Cards */}
        <h2 className="text-lg font-semibold text-[#F4F1E8] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {navCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="group text-left rounded-2xl border border-[#223B29] bg-[#0B2117]/50 backdrop-blur-md p-6 hover:border-[#E3A63F]/40 hover:bg-[#0B2117]/80 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.accent}20` }}
                  >
                    <Icon size={22} style={{ color: card.accent }} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#F4F1E8] group-hover:text-[#E3A63F] transition-colors">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm text-[#A9B9A8] leading-relaxed">
                  {card.desc}
                </p>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
