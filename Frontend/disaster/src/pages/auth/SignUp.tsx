import { Link, useNavigate } from "react-router";
import { ToastContainer } from "../../components/signup/Toast";
import { SignupForm } from "../../components/signup/SignupForm";
import { useToast } from "../../hooks/useToast";
import signupBackground from "../../assets/signup.jpg";

const NAV_LINKS = [
  ["Home", "home"],
  ["About", "about"],
  ["Safety Tips", "safety-tips"],
  ["Contact", "contact"],
] as const;

export default function SignUp() {
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();

  const handleNavClick = (sectionId: string) => {
    sessionStorage.setItem("scrollTo", sectionId);
    navigate("/");
  };

  const handleSignupSuccess = () => {
    showToast("success", "Account created", "Welcome to Geo Rakshak.");
    window.setTimeout(() => navigate("/dashboard"), 1000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07140E]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${signupBackground})` }}
        role="img"
        aria-label="Landscape in the Northeast region of India"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050B08]/80 via-[#050B08]/45 to-[#050B08]/15" />

      <div className="relative z-10 flex min-h-screen flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <header className="border-b border-white/[0.08] bg-[#0B1A12] px-6 py-5 sm:px-10" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}>
          <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Primary">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E3A63F]" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-wide text-[#F4F1E8]">Geo Rakshak</span>
            </Link>
            <ul className="hidden items-center gap-8 sm:flex">
              {NAV_LINKS.map(([label, section]) => (
                <li key={section}>
                  <a
                    href={`/#${section}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(section);
                    }}
                    className="rounded text-sm text-[#A9B9A8] transition-colors hover:text-[#F4F1E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E3A63F]"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="flex flex-1 items-center px-4 py-8 sm:px-10 md:px-16">
          <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-white/[0.12] bg-[#0B2117]/95 px-7 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-9 sm:py-9 md:mx-0">
            <div className="mb-6 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E3A63F]" aria-hidden="true" />
              <span className="text-xs font-medium tracking-wide text-[#A9B9A8]">Geo Rakshak</span>
            </div>
            <h1 className="mb-2 text-2xl font-semibold text-[#F4F1E8]">Create your account</h1>
            <p className="mb-7 text-sm leading-relaxed text-[#A9B9A8]">
              Set up your profile to receive timely disaster alerts for your area.
            </p>
            <SignupForm
              onGeoError={(message) => showToast("error", "Location unavailable", message)}
              onSuccess={handleSignupSuccess}
            />
            <p className="mt-6 text-center text-sm text-[#8FA98C]">
              Already have an account?{" "}
              <Link to="/login" className="rounded font-medium text-[#E3A63F] transition-colors hover:text-[#EDB454] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E3A63F]">
                Log in
              </Link>
            </p>
          </div>
        </main>

        <footer className="px-4 pb-6">
          <p className="text-center text-xs text-[#8FA98C]/80 md:pl-16 md:text-left">
            Your location and account information are protected.
          </p>
        </footer>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
