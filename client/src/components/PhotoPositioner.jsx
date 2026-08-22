// client/src/components/PhotoPositioner.jsx
// Draggable pan + zoom control for reframing an item photo within its
// display frame, used inside ItemFieldsForm's edit mode. Read-only display
// elsewhere (ItemCard, ItemDetailScreen) renders the same photoScale/
// photoOffsetX/photoOffsetY fields as a plain transform - see photoFrame.js.
import { useRef } from 'react';
import { getPhotoTransform } from '../utils/photoFrame';

// Keeps a dragged-out photo from disappearing entirely off-frame.
const OFFSET_LIMIT = 50;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function PhotoPositioner({ src, alt, photoScale, photoOffsetX, photoOffsetY, onChange, frameClassName }) {
  const imgRef = useRef(null);
  const dragRef = useRef(null);

  function handlePointerDown(e) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: photoOffsetX,
      startOffsetY: photoOffsetY,
      // % in transform is relative to the img's own (untransformed) box.
      width: imgRef.current.offsetWidth,
      height: imgRef.current.offsetHeight,
    };
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const { startX, startY, startOffsetX, startOffsetY, width, height } = dragRef.current;
    const deltaXPct = ((e.clientX - startX) / width) * 100;
    const deltaYPct = ((e.clientY - startY) / height) * 100;
    onChange({
      photoOffsetX: clamp(startOffsetX + deltaXPct, -OFFSET_LIMIT, OFFSET_LIMIT),
      photoOffsetY: clamp(startOffsetY + deltaYPct, -OFFSET_LIMIT, OFFSET_LIMIT),
    });
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <>
      <div
        className={`photo-frame photo-frame--editable ${frameClassName || ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          style={getPhotoTransform({ photoScale, photoOffsetX, photoOffsetY })}
        />
      </div>
      <input
        className="photo-zoom"
        type="range"
        min="1"
        max="3"
        step="0.1"
        value={photoScale}
        aria-label="Photo zoom"
        onChange={(e) => onChange({ photoScale: Number(e.target.value) })}
      />
    </>
  );
}

export default PhotoPositioner;
