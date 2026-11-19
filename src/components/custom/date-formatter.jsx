import React from 'react';

function extractDateValue(date) {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date === 'object') {
    return (
      date.createdAt ||
      date.updatedAt ||
      date.created_at ||
      date.updated_at ||
      date.scheduled_at ||
      date.scheduled_date ||
      date.date ||
      date.timestamp ||
      null
    );
  }
  return date;
}

function getRelativeTime(date, fallback = 'N/A') {
  const dateVal = extractDateValue(date);
  if (!dateVal) return fallback;

  const now = new Date();
  const target = new Date(dateVal);
  if (isNaN(target.getTime())) {
    return typeof dateVal === 'string' || typeof dateVal === 'number'
      ? String(dateVal)
      : fallback;
  }
  const diffInSeconds = Math.floor((now - target) / 1000);
  const isFuture = diffInSeconds < 0;
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) {
    return 'just now';
  }

  const units = [
    { max: 3600, value: 60, name: 'minute' },
    { max: 86400, value: 3600, name: 'hour' },
    { max: 604800, value: 86400, name: 'day' },
    { max: Infinity, value: 604800, name: 'week' },
  ];

  for (let unit of units) {
    if (absDiff < unit.max) {
      const value = Math.floor(absDiff / unit.value);
      return isFuture
        ? `in ${value} ${unit.name}${value !== 1 ? 's' : ''}`
        : `${value} ${unit.name}${value !== 1 ? 's' : ''} ago`;
    }
  }
}

const DateFormatter = ({
  date,
  className,
  mode = "relative", // relative | formatted | long | short
  fallback = "N/A"
}) => {
  const dateVal = extractDateValue(date);
  if (!dateVal) return <span className={className || ''}>{fallback}</span>;

  const dateObj = new Date(dateVal);
  if (isNaN(dateObj.getTime())) {
    return <span className={className || ''}>{fallback}</span>;
  }

  const formattedDate = dateObj.toLocaleDateString('en-GB');
  // 11/07/2024

  const longDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  // 10 Jan 2024

  const shortDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
  // Mar 08

  return (
    <span
      title={dateObj.toLocaleString()}
      className={className || ''}
    >
      {mode === "formatted"
        ? formattedDate
        : mode === "long"
          ? longDate
          : mode === "short"
            ? shortDate
            : getRelativeTime(dateVal, fallback)}
    </span>
  );
};

export { DateFormatter };
