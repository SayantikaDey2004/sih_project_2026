import type { StoredUser } from "../../@types/interface/auth";

interface PersonalInformationCardProps {
  user: StoredUser;
  resolvedLocation?: string;
}

export function PersonalInformationCard({ user, resolvedLocation }: PersonalInformationCardProps) {
  const fields: Array<{ label: string; value: string }> = [
    { label: "Full Name", value: user.name },
    { label: "Email Address", value: user.email },
    { label: "Phone Number", value: user.phone },
    { label: "Primary Location", value: resolvedLocation || user.location },
  ].filter((field) => field.value.trim().length > 0);

  return (
    <section
      aria-labelledby="personal-information-heading"
      className="rounded-2xl border border-[#223B29] bg-[#0F1D14] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:p-7"
    >
      <h3 id="personal-information-heading" className="text-base font-semibold text-cream">
        Personal Information
      </h3>
      <div className="mt-2 border-t border-[#223B29]" />

      {fields.length > 0 ? (
        <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs text-[#6C7D6A]">{field.label}</dt>
              <dd className="mt-1 text-sm font-medium text-cream break-words">{field.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-5 text-sm text-[#6C7D6A]">No personal information on file yet.</p>
      )}
    </section>
  );
}
