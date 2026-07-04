import { useEffect, useState } from "react";
import { getSiteSettings } from "../services/api";

// Site settings are fetched once per session and shared by every page.
let settingsPromise = null;
function fetchSettings() {
  if (!settingsPromise) {
    settingsPromise = getSiteSettings()
      .then((r) => r.data?.data || {})
      .catch(() => {
        settingsPromise = null; // allow retry on next mount
        return {};
      });
  }
  return settingsPromise;
}

/**
 * Returns the admin-managed hero image for a page key
 * (treks | gallery | ourWork | contact | aboutStory | socialImpact),
 * falling back to the bundled default until loaded or when unset.
 */
export default function usePageHero(key, fallback) {
  const [url, setUrl] = useState(fallback);

  useEffect(() => {
    let mounted = true;
    fetchSettings().then((settings) => {
      const managed = settings?.pageHeroes?.[key];
      if (mounted && managed) setUrl(managed);
    });
    return () => { mounted = false; };
  }, [key]);

  return url;
}
