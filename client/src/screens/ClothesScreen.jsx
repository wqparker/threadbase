// client/src/screens/ClothesScreen.jsx
// Global, unfiltered view of every item regardless of closet assignment.
import ItemList from '../components/ItemList';

function ClothesScreen() {
  return (
    <section id="clothes">
      <h1>Clothes</h1>
      <ItemList />
    </section>
  );
}

export default ClothesScreen;
