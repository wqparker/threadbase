// client/src/screens/ClothesScreen.jsx
// Global, unfiltered view of every item regardless of closet assignment.
import ItemList from '../components/ItemList';

function ClothesScreen({ onNavigateToItemDetail, onNavigateToItemCreate }) {
  return (
    <section id="clothes">
      <ItemList
        onNavigateToItemDetail={onNavigateToItemDetail}
        onNavigateToItemCreate={onNavigateToItemCreate}
      />
    </section>
  );
}

export default ClothesScreen;
