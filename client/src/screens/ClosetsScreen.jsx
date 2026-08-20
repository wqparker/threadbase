// client/src/screens/ClosetsScreen.jsx
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';
import { useActiveCloset } from '../hooks/useActiveCloset';
import ClosetForm from '../components/ClosetForm';
import ClosetCard from '../components/ClosetCard';
import PlusIcon from '../components/icons/PlusIcon';

const EMPTY_FORM = { name: '', description: '' };

function ClosetsScreen({ onNavigateToClosetDetail }) {
  const { closets, loading, error, addCloset } = useClosets();
  const { setActiveCloset } = useActiveCloset();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formValues, setFormValues] = useState(EMPTY_FORM);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValues.name.trim()) return;
    await addCloset(formValues);
    setFormValues(EMPTY_FORM);
    setShowCreateForm(false);
  }

  function handleSelect(closet) {
    setActiveCloset(closet);
    onNavigateToClosetDetail();
  }

  return (
    <section id="closets">
      {loading && <p>Loading closets...</p>}
      {error && <p>Error: {error}</p>}

      <div className="item-grid">
        {closets.map((closet) => (
          <ClosetCard key={closet._id} closet={closet} onClick={() => handleSelect(closet)} />
        ))}

        {showCreateForm ? (
          <div className="item-grid-full-row">
            <ClosetForm
              values={formValues}
              onChange={setFormValues}
              onSubmit={handleSubmit}
              onCancel={() => {
                setFormValues(EMPTY_FORM);
                setShowCreateForm(false);
              }}
              submitLabel="Add closet"
            />
          </div>
        ) : (
          <button
            type="button"
            className="item-card add-item-card"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="add-item-circle">
              <PlusIcon />
            </span>
            Add closet
          </button>
        )}
      </div>
    </section>
  );
}

export default ClosetsScreen;
