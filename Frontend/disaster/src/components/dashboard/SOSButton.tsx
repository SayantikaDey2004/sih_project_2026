import type { SOSState } from "../../@types/interface/dashboard";

interface SOSButtonProps {
  state?: SOSState;
  onTap?: () => void;
  disabled?: boolean;
}

export function SOSButton({
  state = "idle",
  onTap,
  disabled = false,
}: SOSButtonProps) {
  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  const getButtonText = () => {
    if (isSuccess) return "✓";
    if (isError) return "!";
    if (isLoading) return "";
    return "SOS";
  };

  const getCaption = () => {
    if (isSuccess) return "Emergency Dispatched (1078)";
    if (isError) return "Alert Failed — Call 1078";
    return "Tap for Emergency";
  };

  const getSubCaption = () => {
    if (isSuccess)
      return "Your live coordinates have been transmitted to the nearest response team. Help is on the way.";
    if (isError)
      return "Direct transmission failed. Please call 1078 emergency services immediately.";
    return "Shares your live location with the nearest rescue team the moment you tap";
  };

  const handlePress = () => {
    // 1. Immediately open dialer (Universal method for Android/iOS WebViews)
    const link = document.createElement("a");
    link.href = "tel:1078";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Trigger background alert logic
    if (onTap) onTap();
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      {/* Glow pulse wrapper */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Glow */}
        <div
          className={`absolute h-44 w-44 rounded-full blur-2xl transition-all duration-500 ${
            isSuccess
              ? "bg-emerald-500/40"
              : isError
              ? "bg-red-600/50"
              : "bg-red-500/45 animate-pulse"
          }`}
        />

        {/* Circular SOS Button */}
        <button
          type="button"
          onClick={handlePress}
          disabled={disabled || isLoading}
          className={`relative z-10 flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full text-3xl sm:text-4xl font-extrabold tracking-wider text-white transition-all duration-300 active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed ${
            isSuccess
              ? "bg-gradient-to-b from-[#4CAF6D] to-[#2E7D32] shadow-[0_0_40px_rgba(76,175,109,0.6)]"
              : isError
              ? "bg-gradient-to-b from-[#E74C3C] to-[#922B21] shadow-[0_0_40px_rgba(231,76,60,0.6)] animate-bounce"
              : "bg-gradient-to-b from-[#EB5757] via-[#E14B3C] to-[#C0392B] shadow-[0_0_50px_rgba(225,75,60,0.55)] hover:shadow-[0_0_65px_rgba(225,75,60,0.75)] hover:scale-105"
          }`}
          aria-label="Trigger Emergency SOS"
        >
          {isLoading ? (
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          ) : (
            getButtonText()
          )}
        </button>
      </div>

      {/* Title */}
      <h2
        className={`mt-5 text-lg sm:text-xl font-bold tracking-tight transition-colors ${
          isSuccess
            ? "text-emerald-300"
            : isError
            ? "text-red-300"
            : "text-[#F4EFE4]"
        }`}
      >
        {getCaption()}
      </h2>

      {/* Subtitle */}
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8AA68F]">
        {getSubCaption()}
      </p>
    </div>
  );
}
