// client/src/components/TopBar.jsx
// The green app-shell bar: a hamburger icon that shows/hides the sidebar,
// a centered title for whichever screen is active, and a light/dark theme
// toggle. App.jsx computes `title` per view, owns sidebar-open state, and
// owns theme state via useTheme().
import HamburgerIcon from './icons/HamburgerIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

function TopBar({ title, sidebarOpen, onToggleSidebar, effectiveTheme, onToggleTheme }) {
  const isDark = effectiveTheme === 'dark';

  return (
    <header id="topbar">
      <button
        type="button"
        id="topbar-toggle"
        className="topbar-icon-button"
        aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        aria-expanded={sidebarOpen}
        onClick={onToggleSidebar}
      >
        <HamburgerIcon />
      </button>
      <h1>{title}</h1>
      <button
        type="button"
        id="topbar-theme-toggle"
        className="topbar-icon-button"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={onToggleTheme}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}

export default TopBar;
