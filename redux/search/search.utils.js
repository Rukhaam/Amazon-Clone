export const filterProducts = (products, query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
  
    return products.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  };
  
  export const getSuggestions = (products, query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
  
    return products
      .filter((item) => item.title.toLowerCase().includes(lowerQuery))
      .map((item) => item.title)
      .slice(0, 10); // Limit to top 10
  };