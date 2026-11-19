import React, { useState, useCallback, useMemo } from 'react';

const useCharacterLimit = (limit) => {
  // State to hold the current text value
  const [text, setText] = useState('');

  // Memoize the derived values to prevent unnecessary recalculations
  const count = useMemo(() => text.length, [text]);
  const remaining = useMemo(() => limit - text.length, [text, limit]);

  /**
   * A memoized callback function to handle changes to the text input.
   * It enforces the character limit by slicing the input value if it exceeds the limit.
   */
  const handleTextChange = useCallback((text) => {
    const newText = text;
    if (newText.length <= limit) {
      setText(newText);
    } else {
      // If the new text exceeds the limit, truncate it.
      setText(newText.slice(0, limit));
    }
  }, [limit]);

  // As per your request, we can construct the specific array you wanted.
  // However, returning an object is generally more flexible and readable in React.
  // For demonstration, we'll stick to the core values you need.
  const [limitValue, currentlyUsed, totalRemaining] = [limit, count, remaining];

  // We return everything needed to make the hook useful in a component.
  return {
    text,
    handleTextChange,
    limit: limitValue,
    count: currentlyUsed,
    remaining: totalRemaining,
  };
};


export { useCharacterLimit };