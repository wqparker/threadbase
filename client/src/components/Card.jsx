// client/src/components/Card.jsx
// Shared bordered .item-card shell: a button when onClick is passed
// (interactive, used in grids), a plain div otherwise (static display).
// Used by ItemCard and ClosetCard so this branching only lives once.
function Card({ onClick, children }) {
  if (!onClick) {
    return <div className="item-card">{children}</div>;
  }
  return (
    <button type="button" className="item-card" onClick={onClick}>
      {children}
    </button>
  );
}

export default Card;
