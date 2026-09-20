/**
 * Global string sanitizer to force-remove any "Singapore" leaks from UI.
 */
export function scrubSingapore(text: string | null | undefined): string {
  if (!text) return "";

  const scrubbed = text.replace(/Singapore/gi, "Local Sector").replace(/\bSG\b/g, "IN");

  if (scrubbed.includes("Local Sector") && scrubbed.includes("Detected Location")) {
      return "Local Sector";
  }

  return scrubbed;
}

export function getDeviceGreeting(): string {
  const hour = new Date().getHours();
  // Ensure we check in descending order or specific ranges
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}
