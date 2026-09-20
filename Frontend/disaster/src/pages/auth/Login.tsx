import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ToastContainer } from "../../components/signup/Toast";
import { LoginForm } from "../../components/login/LoginForm";
import { ResetPasswordForm } from "../../components/login/ResetPasswordForm";
import { useToast } from "../../hooks/useToast";
import loginBackground from "../../assets/login.png";
import { authenticateUserApi } from "../../services/auth.service";

const NAV_LINKS = [
  ["Home", "home"],
  ["About", "about"],
  ["Safety Tips", "safety-tips"],
  ["Contact", "contact"],
] as const;

type View = "login" | "reset";

export default function Login() {
  const navigate = useNavigate();
  const { toasts, showToast, dismissToast } = useToast();
  const [view, setView] = useState<View>("login");

  const handleNavClick = (sectionId: string) => {
    sessionStorage.setItem("scrollTo", sectionId);
    navigate("/");
  };

  const handleLoginSuccess = async (email: string, password?: string) => {
    try {
      await authenticateUserApi(email, password);
      showToast("success", "Logged in successfully", "Welcome back to Geo Rakshak.");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 600);
    } catch (err) {
      showToast("error", "Couldn't log in", err instanceof Error ? err.message : "Invalid email or password");
    }
  };

  const handleLoginError = (message: string) => {
    showToast("error", "Couldn't log in", message);
  };

  const handleResetSuccess = (message: string) => {
    showToast("success", "Password reset requested", message);
    setView("login");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#07140E]">
      {/* Background image — India map, kept prominent on the right */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBackground})` }}
        role="img"
        aria-label="Relief map of India and the Northeast region"
      />

      {/* Subtle overlay, weighted toward the left where the card sits */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050B08]/75 via-[#050B08]/35 to-transparent" />
      <div className="absolute inset-0 bg-[#050B08]/10" />

      <div className="relative z-10 flex min-h-screen flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {/* Solid dark-green top navigation */}
        <header className="bg-[#0B1A12] border-b border-white/[0.08] px-6 py-5 sm:px-10" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top))' }}>
          <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Primary">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E3A63F]" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-wide text-[#F4F1E8]">
                Geo Rakshak
              </span>
            </Link>
            <ul className="hidden sm:flex items-center gap-8">
              {NAV_LINKS.map(([label, section]) => (
                <li key={section}>
                  <a
                    href={`/#${section}`}
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(section);
                    }}
                    className="text-sm text-[#A9B9A8] hover:text-[#F4F1E8]
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E3A63F] rounded
                      transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* Card sits left on desktop, centered on mobile; right side stays open for the map */}
        <main className="flex flex-1 items-center px-4 py-8 sm:px-10 md:px-16">
          <div
            className="w-full max-w-[440px] mx-auto md:mx-0 md:w-[38%] md:min-w-[380px] rounded-2xl
              border border-white/[0.12] bg-[#0B2117]/90 backdrop-blur-md
              shadow-[0_20px_60px_rgba(0,0,0,0.5)] px-7 py-8 sm:px-9 sm:py-9"
          >
            {view === "login" ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-2 w-2 rounded-full bg-[#E3A63F]" aria-hidden="true" />
                  <span className="text-xs font-medium tracking-wide text-[#A9B9A8]">
                    Geo Rakshak
                  </span>
                </div>

                <h1 className="text-2xl font-semibold text-[#F4F1E8] mb-2">Welcome back</h1>
                <p className="text-sm text-[#A9B9A8] mb-7 leading-relaxed">
                  Sign in to continue monitoring disaster risks across Northeast India.
                </p>

                <LoginForm
                  onForgotPassword={() => setView("reset")}
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />

                <p className="mt-6 text-center text-sm text-[#8FA98C]">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-[#E3A63F] hover:text-[#EDB454]
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E3A63F] rounded
                      transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </>
            ) : (
              <ResetPasswordForm
                onSuccess={handleResetSuccess}
                onBackToLogin={() => setView("login")}
              />
            )}
          </div>
        </main>

        <footer className="px-4 pb-6">
          <p className="text-xs text-[#8FA98C]/80 text-center md:text-left md:pl-16">
            Your location and account information are protected.
          </p>
        </footer>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}