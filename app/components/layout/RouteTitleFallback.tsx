"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const getFallbackTitle = (pathname: string) => {
  if (/^\/deputados\/[^/]+$/.test(pathname)) {
    return "Carregando perfil do deputado | Gabinete Aberto";
  }

  if (/^\/fornecedores\/[^/]+$/.test(pathname)) {
    return "Carregando fornecedor | Gabinete Aberto";
  }

  return null;
};

export const RouteTitleFallback = () => {
  const pathname = usePathname();
  const fallbackTitle = pathname ? getFallbackTitle(pathname) : null;

  useLayoutEffect(() => {
    if (fallbackTitle) {
      document.title = fallbackTitle;
    }
  }, [fallbackTitle]);

  return null;
};
