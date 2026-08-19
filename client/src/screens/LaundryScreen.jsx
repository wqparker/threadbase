// client/src/screens/LaundryScreen.jsx
import { useItems } from '../hooks/useItems';
import { useLaundryLoads } from '../hooks/useLaundryLoads';
import ItemCard from '../components/ItemCard';

function LaundryScreen() {
  const { items, loading: itemsLoading, error: itemsError } = useItems();
  const { loads, loading, error, generateLoads } = useLaundryLoads();

  const dirtyItems = items.filter((item) => item.wearStatus === 'dirty');

  return (
    <section id="laundry">
      <h1>Laundry</h1>

      <button type="button" onClick={generateLoads} disabled={loading}>
        {loading ? 'Generating...' : "Generate today's laundry loads"}
      </button>

      {error && <p>Error: {error}</p>}
      {!loading && !error && loads.length === 0 && <p>No loads generated yet.</p>}

      {loads.map((load) => (
        <div key={load._id} className="laundry-load">
          <h2>{load.criteria}</h2>
          <div className="item-grid">
            {load.items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      ))}

      <h2>Dirty clothes</h2>
      {itemsLoading && <p>Loading items...</p>}
      {itemsError && <p>Error: {itemsError}</p>}
      {!itemsLoading && !itemsError && dirtyItems.length === 0 && <p>Nothing dirty right now.</p>}
      <div className="item-grid">
        {dirtyItems.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default LaundryScreen;
