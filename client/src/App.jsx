import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ClosetsScreen from './screens/ClosetsScreen';
import ClosetDetailScreen from './screens/ClosetDetailScreen';
import ClothesScreen from './screens/ClothesScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import LaundryScreen from './screens/LaundryScreen';
import { ActiveClosetProvider } from './context/ActiveClosetProvider';
import { ActiveItemProvider } from './context/ActiveItemProvider';
import './App.css';

// Collapses a detail view back onto its parent nav item so the sidebar
// highlights the section it belongs to, not the detail view itself.
function toSidebarView(view) {
  if (view === 'closetDetail') return 'closets';
  return view;
}

function App() {
  const [view, setView] = useState('closets');
  const [itemDetailOrigin, setItemDetailOrigin] = useState(null);

  function navigateToItemDetail() {
    setItemDetailOrigin(view);
    setView('itemDetail');
  }

  function navigateBackFromItemDetail() {
    setView(itemDetailOrigin || 'clothes');
  }

  // itemDetail is reachable from two origins (closetDetail or clothes), so
  // it resolves to its origin's own sidebar view rather than a fixed one.
  const effectiveView = view === 'itemDetail' ? itemDetailOrigin || 'clothes' : view;
  const sidebarView = toSidebarView(effectiveView);

  return (
    <ActiveClosetProvider>
      <ActiveItemProvider>
        <Sidebar currentView={sidebarView} onNavigate={setView} />
        {view === 'closets' && (
          <ClosetsScreen onNavigateToClosetDetail={() => setView('closetDetail')} />
        )}
        {view === 'closetDetail' && (
          <ClosetDetailScreen onNavigateToItemDetail={navigateToItemDetail} />
        )}
        {view === 'clothes' && <ClothesScreen onNavigateToItemDetail={navigateToItemDetail} />}
        {view === 'itemDetail' && <ItemDetailScreen onBack={navigateBackFromItemDetail} />}
        {view === 'laundry' && <LaundryScreen />}
      </ActiveItemProvider>
    </ActiveClosetProvider>
  );
}

export default App;
