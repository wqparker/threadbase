// client/src/screens/ClosetsScreen.jsx
import { useState } from 'react';
import { useClosets } from '../hooks/useClosets';
import { useActiveCloset } from '../hooks/useActiveCloset';
import ClosetForm from '../components/ClosetForm';
import ClosetCard from '../components/ClosetCard';
import AddableGrid from '../components/AddableGrid';

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

      <AddableGrid
        items={closets}
        renderItem={(closet) => (
          <ClosetCard key={closet._id} closet={closet} onClick={() => handleSelect(closet)} />
        )}
        showForm={showCreateForm}
        form={
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
        }
        addLabel="Add closet"
        onAddClick={() => setShowCreateForm(true)}
      />
    </section>
  );
}

export default ClosetsScreen;
