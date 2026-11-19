import React, { useState } from 'react';
import Avvvatars from 'avvvatars-react';
import { cn } from '@/lib/utils';

// THIS WILL BE USED TO SHOW PROFILES OR LOGOS AND IT ACCEPTS URLS

const ProfileImage = ({
  src,
  alt = 'Image',
  size = 32,
  className = '',
  fallbackSrc = '/public/new-adapter-logos/defaultlogo.webp',
  variant = 'profile', // "profile" | "logo"
  fallbackAvatarText = 'UK',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageSrc = hasError || !src ? fallbackSrc : src;

  const isLogo = variant === 'logo';

  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden flex items-center justify-center',
        isLogo ? 'rounded-md bg-secondary p-0.5' : 'rounded-full bg-gray-200',
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* Loader */}
      {isLoading && <div className="absolute inset-0 animate-pulse bg-muted" />}

      {/* Show Avatar when error or no src provided */}
      {hasError || !src ? (
        <Avvvatars
          value={
            fallbackAvatarText?.trim()
              ? fallbackAvatarText
                .trim()
                .split(/\s+/)
                .map((part) => part[0])
                .join('')
                .toLowerCase()
              : 'uk'
          }
          style="character"
          size={size}
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            'w-full h-full',
            isLogo ? 'object-contain' : 'object-cover'
          )}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfileImage;
