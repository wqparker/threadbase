// client/src/components/Sidebar.jsx
import ClosetIcon from './icons/ClosetIcon';
import ListIcon from './icons/ListIcon';
import WashingMachineIcon from './icons/WashingMachineIcon';

const VIEWS = [
  { id: 'closets', label: 'Closets', Icon: ClosetIcon },
  { id: 'clothes', label: 'Clothes', Icon: ListIcon },
  { id: 'laundry', label: 'Laundry', Icon: WashingMachineIcon },
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
