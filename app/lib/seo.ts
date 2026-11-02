import type { Metadata } from "next";

export function createPageMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Gabinete Aberto",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
