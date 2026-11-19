import React, { useEffect, useState } from 'react';
import appConfig from '@/config/appConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '../../lib/helpers';

// Module-level cache: avoids re-fetching the same avatar across component instances
const avatarImageCache = new Map();

/**
 * Generates initials from an email string.
 * @param {string} email - The email to generate initials from.
 * @returns {string} - The generated initials (e.g., "JD").
 */
const getInitials = (email, name) => {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    if (parts.length === 1 && parts[0]) {
      return parts[0].substring(0, 2).toUpperCase();
    }
  }
  if (!email || !email.includes('@')) return '?';
  const namePart = email.split('@')[0];
  const parts = namePart.split(/[._-]/).filter(Boolean); // Split by common delimiters

  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0]) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return '?';
};

function Avatar({
  email,
  name,
  dates,
  showOnHover = 'email',
  width = '30px',
  height = '30px',
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!email) {
      setIsLoading(false);
      return;
    }

    // Return cached blob URL if available
    if (avatarImageCache.has(email)) {
      setImageUrl(avatarImageCache.get(email));
      setIsLoading(false);
      return;
    }

    const getProfilePicture = async () => {
      setIsLoading(true);
      setIsError(false);
      setImageUrl('');

      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(
          `${appConfig.BASE_URL}/auth/api/auth/profile-picture?email=${encodedEmail}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch avatar');
        }

        const data = await response.blob();
        if (data.size > 0) {
          const objectUrl = URL.createObjectURL(data);
          avatarImageCache.set(email, objectUrl);
          setImageUrl(objectUrl);
        } else {
          throw new Error('Received empty response for avatar');
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getProfilePicture();
  }, [email]);

  const hoverText = showOnHover === 'name' ? name || email : email || name;
  const timeKey = email || name;
  const dateSuffix =
    dates && timeKey && dates[timeKey] ? ` - ${timeAgo(dates[timeKey])}` : '';
  const titleText = hoverText ? `${hoverText}${dateSuffix}` : '';

  if (!email) {
    // No email, show initials fallback
    return (
      <div
        className="flex items-center justify-center rounded-full ring-2 ring-white relative shrink-0 bg-gray-200 text-gray-600 font-semibold"
        style={{
          width: width,
          height: height,
          fontSize: `calc(${width} / 2.5)`,
        }}
        title={titleText}
      >
        {getInitials(email, name)}
      </div>
    );
  }

  if (isError || !imageUrl) {
    // Show initials fallback instead of the fallback image
    return (
      <div
        className="flex items-center justify-center rounded-full ring-2 ring-white relative shrink-0 bg-gray-200 text-gray-600 font-semibold"
        style={{
          width: width,
          height: height,
          fontSize: `calc(${width} / 2.5)`,
        }}
        title={titleText}
      >
        {getInitials(email, name)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      className="rounded-full ring-2 ring-white relative flex shrink-0 hover:z-10"
      style={{ width: width, height: height }}
      alt="Avatar"
      title={titleText}
      loading="lazy"
      decoding="async"
    />
  );
}

function CustomAvatarGroup({
  emails = [],
  names = [],
  maxVisible = 3,
  dates = [],
  width = '30px',
  height = '30px',
  showOnHover = 'email',
}) {
  const items = emails.length > 0 ? emails : names;
  const visibleItems = items.slice(0, maxVisible);
  const extraCount = items.length - maxVisible;

  return (
    <div className="flex items-center -space-x-2">
      {visibleItems.map((item, index) => {
        const email = emails[index];
        const name = names[index];
        return (
          <Avatar
            width={width}
            height={height}
            key={index}
            email={email}
            name={name}
            dates={dates}
            showOnHover={showOnHover}
          />
        );
      })}

      {extraCount > 0 && (
        <div
          className="flex items-center cursor-default justify-center relative shrink-0 rounded-full ring-2 ring-white hover:z-10 font-semibold leading-none text-white bg-green-500"
          style={{
            width: width,
            height: height,
            fontSize: `calc(30px / 2.8)`,
          }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}

export { CustomAvatarGroup };
