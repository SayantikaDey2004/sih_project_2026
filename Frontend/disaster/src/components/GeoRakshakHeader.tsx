import { useEffect, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";

const navItems = [
  ["Home", "home"],
  ["About", "about"],
  ["Safety Tips", "safety-tips"],
  ["Contact", "contact"],
] as const;

interface GeoRakshakHeaderProps {
  activeItem?: "response";
}

export function Brand() {
  return <span className="flex items-center gap-2.5 font-display text-[19px] font-bold text-cream"><span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgba(201,138,60,0.25)]" />Geo Rakshak</span>;
}

export function GeoRakshakHeader({ activeItem }: GeoRakshakHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  useEffect(() => {
    if (location.pathname !== "/") return;
    const target = sessionStorage.getItem("scrollTo");
    if (target) {
      scrollToSection(target);
      sessionStorage.removeItem("scrollTo");
    }
  }, [location.pathname]);

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    if (location.pathname === "/") {
      scrollToSection(id);
      return;
    }
    sessionStorage.setItem("scrollTo", id);
    navigate("/");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-[rgba(244,239,228,0.16)] bg-[rgba(14,31,23,0.92)] backdrop-blur-lg"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8 py-[18px] max-[520px]:px-5">
        <a href="#home" onClick={(event) => handleSectionClick(event, "home")}><Brand /></a>
        <nav className="hidden ml-auto items-center gap-[34px] min-[861px]:flex">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => handleSectionClick(event, id)} className="text-[15px] font-medium text-moss transition-colors duration-200 hover:text-cream">{label}</a>)}
          {activeItem === "response" && <span className="border-b border-gold pb-1 text-[15px] font-semibold text-cream">Response Center</span>}
          <a
            href="/govt/login"
            className="ml-2 flex items-center gap-1.5 rounded-full border border-[rgba(74,222,128,0.4)] bg-[rgba(74,222,128,0.08)] px-4 py-1.5 text-[13px] font-semibold text-[#4ade80] transition-all hover:border-[#4ade80] hover:bg-[rgba(74,222,128,0.15)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
            Govt Official
          </a>
        </nav>
        <button type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="hidden text-2xl text-cream max-[860px]:block">{menuOpen ? "×" : "☰"}</button>
      </div>
      {menuOpen && <nav className="border-t border-[rgba(244,239,228,0.12)] px-8 py-4 min-[861px]:hidden">{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => handleSectionClick(event, id)} className="block py-2 text-moss hover:text-cream">{label}</a>)}<a href="/govt/login" className="mt-3 block py-2 font-semibold text-[#4ade80] hover:text-green-300">🏛 Govt Official Portal</a></nav>}
    </header>
  );
}
