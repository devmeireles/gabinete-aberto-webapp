"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type GoogleAnalyticsArgument = string | Date | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: GoogleAnalyticsArgument[][];
    gtag: (...args: GoogleAnalyticsArgument[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isValidMeasurementId =
  measurementId === undefined || /^G-[A-Z0-9]+$/.test(measurementId);

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (measurementId && !isValidMeasurementId) {
      console.error(
        "NEXT_PUBLIC_GA_MEASUREMENT_ID deve estar no formato G-XXXXXXXXXX.",
      );
    }
  }, []);

  useEffect(() => {
    if (!isInitialized || !pathname) {
      return;
    }

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [isInitialized, pathname]);

  if (!measurementId || !isValidMeasurementId) {
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onReady={() => {
        window.dataLayer = window.dataLayer ?? [];
        window.gtag =
          window.gtag ??
          ((...args: GoogleAnalyticsArgument[]) => window.dataLayer.push(args));
        window.gtag("js", new Date());
        window.gtag("config", measurementId, { send_page_view: false });
        setIsInitialized(true);
      }}
      onError={() => {
        console.error("Não foi possível carregar o Google Analytics.");
      }}
    />
  );
};
