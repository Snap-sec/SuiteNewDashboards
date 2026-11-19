import React, { useState, useRef, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useLazyGetOrgMembersQuery } from '../../../services/auth/orgApi';
import { Profile } from "@/components/custom/profile";

const mockFetchUsers = async (getUsers) => {
  const members = await getUsers({ search: "" }).unwrap();

  return members?.members?.map(member => ({
    id: member._id,
    username: member.name || member.firstName + '_' + member.lastName,
    email: member.email,
    avatar: <Profile email={member.email} />
  }));
};

const MentionsInput = ({
  defaultValue = "",
  placeholder = "Type @ to mention someone...",
  onSubmit = () => { },
  onEnter = null,
  className = "",
  apiEndpoint = null,
  fetchUsers = mockFetchUsers,
  maxSuggestions = 5,
  onPressEnter,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [mentions, setMentions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [mentionQuery, setMentionQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [getMembers] = useLazyGetOrgMembersQuery();

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    onSubmit(value, parseMentions(value));
  }, [value, mentions]);

  // Parse mentions from text
  const parseMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentionsFinal = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      let user = mentions.find(m => m.username == match[1]);
      mentionsFinal.push(user);
    }

    return mentionsFinal;
  };

  // Fetch suggestions
  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      let users;

      if (apiEndpoint) {
        const response = await fetch(`${apiEndpoint}?q=${encodeURIComponent(query)}`);
        users = await response.json();
      } else {
        const response = await getMembers({ search: query }).unwrap();
        users = response?.data?.members?.map(user => ({
          id: user.userId,
          username: user.name?.split(" ")?.join("_"),
          name: user.name,
          email: user.email,
          avatar: <Profile email={user.email} />
        }));
      }

      setSuggestions((users || []).slice(0, maxSuggestions));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle text input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;

    setValue(newValue);

    const beforeCursor = newValue.substring(0, cursorPosition);
    const lastAtIndex = beforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const afterAt = beforeCursor.substring(lastAtIndex + 1);
      const hasSpaceAfterAt = afterAt.includes(' ');

      if (!hasSpaceAfterAt) {
        setMentionStart(lastAtIndex);
        setMentionQuery(afterAt);
        setShowSuggestions(true);
        setSelectedIndex(0);
        fetchSuggestions(afterAt);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }

    autoResize();
  };

  // Auto-resize textarea
  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  // Select suggestion
  const selectSuggestion = (user) => {
    const before = value.substring(0, mentionStart);
    const after = value.substring(mentionStart + mentionQuery.length + 1);
    const newValue = before + `@${user.username} ` + after;

    let jsonOnly = { ...user };
    delete jsonOnly.avatar;

    setMentions(prev => [...prev, jsonOnly]);
    setValue(newValue);
    setShowSuggestions(false);
    setMentionStart(-1);
    setMentionQuery('');

    setTimeout(() => {
      inputRef.current?.focus();
      const newCursorPos = before.length + user.username.length + 2;
      inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      autoResize();
    }, 0);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onPressEnter?.();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        if (showSuggestions) {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : prev);
              break;
            case 'ArrowUp':
              e.preventDefault();
              setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
              break;
            case 'Enter':
              e.preventDefault();
              if (suggestions[selectedIndex]) {
                selectSuggestion(suggestions[selectedIndex]);
              }
              break;
            case 'Escape':
              setShowSuggestions(false);
              break;
          }
        } else {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (onEnter) {
              onEnter();
            }
          }
        }
    };
  }

  // Outside click closes suggestions
  useEffect(() => {
    const handleClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={`relative w-full ${showSuggestions ? 'z-[100]' : 'z-0'} ${className}`}>
      <Textarea
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-0 text-start px-2 py-0 pt-2  border rounded-lg resize-none overflow-hidden"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-[101] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user, index) => (
              <div
                key={user.id}
                onClick={() => selectSuggestion(user)}
                className={`flex items-center px-4 py-3 gap-1 cursor-pointer transition-colors duration-150 ${index === selectedIndex ? 'bg-secondary text-blue-700' : 'hover:bg-secondary'
                  }`}
              >
                <div className="flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                  {user.avatar || <User size={16} />}
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    @{user.name || user.username}
                  </div>
                  <div className="text-sm font-normal text-mono">
                    {user.email}
                  </div>
                </div>
              </div>
            ))
          ) : mentionQuery && !loading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              No users found for "{mentionQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MentionsInput;
