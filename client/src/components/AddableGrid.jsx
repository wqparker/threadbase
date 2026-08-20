// client/src/components/AddableGrid.jsx
// Shared shell: a .item-grid of items with a trailing tile that's either
// an "Add X" button or, when toggled open, a form spanning the full grid
// width. Used identically by ItemList and ClosetsScreen.
import PlusIcon from './icons/PlusIcon';

function AddableGrid({ items, renderItem, showForm, form, addLabel, onAddClick }) {
  return (
    <div className="item-grid">
      {items.map(renderItem)}

      {showForm ? (
        <div className="item-grid-full-row">{form}</div>
      ) : (
        <button type="button" className="item-card add-item-card" onClick={onAddClick}>
          <span className="add-item-circle">
            <PlusIcon />
          </span>
          {addLabel}
        </button>
      )}
    </div>
  );
}

export default AddableGrid;
