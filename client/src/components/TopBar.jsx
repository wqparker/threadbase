// client/src/components/TopBar.jsx
// The green app-shell bar: a hamburger icon (static for now - not wired to
// collapse the sidebar yet, that's a follow-up) and a centered title for
// whichever screen is active. App.jsx computes `title` per view.
import HamburgerIcon from './icons/HamburgerIcon';

function TopBar({ title }) {
  return (
    <header id="topbar">
      <button type="button" id="topbar-toggle" aria-label="Toggle sidebar">
        <HamburgerIcon />
      </button>
      <h1>{title}</h1>
    </header>
  );
}

export default TopBar;
