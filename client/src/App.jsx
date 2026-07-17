import { useState } from 'react';
import ClosetsScreen from './screens/ClosetsScreen';
import ClothesScreen from './screens/ClothesScreen';
import './App.css';

function App() {
  const [selectedCloset, setSelectedCloset] = useState(null);

  if (selectedCloset) {
    return <ClothesScreen closet={selectedCloset} onBack={() => setSelectedCloset(null)} />;
  }

  return <ClosetsScreen onSelectCloset={setSelectedCloset} />;
}

export default App;
