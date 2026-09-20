import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Bot, Cross, LayoutDashboard, MapPinned } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import type { User } from "../../@types/interface/dashboard";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  user: User;
  email?: string;
  onProfileClick?: () => void;
  children: ReactNode;
}

const SIDEBAR_NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Risk Map", path: "/risk-map", icon: MapPinned },
  { label: "Emergency Response", path: "/emergency-response", icon: Cross },
  { label: "AI Assistant", path: "/ai-analysis", icon: Bot },
];

export function DashboardLayout({
  user,
  email,
  onProfileClick,
  children,
}: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      {/* Slim top header — hide nav or sidebar triggers */}
      <DashboardHeader
        user={user}
        email={email}
        hideNav
        onProfileClick={onProfileClick}
      />

      <div className={`${styles.contentLayer} flex flex-col min-h-[calc(100vh-60px)] pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-0`}>
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Downbars / Bottom Navigation Bar — replacing the sidebar to look like a standard mobile app */}
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[#223B29] bg-[#0F1D14]/90 backdrop-blur-md px-2 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-lg"
          aria-label="Bottom navigation"
        >
          {SIDEBAR_NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 text-center transition-all ${
                  isActive ? "text-[#E3A63F]" : "text-[#93A490] hover:text-[#EAE7DA]"
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} aria-hidden="true" />
                <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
