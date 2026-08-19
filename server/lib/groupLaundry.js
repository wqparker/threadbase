// server/lib/groupLaundry.js
// Pure function, no DB/Express dependency. Divides the wardrobe's dirty
// items into suggested wash loads, grouped by exact match on wash
// temperature, colour category, and delicate handling.

// careInstructions.washTemp has no schema default and can be undefined —
// fall back to 'cold', the least aggressive temperature, so an item with
// unset wash data never ends up in a hotter load than it can safely handle.
function groupKey(item) {
  const washTemp = item.careInstructions?.washTemp || 'cold';
  const delicate = Boolean(item.careInstructions?.delicate);
  return { washTemp, colourCategory: item.colourCategory, delicate };
}

function describeGroup({ washTemp, colourCategory, delicate }) {
  return `${washTemp} wash, ${colourCategory}, ${delicate ? 'delicate' : 'non-delicate'}`;
}

function groupLaundry(items) {
  const dirtyItems = items.filter((item) => item.wearStatus === 'dirty');

  const groups = new Map();
  for (const item of dirtyItems) {
    const criteria = describeGroup(groupKey(item));
    if (!groups.has(criteria)) {
      groups.set(criteria, []);
    }
    groups.get(criteria).push(item);
  }

  return Array.from(groups, ([criteria, groupItems]) => ({
    criteria,
    items: groupItems,
  }));
}

module.exports = groupLaundry;
