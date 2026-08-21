// client/src/screens/ClosetsScreen.jsx
import { useClosets } from '../hooks/useClosets';
import { useActiveCloset } from '../hooks/useActiveCloset';
import ClosetCard from '../components/ClosetCard';
import AddableGrid from '../components/AddableGrid';

function ClosetsScreen({ onNavigateToClosetDetail, onNavigateToClosetCreate }) {
  const { closets, loading, error } = useClosets();
  const { setActiveCloset } = useActiveCloset();

  function handleSelect(closet) {
    setActiveCloset(closet);
    onNavigateToClosetDetail();
  }

  return (
    <section id="closets">
      {loading && <p>Loading closets...</p>}
      {error && <p>Error: {error}</p>}

      <AddableGrid
        items={closets}
        renderItem={(closet) => (
          <ClosetCard key={closet._id} closet={closet} onClick={() => handleSelect(closet)} />
        )}
        addLabel="Add closet"
        onAddClick={onNavigateToClosetCreate}
      />
    </section>
  );
}

export default ClosetsScreen;
