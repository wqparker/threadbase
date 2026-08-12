// client/src/screens/ClosetDetailScreen.jsx
// Reached by selecting a closet in ClosetsScreen - shows just that
// closet's items, scoped by closetId via ItemList.
import { useActiveCloset } from '../hooks/useActiveCloset';
import ItemList from '../components/ItemList';

function ClosetDetailScreen() {
  const { activeCloset } = useActiveCloset();

  if (!activeCloset) {
    return (
      <section id="closet-detail">
        <p>No closet selected - go to Closets and pick one.</p>
      </section>
    );
  }

  return (
    <section id="closet-detail">
      <h1>{activeCloset.name}</h1>
      <ItemList closetId={activeCloset._id} />
    </section>
  );
}

export default ClosetDetailScreen;
