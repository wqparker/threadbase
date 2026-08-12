import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ClosetsScreen from './screens/ClosetsScreen';
import ClosetDetailScreen from './screens/ClosetDetailScreen';
import ClothesScreen from './screens/ClothesScreen';
import LaundryScreen from './screens/LaundryScreen';
import { ActiveClosetProvider } from './context/ActiveClosetProvider';
import './App.css';

function App() {
  const [view, setView] = useState('closets');
  const sidebarView = view === 'closetDetail' ? 'closets' : view;

  return (
    <ActiveClosetProvider>
      <Sidebar currentView={sidebarView} onNavigate={setView} />
      {view === 'closets' && (
        <ClosetsScreen onNavigateToClosetDetail={() => setView('closetDetail')} />
      )}
      {view === 'closetDetail' && <ClosetDetailScreen />}
      {view === 'clothes' && <ClothesScreen />}
      {view === 'laundry' && <LaundryScreen />}
    </ActiveClosetProvider>
  );
}

export default App;
