// client/src/screens/ClosetDetailScreen.jsx
// Reached by selecting a closet in ClosetsScreen - owns Edit/Delete for the
// closet itself (mirrors ItemDetailScreen) plus the item grid, scoped by
// closetId via ItemList. Calls closetService directly rather than going
// through useClosets/useCrudResource: this screen isn't a list, and
// ClosetsScreen fully unmounts and refetches fresh on return, so there's
// no cache here to keep in sync. Renders no own heading - App.jsx already
// shows the closet name as the TopBar title for this view.
import { useState } from 'react';
import { useActiveCloset } from '../hooks/useActiveCloset';
import { updateCloset, deleteCloset } from '../services/closetService';
import ItemList from '../components/ItemList';
import ClosetForm from '../components/ClosetForm';
import EditIcon from '../components/icons/EditIcon';
import DeleteIcon from '../components/icons/DeleteIcon';

function ClosetDetailScreen({ onNavigateToItemDetail, onBack }) {
  const { activeCloset, setActiveCloset } = useActiveCloset();
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState(null);

  if (!activeCloset) {
    return (
      <section id="closet-detail">
        <p>No closet selected - go to Closets and pick one.</p>
      </section>
    );
  }

  function startEditing() {
    setEditValues({ name: activeCloset.name, description: activeCloset.description || '' });
    setIsEditing(true);
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editValues.name.trim()) return;
    const updated = await updateCloset(activeCloset._id, editValues);
    setActiveCloset(updated);
    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteCloset(activeCloset._id);
    setActiveCloset(null);
    onBack();
  }

  return (
    <section id="closet-detail">
      {isEditing ? (
        <ClosetForm
          values={editValues}
          onChange={setEditValues}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save"
        />
      ) : (
        <>
          <dl className="field-list">
            <dt>Description</dt>
            <dd>{activeCloset.description || '—'}</dd>
          </dl>
          <button type="button" className="icon-button" onClick={startEditing}>
            <EditIcon />
            Edit
          </button>
          <button type="button" className="icon-button" onClick={handleDelete}>
            <DeleteIcon />
            Delete
          </button>
        </>
      )}

      <ItemList closetId={activeCloset._id} onNavigateToItemDetail={onNavigateToItemDetail} />
    </section>
  );
}

export default ClosetDetailScreen;
