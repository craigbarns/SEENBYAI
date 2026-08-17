interface LogoMarkProps {
  className?: string;
  /** "on-dark" inverts the mark for deep-green backgrounds. */
  variant?: "default" | "on-dark";
}

export function LogoMark({ className, variant = "default" }: LogoMarkProps) {
  const onDark = variant === "on-dark";
  const bubble = onDark ? "#bef264" : "#173b35";
  const heroBar = onDark ? "#173b35" : "#bef264";
  const softBar = onDark ? "#173b35" : "#f8f8f3";

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="42" height="36" rx="12" fill={bubble} />
      <path d="M11 35 L11 45.6 C11 47.5 12.7 47 13.7 46 L23.5 37 Z" fill={bubble} />
      <rect x="11.75" y="23" width="5.5" height="8" rx="2.75" fill={softBar} opacity="0.35" />
      <rect x="21.25" y="17.5" width="5.5" height="13.5" rx="2.75" fill={softBar} opacity="0.65" />
      <rect x="30.75" y="11" width="5.5" height="20" rx="2.75" fill={heroBar} />
    </svg>
  );
}
