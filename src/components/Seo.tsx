import { useEffect } from "react";

/**
 * Lightweight per-route SEO — no dependencies.
 *
 * Sets document.title, the meta description and the canonical URL whenever a
 * page mounts, so every route in the SPA presents unique, keyword-targeted
 * metadata to Google (which executes JavaScript when indexing).
 */
interface SeoProps {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/golf-video-editor" */
  path: string;
}

const BASE_URL = "https://maxbogey.com";

export default function Seo({ title, description, path }: SeoProps) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${path === "/" ? "/" : path}`;

    const og = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    og("og:title", title);
    og("og:description", description);
    og("og:url", `${BASE_URL}${path === "/" ? "/" : path}`);
  }, [title, description, path]);

  return null;
}
