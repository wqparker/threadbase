// client/src/components/ClosetCard.jsx
// Read-only closet card: icon + name. Pass onClick to make it interactive
// (a button, used by ClosetsScreen's grid); omit it for a static card.
import Card from './Card';
import ClosetIcon from '../assets/itemIcons/Closet Icon.svg?react';

function ClosetCard({ closet, onClick }) {
  return (
    <Card onClick={onClick}>
      <ClosetIcon />
      <p>{closet.name}</p>
    </Card>
  );
}

export default ClosetCard;
