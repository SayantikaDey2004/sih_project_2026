import type { StoredUser } from "../../@types/interface/auth";

const COORDINATE_PATTERN = /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/;

interface AlertAreaCardProps {
  user: StoredUser;
  resolvedLocation?: string;
}

export function AlertAreaCard({ user, resolvedLocation }: AlertAreaCardProps) {
  const location = (resolvedLocation || user.location).trim();
  if (!location) return null;

  const coordinateMatch = location.match(COORDINATE_PATTERN);

  return (
    <section
      aria-labelledby="alert-area-heading"
      className="rounded-2xl border border-[#223B29] bg-[#0F1D14] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-7"
    >
      <h3 id="alert-area-heading" className="text-base font-semibold text-cream">
        Alert Area
      </h3>
      <div className="mt-2 border-t border-[#223B29]" />

      {coordinateMatch ? (
        <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-[#6C7D6A]">Latitude</dt>
            <dd className="mt-1 text-sm font-medium text-cream">{coordinateMatch[1]}°</dd>
          </div>
          <div>
            <dt className="text-xs text-[#6C7D6A]">Longitude</dt>
            <dd className="mt-1 text-sm font-medium text-cream">{coordinateMatch[2]}°</dd>
          </div>
        </dl>
      ) : (
        <dl className="mt-5">
          <dt className="text-xs text-[#6C7D6A]">City / District</dt>
          <dd className="mt-1 text-sm font-medium text-cream">{location}</dd>
        </dl>
      )}
    </section>
  );
}
