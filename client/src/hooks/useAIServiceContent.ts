/**
 * useAIServiceContent — Groq-powered FAQ and content for service pages
 *
 * Generates unique FAQ, extended description, and JSON-LD for service pages.
 * SAFETY: Full graceful fallback if Groq unavailable.
 * PERFORMANCE: Cached in sessionStorage for 7 days per service.
 */
import { useState, useEffect, useRef } from "react";
import {
  buildFaqJsonLd,
  getServiceStaticFaq,
} from "@shared/serviceFaq";

export interface ServiceAIContent {
  faq: Array<{ q: string; a: string }>;
  extendedDescription: string;
  jsonLdFaq: object | null;
  isAI: boolean;
  isLoading: boolean;
}

const CACHE_PREFIX = "freonn_service_v2_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// Static FAQ fallbacks — shared with SSR (shared/serviceFaq.ts)

function getCached(service: string): Omit<ServiceAIContent, "isAI" | "isLoading"> | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + service);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_PREFIX + service); return null; }
    return data;
  } catch { return null; }
}

function setCache(service: string, data: Omit<ServiceAIContent, "isAI" | "isLoading">) {
  try { sessionStorage.setItem(CACHE_PREFIX + service, JSON.stringify({ data, ts: Date.now() })); } catch { /* ignore */ }
}

export function useAIServiceContent(
  serviceSlug: string,
  serviceName: string,
  serviceDescription: string
): ServiceAIContent {
  const staticFaq = getServiceStaticFaq(serviceSlug);

  const [content, setContent] = useState<ServiceAIContent>({
    faq: staticFaq,
    extendedDescription: serviceDescription,
    jsonLdFaq: buildFaqJsonLd(staticFaq),
    isAI: false,
    isLoading: false,
  });
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!serviceSlug || fetchedRef.current) return;
    fetchedRef.current = true;

    const cached = getCached(serviceSlug);
    if (cached) {
      setContent({ ...cached, isAI: true, isLoading: false });
      return;
    }

    setContent(prev => ({ ...prev, isLoading: true }));

    fetch("/api/seo/service-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: serviceSlug, title: serviceName, description: serviceDescription }),
      signal: AbortSignal.timeout(12000),
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (json && json.faq && Array.isArray(json.faq) && !json.fallback) {
          const aiData = {
            faq: json.faq,
            extendedDescription: json.extendedDescription || serviceDescription,
            jsonLdFaq: buildFaqJsonLd(json.faq),
          };
          setCache(serviceSlug, aiData);
          setContent({ ...aiData, isAI: true, isLoading: false });
        } else {
          setContent(prev => ({ ...prev, isLoading: false }));
        }
      })
      .catch(() => {
        setContent(prev => ({ ...prev, isLoading: false }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceSlug]);

  return content;
}
