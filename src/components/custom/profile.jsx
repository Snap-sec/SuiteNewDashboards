import React, { useEffect, useState } from 'react';
import Avvvatars from 'avvvatars-react';
import appConfig from '@/config/appConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';

// Module-level cache: avoids re-fetching the same profile image across component instances
const profileImageCache = new Map();

export const clearProfileImageCache = (key) => {
  if (key) {
    profileImageCache.delete(key);
  } else {
    profileImageCache.clear();
  }
  window.dispatchEvent(new Event('profilePictureUpdated'));
};

// --- Main Component ---
function Profile({
  email,
  name,
  graphicsUserName = '',
  role,
  userId,
  showEmail = false,
  size = '36px',
  className = '',
  avatarSize,
  showName = true,
  showOnHover="email"
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setImageUrl('');
    setIsError(false);
    setIsLoading(true);

    if (!email?.trim() && !userId?.toString().trim()) {
      setIsLoading(false);
      return;
    }

    const cacheKey = email || `id:${userId}`;

    const getProfilePicture = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        let params = '';
        if (email) {
          const encodedEmail = encodeURIComponent(email);
          params = `email=${encodedEmail}`;
        } else if (userId) {
          params = `id=${userId}`;
        }

        let response;
        try {
          response = await fetch(
            `${appConfig.BASE_URL}/auth/api/auth/profile-picture?${params}`,
            {
              method: 'GET',
              cache: 'no-cache',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            },
          );
        } catch (err) { }

        if (!response?.ok) return;

        const data = await response.blob();
        if (data.size === 0) throw new Error('Empty image blob');

        const objectUrl = URL.createObjectURL(data);
        profileImageCache.set(cacheKey, objectUrl);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    const handleProfileUpdate = () => {
      if (!profileImageCache.has(cacheKey)) {
        getProfilePicture();
      }
    };

    window.addEventListener('profilePictureUpdated', handleProfileUpdate);

    // Return cached blob URL if available
    if (profileImageCache.has(cacheKey)) {
      setImageUrl(profileImageCache.get(cacheKey));
      setIsLoading(false);
    } else {
      getProfilePicture();
    }

    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfileUpdate);
    };
  }, [email, userId]);

  const numericSize = typeof size === 'number' ? size : parseInt(size) || 36;
  const finalAvatarSize = avatarSize || numericSize;

  // --- Helper to get initials from all parts of a name ---
  const getInitials = (str) => {
    if (!str?.trim()) return '';
    return str
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .toLowerCase();
  };

  const initialText = name?.trim()
    ? getInitials(name)
    : email?.trim()
      ? getInitials(email.split('@')[0].replace(/[._-]/g, ' '))
      : graphicsUserName?.trim()
        ? getInitials(graphicsUserName)
        : 'unknown';

  // --- Avatar Display ---
  const Avatar = (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Avvvatars value={initialText} size={finalAvatarSize} style="character" />
    </div>
  );

  const GraphicAvatar = (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Avvvatars value="unknown" size={finalAvatarSize} />
    </div>
  );

  const hasOwner = Boolean(email?.trim() || userId);

  // --- System Bot detection ---
  const isSystemBot =
    graphicsUserName.toLowerCase() === 'system' && (userId === null || userId === 'system' || userId === 'jira:anonymous');

  const BotAvatar = (
    <div
      className="shrink-0 flex items-center justify-center rounded-full bg-muted"
      style={{ width: size, height: size }}
      title="System"
    >
      <Bot
        style={{ width: `calc(${size} * 0.55)`, height: `calc(${size} * 0.55)` }}
        className="text-muted-foreground"
      />
    </div>
  );

  return (
    <div
      className={`flex items-center max-w-full ${className} ${name || role || showEmail ? 'gap-3' : ''}`}
    >
      {/* 0. SYSTEM BOT → show bot icon */}
      {isSystemBot && BotAvatar}

      {/* 1. NO OWNER → show graphic avatar */}
      {!hasOwner && !isSystemBot && GraphicAvatar}

      {/* Render avatar only if owner exists and not a system bot */}
      {hasOwner && !isSystemBot ? (
        isLoading ? (
          <Skeleton
            className="rounded-full shrink-0"
            style={{ width: size, height: size }}
          />
        ) : isError || !imageUrl ? (
          // 2a. Owner but no profile → initials
          Avatar
        ) : (
          // 2b. Owner & profile → image
          <img
            src={imageUrl}
            className="rounded-full object-cover shrink-0"
            style={{ width: size, height: size }}
            alt={name || 'Avatar'}
            title={showOnHover == "email" ? email : name}
            loading="lazy"
            decoding="async"
          />
        )
      ) : null}

      {/* Render name and role (always show if present) */}
      {(name || role) && showName && (
        <div className="flex flex-col min-w-0 overflow-hidden">
          <span
            className="text-sm font-medium text-foreground hover:text-primary truncate"
            title={name || email}
          >
            {name || email}
          </span>
          {showEmail && (
            <span
              className="text-xs font-normal text-muted-foreground hover:text-primary truncate"
              title={email}
            >
              {email}
            </span>
          )}
          {role && (
            <span
              className="text-xs text-muted-foreground font-normal truncate"
              title={role}
            >
              {role}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Profile };
