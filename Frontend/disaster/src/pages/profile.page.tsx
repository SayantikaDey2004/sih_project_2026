import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { ProfileSummaryCard } from "../components/profile/ProfileSummaryCard";
import { PersonalInformationCard } from "../components/profile/PersonalInformationCard";
import { AlertAreaCard } from "../components/profile/AlertAreaCard";
import { getCurrentUser, logout } from "../services/auth.service";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Profile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [resolvedLocation, setResolvedLocation] = useState<string>("");

  // No active session — send them back to log in rather than showing an empty page.
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const resolveLocation = async () => {
      const signupLoc = (user.location || "").trim();
      const coordRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
      const genericPlaceholders = ["Current Location", "Registered Home Sector", "Local Sector", "Live Location", "Monitored Zone"];
      const isGeneric = (name: string) => !name || genericPlaceholders.some(p => name.includes(p));

      let targetLoc = signupLoc;

      // 1. Get real GPS coordinates first if signup location is generic
      if (isGeneric(targetLoc)) {
        try {
          const { getCurrentCoordinates } = await import("../utils/location");
          const coords = await getCurrentCoordinates();
          if (coords) targetLoc = coords;
        } catch {}
      }

      // 2. IP Fallback if still generic
      if (isGeneric(targetLoc)) {
        try {
          const { fetchLiveLocation } = await import("../services/dashboard.service");
          const locData = await fetchLiveLocation();
          if (locData?.location) {
            targetLoc = locData.location;
          } else if (locData?.city || locData?.name) {
            const city = locData.city || locData.name || "";
            const region = locData.full_region || locData.region || "";
            setResolvedLocation(region ? `${city}, ${region}` : city);
            return;
          }
        } catch {}
      }

      // 2. Nominatim lookup if coordinate or generic
      if (coordRegex.test(targetLoc) || isGeneric(targetLoc)) {
        try {
          const [lat, lon] = targetLoc.split(",").map(s => s.trim());
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`);
          if (res.ok) {
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.district || data.address?.suburb || targetLoc;
            const region = data.address?.state || data.address?.county || "";
            setResolvedLocation(region ? `${city}, ${region}` : city);
            return;
          }
        } catch {}
      }

      setResolvedLocation(targetLoc || "Local Sector");
    };

    void resolveLocation();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  if (!user) return null;

  return (
    <DashboardLayout
      user={{
        id: user.email,
        name: user.name.trim() || user.email,
        // Role isn't collected anywhere in signup today, so it isn't shown
        // in the profile content below — this is just the header's label.
        role: "Citizen",
        avatar: getInitials(user.name || user.email),
      }}
      email={user.email}
      onProfileClick={() => navigate("/profile")}
    >
      <div className="pb-16">
        <div className="mx-auto max-w-[1000px] px-9 py-8 max-md:px-5">
          {/* Page-level header: title + logout, per the reference layout */}
          <div className="mb-6 flex items-center justify-between border-b border-[#223B29] pb-5">
            <h1 className="text-2xl font-semibold tracking-tight text-cream">My Profile</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-[#2A4632] bg-[#16281C] px-4 py-2 text-sm font-medium text-cream transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Logout
            </button>
          </div>

          <div className="space-y-5">
            <ProfileSummaryCard user={user} resolvedLocation={resolvedLocation} />
            <PersonalInformationCard user={user} resolvedLocation={resolvedLocation} />
            <AlertAreaCard user={user} resolvedLocation={resolvedLocation} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
