import { useNavigate } from "react-router";
import type { User } from "../../@types/interface/dashboard";

interface DashboardHeaderProps {
  user: User;
  email?: string;
  hideNav?: boolean;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function DashboardHeader({
  user,
  email,
  onProfileClick,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 border-b border-[#223B29] bg-[rgba(15,29,20,0.85)] backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-9 py-[14px] max-md:px-5 max-md:py-3">
        <div className="flex items-center gap-3">
          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgba(201,138,60,0.25)]" />
            <div>
              <div className="text-[18px] font-semibold tracking-tight text-[#EAE7DA]">
                Geo Rakshak
              </div>
              <div className="text-[11px] text-[#6C7D6A]">
                Disaster Response Dashboard
              </div>
            </div>
          </button>
        </div>

        {/* Right Actions — Profile only */}
        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            onClick={onProfileClick || (() => navigate("/profile"))}
            className="flex items-center gap-2.5 rounded-full border border-[#2A4632] bg-[#16281C] px-3 py-1.5 transition-colors hover:border-[#E08A3E]"
            title="Profile"
          >
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gradient-to-br from-[#5C9764] to-[#2F5A38] font-semibold text-[13px] text-[#EAE7DA]">
              {user.avatar}
            </div>
            <div className="max-md:hidden">
              <div className="text-[13px] font-medium text-[#EAE7DA]">
                {user.name}
              </div>
              <div className="text-[10px] text-[#6C7D6A]">
                {email || user.role}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
