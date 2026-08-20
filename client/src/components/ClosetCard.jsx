// client/src/components/ClosetCard.jsx
// Read-only closet card: icon + name. Pass onClick to make it interactive
// (a button, used by ClosetsScreen's grid); omit it for a static card.
import ClosetIcon from '../assets/itemIcons/Closet Icon.svg?react';

function ClosetCard({ closet, onClick }) {
  const content = (
    <>
      <ClosetIcon />
      <p>{closet.name}</p>
    </>
  );

  if (!onClick) {
    return <div className="item-card">{content}</div>;
  }

  return (
    <button type="button" className="item-card" onClick={onClick}>
      {content}
    </button>
  );
}

export default ClosetCard;
