declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "consent" | "event" | "js",
      target: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

export {};
