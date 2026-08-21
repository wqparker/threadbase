import { useState } from 'react';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ClosetsScreen from './screens/ClosetsScreen';
import ClosetCreateScreen from './screens/ClosetCreateScreen';
import ClosetDetailScreen from './screens/ClosetDetailScreen';
import ClothesScreen from './screens/ClothesScreen';
import ItemCreateScreen from './screens/ItemCreateScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import LaundryScreen from './screens/LaundryScreen';
import { ActiveClosetProvider } from './context/ActiveClosetProvider';
import { ActiveItemProvider } from './context/ActiveItemProvider';
import { useActiveCloset } from './hooks/useActiveCloset';
import { useTheme } from './hooks/useTheme';
import './App.css';

// Collapses a detail view back onto its parent nav item so the sidebar
// highlights the section it belongs to, not the detail view itself.
function toSidebarView(view) {
  if (view === 'closetDetail' || view === 'closetCreate') return 'closets';
  return view;
}

function AppContent() {
  const [view, setView] = useState('closets');
  const [itemDetailOrigin, setItemDetailOrigin] = useState(null);
  const [itemCreateOrigin, setItemCreateOrigin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { activeCloset } = useActiveCloset();
  const { effectiveTheme, toggleTheme } = useTheme();

  function navigateToItemDetail() {
    setItemDetailOrigin(view);
    setView('itemDetail');
  }

  function navigateBackFromItemDetail() {
    setView(itemDetailOrigin || 'clothes');
  }

  function navigateToItemCreate() {
    setItemCreateOrigin(view);
    setView('itemCreate');
  }

  function navigateBackFromItemCreate() {
    setView(itemCreateOrigin || 'clothes');
  }

  // itemDetail/itemCreate are each reachable from two origins (closetDetail
  // or clothes), so the sidebar resolves to its origin's own nav highlight
  // rather than a fixed one. The TopBar title does not follow suit though -
  // it's blank on these views (see `title` below) rather than showing
  // "wherever you came from", since those screens show their own heading
  // (or, for creation, none at all - the form's own title input serves
  // that role).
  const origin = view === 'itemDetail' ? itemDetailOrigin : view === 'itemCreate' ? itemCreateOrigin : null;
  const effectiveView = origin || view;
  const sidebarView = toSidebarView(effectiveView);

  const titles = {
    closets: 'Closets',
    closetDetail: activeCloset ? activeCloset.name : 'Closets',
    clothes: 'Clothes',
    laundry: 'Laundry',
  };
  const title = ['itemDetail', 'itemCreate', 'closetCreate'].includes(view) ? '' : titles[view] ?? '';

  return (
    <>
      <TopBar
        title={title}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        effectiveTheme={effectiveTheme}
        onToggleTheme={toggleTheme}
      />
      <div id="app-body">
        {sidebarOpen && <Sidebar currentView={sidebarView} onNavigate={setView} />}
        <main id="app-main">
          {view === 'closets' && (
            <ClosetsScreen
              onNavigateToClosetDetail={() => setView('closetDetail')}
              onNavigateToClosetCreate={() => setView('closetCreate')}
            />
          )}
          {view === 'closetCreate' && <ClosetCreateScreen onBack={() => setView('closets')} />}
          {view === 'closetDetail' && (
            <ClosetDetailScreen
              onNavigateToItemDetail={navigateToItemDetail}
              onNavigateToItemCreate={navigateToItemCreate}
              onBack={() => setView('closets')}
            />
          )}
          {view === 'clothes' && (
            <ClothesScreen
              onNavigateToItemDetail={navigateToItemDetail}
              onNavigateToItemCreate={navigateToItemCreate}
            />
          )}
          {view === 'itemDetail' && <ItemDetailScreen onBack={navigateBackFromItemDetail} />}
          {view === 'itemCreate' && (
            <ItemCreateScreen
              closetId={itemCreateOrigin === 'closetDetail' ? activeCloset?._id : null}
              onBack={navigateBackFromItemCreate}
            />
          )}
          {view === 'laundry' && <LaundryScreen onNavigateToItemDetail={navigateToItemDetail} />}
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
