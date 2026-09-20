import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { fetchGovtReports, govtLogout } from "../../services/govtAuth.service";
import { ArrowLeft, LogOut, MapPin, AlertTriangle, FileText } from "lucide-react";

interface Report {
  disaster_type: string;
  location: string;
  IncidentId?: number;
  [key: string]: unknown;
}

export default function GovtReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchGovtReports();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
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

  const getDisasterColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("flood")) return "#3b82f6";
    if (t.includes("earthquake")) return "#ef4444";
    if (t.includes("landslide")) return "#a78bfa";
    if (t.includes("cyclone") || t.includes("storm")) return "#06b6d4";
    if (t.includes("fire")) return "#f97316";
    return "#E3A63F";
  };

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

      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        {/* Back link */}
        <button
          onClick={() => navigate("/govt/dashboard")}
          className="flex items-center gap-1.5 text-sm text-[#A9B9A8] hover:text-[#F4F1E8] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F1E8] mb-2">
              Reported Incidents
            </h1>
            <p className="text-[#A9B9A8] text-sm">
              Disaster reports submitted by citizens via the Geo Rakshak app
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#223B29] bg-[#0B2117]/70 px-4 py-2">
            <FileText size={16} className="text-[#E3A63F]" />
            <span className="text-sm font-semibold text-[#F4F1E8]">
              {reports.length} report{reports.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E3A63F] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <AlertTriangle size={32} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-[#223B29] bg-[#0B2117]/50 p-12 text-center">
            <FileText size={48} className="text-[#5a7a60] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#F4F1E8] mb-2">
              No Incidents Reported
            </h3>
            <p className="text-sm text-[#A9B9A8]">
              No disaster reports have been filed by citizens yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report, idx) => {
              const color = getDisasterColor(report.disaster_type);
              return (
                <div
                  key={report.IncidentId ?? idx}
                  className="rounded-xl border border-[#223B29] bg-[#0B2117]/70 backdrop-blur-md p-5 hover:border-[#E3A63F]/30 transition-all duration-300"
                >
                  {/* Disaster type badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${color}20`,
                        color: color,
                      }}
                    >
                      {report.disaster_type}
                    </span>
                    {report.IncidentId && (
                      <span className="text-xs font-mono text-[#5a7a60]">
                        INC-{report.IncidentId}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-[#A9B9A8] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#F4F1E8] leading-relaxed">
                      {report.location}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
