"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";
import { useEffect } from "react";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isValidMeasurementId =
  measurementId === undefined || /^G-[A-Z0-9]+$/.test(measurementId);

export const GoogleAnalytics = () => {
  useEffect(() => {
    if (measurementId && !isValidMeasurementId) {
      console.error(
        "NEXT_PUBLIC_GA_MEASUREMENT_ID deve estar no formato G-XXXXXXXXXX.",
      );
    }
  }, []);

  if (!measurementId || !isValidMeasurementId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={measurementId} />;
};
