import type { StoredUser } from "../../@types/interface/auth";

interface ProfileSummaryCardProps {
  user: StoredUser;
  resolvedLocation?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ProfileSummaryCard({ user, resolvedLocation }: ProfileSummaryCardProps) {
  const displayName = user.name.trim() || user.email;
  const displayLocation = resolvedLocation || user.location;

  return (
    <div className="rounded-2xl border border-[#223B29] bg-[#0F1D14] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-7">
      <div className="flex items-center gap-5">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-xl font-semibold text-ink"
          aria-hidden="true"
        >
          {getInitials(user.name || user.email)}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-cream">{displayName}</h2>
          {displayLocation.trim() && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[#8AA68F]">
              <span aria-hidden="true">📍</span>
              <span className="truncate">{displayLocation}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
