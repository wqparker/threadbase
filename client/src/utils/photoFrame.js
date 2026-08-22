// client/src/utils/photoFrame.js
// Shared pan/zoom transform for item photos - keeps ItemCard, ItemDetailScreen,
// and ItemFieldsForm's preview all reading the same three fields the same way.
export function getPhotoTransform({ photoScale = 1, photoOffsetX = 0, photoOffsetY = 0 } = {}) {
  return {
    transform: `translate(-50%, -50%) translate(${photoOffsetX}%, ${photoOffsetY}%) scale(${photoScale})`,
  };
}
