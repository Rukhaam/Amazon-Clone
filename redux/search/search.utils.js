// 1. NEW: Helper to clean Firebase data before sending to Redux
export const sanitizeProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products.map((item) => {
    // Create a shallow copy to avoid mutating the original
    const newItem = { ...item };

    // Convert 'createdAt' to string if it's a Timestamp
    if (newItem.createdAt && typeof newItem.createdAt.toDate === "function") {
      newItem.createdAt = newItem.createdAt.toDate().toISOString();
    }

    // Convert 'updatedAt' to string if it's a Timestamp
    if (newItem.updatedAt && typeof newItem.updatedAt.toDate === "function") {
      newItem.updatedAt = newItem.updatedAt.toDate().toISOString();
    }

    return newItem;
  });
};

// 2. Existing Filter Logic (Added safety checks ?.)
export const filterProducts = (products, query) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (item) =>
      (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
      (item.description &&
        item.description.toLowerCase().includes(lowerQuery)) ||
      (item.category && item.category.toLowerCase().includes(lowerQuery))
  );
};

// 3. Existing Suggestions Logic
export const getSuggestions = (products, query) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();

  return products
    .filter(
      (item) => item.title && item.title.toLowerCase().includes(lowerQuery)
    )
    .map((item) => item.title)
    .slice(0, 10); // Limit to top 10
};
