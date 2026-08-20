// client/src/components/icons/Icon.jsx
// Shared 24x24 stroke-icon wrapper (fill none, currentColor stroke, round
// caps/joins) for the remaining hand-coded icons. Illustrator-exported
// icons don't use this - they're imported directly via the svgr pipeline
// (see vite.config.js) and carry their own viewBox/attributes.
function Icon({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export default Icon;
