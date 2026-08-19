import { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ClosetsScreen from './screens/ClosetsScreen';
import ClosetDetailScreen from './screens/ClosetDetailScreen';
import ClothesScreen from './screens/ClothesScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import LaundryScreen from './screens/LaundryScreen';
import { ActiveClosetProvider } from './context/ActiveClosetProvider';
import { ActiveItemProvider } from './context/ActiveItemProvider';
import { useActiveCloset } from './hooks/useActiveCloset';
import './App.css';

// Collapses a detail view back onto its parent nav item so the sidebar
// highlights the section it belongs to, not the detail view itself.
function toSidebarView(view) {
  if (view === 'closetDetail') return 'closets';
  return view;
}

function AppContent() {
  const [view, setView] = useState('closets');
  const [itemDetailOrigin, setItemDetailOrigin] = useState(null);
  const { activeCloset } = useActiveCloset();

  function navigateToItemDetail() {
    setItemDetailOrigin(view);
    setView('itemDetail');
  }

  function navigateBackFromItemDetail() {
    setView(itemDetailOrigin || 'clothes');
  }

  // itemDetail is reachable from two origins (closetDetail or clothes), so
  // it resolves to its origin's own sidebar view/title rather than a fixed
  // one - the TopBar keeps showing "wherever you came from" while
  // ItemDetailScreen shows its own item-specific heading below it.
  const effectiveView = view === 'itemDetail' ? itemDetailOrigin || 'clothes' : view;
  const sidebarView = toSidebarView(effectiveView);

  const titles = {
    closets: 'Closets',
    closetDetail: activeCloset ? activeCloset.name : 'Closets',
    clothes: 'Clothes',
    laundry: 'Laundry',
  };

  return (
    <>
      <TopBar title={titles[effectiveView] ?? ''} />
      <div id="app-body">
        <Sidebar currentView={sidebarView} onNavigate={setView} />
        <main id="app-main">
          {view === 'closets' && (
            <ClosetsScreen onNavigateToClosetDetail={() => setView('closetDetail')} />
          )}
          {view === 'closetDetail' && (
            <ClosetDetailScreen onNavigateToItemDetail={navigateToItemDetail} />
          )}
          {view === 'clothes' && <ClothesScreen onNavigateToItemDetail={navigateToItemDetail} />}
          {view === 'itemDetail' && <ItemDetailScreen onBack={navigateBackFromItemDetail} />}
          {view === 'laundry' && <LaundryScreen />}
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <ActiveClosetProvider>
      <ActiveItemProvider>
        <AppContent />
      </ActiveItemProvider>
    </ActiveClosetProvider>
  );
}

export default App;
