import { useEffect, useMemo, useState } from "react";
import { LocateFixed, Shield } from "lucide-react";
import { ActivityFeed } from "../components/emergency/ActivityFeed";
import { IncidentList } from "../components/emergency/IncidentList";
import { NearestHelp } from "../components/emergency/NearestHelp";
import { ResourceAllocation } from "../components/emergency/ResourceAllocation";
import { VillageCards } from "../components/emergency/VillageCards";
import type { EmergencyResponseData } from "../@types/interface/emergencyResponse";
import { fetchEmergencyResponse } from "../services/emergencyResponse.service";
import { fetchLiveLocation } from "../services/dashboard.service";
import bg2Image from "../assets/bg2.jpg";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { getCurrentUser } from "../services/auth.service";
import { getCurrentCoordinates } from "../utils/location";
import { scrubSingapore } from "../utils/sanitizer";

export default function EmergencyResponse() {
  const user = getCurrentUser();
  const currentUser = {
    id: user?.email || "user@georakshak.org",
    name: user?.name || "Citizen",
    role: "Responder",
    avatar: user?.name ? user.name.slice(0, 2).toUpperCase() : "GR",
  };
  const [data, setData] = useState<EmergencyResponseData | null>(null);
  const [userLocationName, setUserLocationName] = useState<string>(user?.location || "Live Sector");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortDescending, setSortDescending] = useState(true);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Get live location first
        const coords = await getCurrentCoordinates();
        const locData = await fetchLiveLocation(coords || undefined);

        // Define apiLoc for fetch (coords preferred for ML)
        const signupLocName = (user?.location || "").trim();
        let apiLoc = coords || signupLocName || locData?.city || "Local Sector";

        // Detection flags
        const coordRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
        const genericPlaceholders = ["Current Location", "Registered Home Sector", "Local Sector", "Live Location", "Monitored Zone"];
        const isGeneric = (name: string) => !name || genericPlaceholders.some(p => name.includes(p));

        let resolvedName = signupLocName;
        let resolvedRegion = "";

        // 1. IP-based fallback if generic
        if (isGeneric(resolvedName) && (locData?.city || locData?.name)) {
          resolvedName = locData.city || locData.name || "Local Sector";
          resolvedRegion = locData.full_region || locData.region || "Monitored Zone";
        }

        // 2. Nominatim fallback if still coordinate or generic
        if (coordRegex.test(resolvedName) || isGeneric(resolvedName)) {
          const coordsToUse = coordRegex.test(resolvedName) ? resolvedName : coords || locData?.location;
          if (coordsToUse && coordRegex.test(coordsToUse)) {
            try {
              const [lat, lon] = coordsToUse.split(",");
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`
              );
              if (geoRes.ok) {
                const geoData = await geoRes.json();
                resolvedName = geoData.address?.city || geoData.address?.town || geoData.address?.district || geoData.address?.suburb || resolvedName;
                resolvedRegion = geoData.address?.state || geoData.address?.county || resolvedRegion;
              }
            } catch (err) {
              console.warn("Emergency reverse geocoding failed:", err);
            }
          }
        }

        if (active) {
            const displayCity = scrubSingapore(resolvedName);
            const displayRegion = scrubSingapore(resolvedRegion);
            setUserLocationName(displayRegion ? `${displayCity}, ${displayRegion}` : displayCity);
        }

        // Fetch location-aware emergency response
        const responseData = await fetchEmergencyResponse(apiLoc);

        // Deep Sanitize and Resolve coordinates in response data
        if (responseData && active) {
            const resolveLoc = async (loc: string) => {
                let trimmed = (loc || "").trim();

                // Nuclear replacement for generic placeholders
                const placeholders = ["Current Sector", "Local Sector", "Current Location", "Detected Area", "Active Sector", "Monitored Zone"];
                for (const p of placeholders) {
                    if (trimmed.includes(p)) {
                        trimmed = trimmed.replace(new RegExp(p, 'g'), resolvedName);
                    }
                }

                if (!trimmed || !coordRegex.test(trimmed)) return trimmed;

                try {
                    const [lat, lon] = trimmed.split(",").map(s => s.trim());
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&accept-language=en`);
                    if (res.ok) {
                        const geo = await res.json();
                        const resolved = geo.address?.city || geo.address?.town || geo.address?.village || geo.address?.hamlet || geo.display_name.split(',')[0] || trimmed;
                        return resolved;
                    }
                } catch {}
                return trimmed;
            };

            const [resolvedIncidents, resolvedInfra, resolvedHelp, resolvedVillages] = await Promise.all([
                Promise.all(responseData.incidents.map(async inc => ({
                    ...inc,
                    location: scrubSingapore(await resolveLoc(inc.location)),
                    title: scrubSingapore(await resolveLoc(inc.name)),
                    name: scrubSingapore(await resolveLoc(inc.name)),
                    detail: scrubSingapore(await resolveLoc(inc.detail))
                }))),
                Promise.all(responseData.infrastructure.map(async inf => ({
                    ...inf,
                    name: scrubSingapore(await resolveLoc(inf.name)),
                    location: scrubSingapore(await resolveLoc(inf.location))
                }))),
                Promise.all(responseData.helpEntries.map(async h => ({
                    ...h,
                    title: scrubSingapore(await resolveLoc(h.title)),
                    location: scrubSingapore(await resolveLoc(h.location || ""))
                }))),
                Promise.all(responseData.villages.map(async v => ({
                    ...v,
                    name: scrubSingapore(await resolveLoc(v.name))
                })))
            ]);

            if (responseData.user_location) responseData.user_location = scrubSingapore(responseData.user_location);
            if (responseData.network_location) responseData.network_location = scrubSingapore(responseData.network_location);
            responseData.incidents = resolvedIncidents;
            responseData.infrastructure = resolvedInfra;
            responseData.helpEntries = resolvedHelp;
            responseData.villages = resolvedVillages;

            setData(responseData);
        }
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load response data");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadData();
    return () => { active = false; };
  }, [user?.location]);

  const sortedIncidents = useMemo(() => {
    if (!data) return [];
    return [...data.incidents].sort((left, right) => sortDescending ? right.severity - left.severity : left.severity - right.severity);
  }, [data, sortDescending]);

  return (
    <DashboardLayout
      user={{
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar,
      }}
      email={currentUser.id}
    >
      <div
        className="min-h-[calc(100vh-60px)] relative"
        style={{
          backgroundImage: `linear-gradient(rgba(7, 20, 14, 0.76), rgba(7, 20, 14, 0.90)), url(${bg2Image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <main className="mx-auto max-w-[1180px] px-4 sm:px-5 py-6 sm:py-8 lg:px-8 lg:py-12">
          <section className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold"><LocateFixed size={14} /> {userLocationName} response network</p><h1 className="font-display text-4xl leading-tight text-white sm:text-5xl">Emergency response center</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-cream-dim">Coordinate verified emergency information and monitor the response network from one place.</p></div>
          </section>

          {isLoading && <div className="rounded-2xl border border-white/10 bg-[#102419]/85 p-8 text-sm text-moss shadow-2xl">Loading emergency response data...</div>}
          {!isLoading && error && <div className="rounded-2xl border border-red-400/30 bg-red-950/40 p-8 shadow-2xl"><h2 className="font-display text-xl text-white">Response data unavailable</h2><p className="mt-2 text-sm leading-6 text-[#f0a69e]">{error}</p></div>}
          {!isLoading && !error && data && <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] min-w-0">
            <div className="space-y-6 min-w-0">
              <IncidentList incidents={sortedIncidents} sortDescending={sortDescending} onToggleSort={() => setSortDescending((value) => !value)} />
              <section className="rounded-2xl border border-white/10 bg-[#102419]/85 p-5 shadow-2xl backdrop-blur-md lg:p-6"><div className="flex items-start gap-3"><div className="rounded-lg bg-gold/10 p-2 text-gold"><Shield size={20} /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Response information</p><h2 className="mt-1 text-xl font-semibold text-cream">Emergency Dispatch</h2><p className="mt-2 text-sm leading-6 text-moss">Coordinate the nearest response team and broadcast a verified alert to affected communities.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 min-w-0">{data.infrastructure.length === 0 ? <p className="text-sm text-moss">No response status records are available.</p> : data.infrastructure.map((item) => <div key={item.id} className="rounded-xl border border-white/10 bg-[#173123]/80 p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-cream">{item.name}</h3><span className="text-xs text-gold">{item.status}</span></div><p className="mt-1 text-xs text-moss">{item.location}</p><p className="mt-3 text-xs text-cream-dim">{item.statusDetail}</p></div>)}</div></section>
              <VillageCards villages={data.villages} />
            </div>
            <div className="space-y-6 min-w-0"><NearestHelp entries={data.helpEntries} /><ResourceAllocation resources={data.resources} /><ActivityFeed items={data.feed} isLoading={isLoading} error={error} /></div>
          </div>}
        </main>
      </div>
    </DashboardLayout>
  );
}
