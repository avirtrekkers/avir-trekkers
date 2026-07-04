import { useEffect } from "react";

const SITE_NAME = import.meta.env.VITE_APP_NAME || "Avir Trekkers";

/**
 * Sets document.title and the meta description for the current page.
 * Lightweight alternative to react-helmet for an SPA.
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
