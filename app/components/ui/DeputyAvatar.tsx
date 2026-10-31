import React, { useState } from "react";
import Image from "next/image";

interface DeputyAvatarProps {
  urlFoto: string | null;
  nome: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const DeputyAvatar: React.FC<DeputyAvatarProps> = ({
  urlFoto,
  nome,
  size = "md",
  className = "",
}) => {
  const [hasError, setHasError] = useState(false);

  const parts = nome.trim().split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : (parts[0]?.slice(0, 2) || "DP").toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-10 text-xs",
    md: "w-14 h-18 text-sm",
    lg: "w-28 h-36 sm:w-32 sm:h-40 text-lg",
  }[size];

  const containerClasses = `${sizeClasses} rounded overflow-hidden border border-border bg-primary-soft shrink-0 ${className}`;

  if (!urlFoto || hasError) {
    return (
      <div
        className={`${containerClasses} flex items-center justify-center font-semibold text-primary select-none`}
        title={nome}
        aria-label={`Sem fotografia para ${nome}`}
      >
        <span className="font-mono tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} relative`}>
      <Image
        src={urlFoto}
        alt={`Fotografia oficial de ${nome}`}
        fill
        sizes={
          size === "sm"
            ? "32px"
            : size === "md"
              ? "56px"
              : "(max-width: 640px) 112px, 128px"
        }
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="object-cover"
        loading="eager"
      />
    </div>
  );
};
