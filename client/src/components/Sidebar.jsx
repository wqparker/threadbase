// client/src/components/Sidebar.jsx
const VIEWS = [
  { id: 'closets', label: 'Closets' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'laundry', label: 'Laundry' },
];

function Sidebar({ currentView, onNavigate }) {
  return (
    <nav id="sidebar">
      <ul>
        {VIEWS.map((view) => (
          <li key={view.id}>
            <button
              type="button"
              aria-current={currentView === view.id ? 'page' : undefined}
              onClick={() => onNavigate(view.id)}
            >
              {view.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
