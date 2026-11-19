import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';


const useThemeLoader = () => {
  const { theme } = useTheme();
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState(theme);

  useEffect(() => {
    const getSystemTheme = () => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const updateTheme = () => {
      const finalTheme = theme === 'system' ? getSystemTheme() : theme;
      setResolvedTheme(finalTheme);

      // Load corresponding CSS
      const loadTheme = async () => {
        if (finalTheme === 'dark') {
          await import('@milkdown/crepe/theme/nord-dark.css');
        } else {
          await import('@milkdown/crepe/theme/frame.css');
        }
        setThemeLoaded(true);
      };

      loadTheme();
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return { themeLoaded, resolvedTheme };
};

export default useThemeLoader;