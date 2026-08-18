"use client";

export function CookiePreferencesButton() {
  const reopen = () => {
    window.localStorage.removeItem("seenbyai_analytics_consent");
    window.dispatchEvent(new Event("seenbyai:cookie-preferences"));
  };

  return (
    <button className="font-bold text-emerald-700 underline" type="button" onClick={reopen}>
      Change analytics cookie choices
    </button>
  );
}
