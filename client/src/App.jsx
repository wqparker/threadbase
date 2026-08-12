import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ClosetsScreen from './screens/ClosetsScreen';
import ClothesScreen from './screens/ClothesScreen';
import LaundryScreen from './screens/LaundryScreen';
import { ActiveClosetProvider } from './context/ActiveClosetProvider';
import './App.css';

function App() {
  const [view, setView] = useState('closets');

  return (
    <ActiveClosetProvider>
      <Sidebar currentView={view} onNavigate={setView} />
      {view === 'closets' && <ClosetsScreen onNavigateToClothes={() => setView('clothes')} />}
      {view === 'clothes' && <ClothesScreen />}
      {view === 'laundry' && <LaundryScreen />}
    </ActiveClosetProvider>
  );
}

export default App;
