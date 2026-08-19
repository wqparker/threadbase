// client/src/screens/LaundryScreen.jsx
import { useLaundryLoads } from '../hooks/useLaundryLoads';
import { getItemDisplayName, getItemIcon } from '../utils/itemDisplay';

function LaundryScreen() {
  const { loads, loading, error, generateLoads } = useLaundryLoads();

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
              <div key={item._id} className="item-card">
                <img src={item.photoUrl || getItemIcon()} alt={getItemDisplayName(item)} />
                <p>{getItemDisplayName(item)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default LaundryScreen;
