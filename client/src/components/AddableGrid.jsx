// client/src/components/AddableGrid.jsx
// Shared shell: a .item-grid of items with a trailing "Add X" tile that
// navigates elsewhere on click. Used identically by ItemList and
// ClosetsScreen.
import PlusIcon from './icons/PlusIcon';

function AddableGrid({ items, renderItem, addLabel, onAddClick }) {
  return (
    <div className="item-grid">
      {items.map(renderItem)}

      <button type="button" className="item-card add-item-card" onClick={onAddClick}>
        <span className="add-item-circle">
          <PlusIcon />
        </span>
        {addLabel}
      </button>
    </div>
  );
}

export default AddableGrid;
