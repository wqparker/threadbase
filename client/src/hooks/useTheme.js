// client/src/hooks/useTheme.js
// Three states: 'system' (default - follows the OS/browser colour-scheme,
// nothing persisted), or an explicit 'light'/'dark' override, persisted to
// localStorage and applied via a data-theme attribute on <html> (see the
// [data-theme] rules in index.css). effectiveTheme resolves 'system'
// against the live matchMedia result, updating if the OS preference
// changes while unoverridden.
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'threadbase-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

export function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia(DARK_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY);
    function handleChange(e) {
      setSystemPrefersDark(e.matches);
    }
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const effectiveTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme;

  function toggleTheme() {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark');
  }

  return { effectiveTheme, toggleTheme };
}
