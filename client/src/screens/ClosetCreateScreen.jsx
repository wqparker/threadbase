// client/src/screens/ClosetCreateScreen.jsx
// Reached by clicking "Add closet" in ClosetsScreen - same visual shell
// as ClosetDetailScreen (Back button, ClosetForm) but for creating a new
// closet. Calls closetService directly rather than going through
// useClosets/useCrudResource, matching ClosetDetailScreen's existing
// convention for mutations reached via full navigation.
import { useState } from 'react';
import { createCloset } from '../services/closetService';
import ClosetForm from '../components/ClosetForm';
import BackIcon from '../components/icons/BackIcon';

const EMPTY_FORM = { name: '', description: '' };

function ClosetCreateScreen({ onBack }) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formValues.name.trim()) return;
    await createCloset(formValues);
    onBack();
  }

  return (
    <section id="closet-detail">
      <button type="button" className="icon-button" onClick={onBack}>
        <BackIcon />
        Back
      </button>

      <ClosetForm
        values={formValues}
        onChange={setFormValues}
        onSubmit={handleSubmit}
        submitLabel="Add closet"
      />
    </section>
  );
}

export default ClosetCreateScreen;
