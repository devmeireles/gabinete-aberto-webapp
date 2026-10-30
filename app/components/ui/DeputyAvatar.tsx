import React, { useState } from 'react';
import { User } from 'lucide-react';

interface DeputyAvatarProps {
  urlFoto: string;
  nome: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DeputyAvatar: React.FC<DeputyAvatarProps> = ({
  urlFoto,
  nome,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // Compute initials (e.g. "Erika Hilton" -> "EH")
  const parts = nome.trim().split(/\s+/);
  const initials = parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : (parts[0]?.slice(0, 2) || 'DP').toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-10 text-xs',
    md: 'w-14 h-18 text-sm',
    lg: 'w-28 h-36 sm:w-32 sm:h-40 text-lg',
  }[size];

  if (hasError) {
    return (
      <div
        className={`${sizeClasses} rounded overflow-hidden border border-border bg-primary-soft text-primary font-semibold flex flex-col items-center justify-center shrink-0 select-none ${className}`}
        title={nome}
      >
        <span className="font-mono tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded overflow-hidden border border-border-subtle bg-surface-subtle shrink-0 relative ${className}`}
    >
      <img
        src={urlFoto}
        alt={`Fotografia oficial de ${nome}`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
