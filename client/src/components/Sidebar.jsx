// client/src/components/Sidebar.jsx
import FolderIcon from './icons/FolderIcon';
import ListIcon from './icons/ListIcon';
import MonitorIcon from './icons/MonitorIcon';

const VIEWS = [
  { id: 'closets', label: 'Closets', Icon: FolderIcon },
  { id: 'clothes', label: 'Clothes', Icon: ListIcon },
  { id: 'laundry', label: 'Laundry', Icon: MonitorIcon },
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
              <view.Icon />
              {view.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sidebar;
