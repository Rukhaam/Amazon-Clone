export const applyFilterAndSort = (products, filters) => {
    const { minPrice, maxPrice, minRating, sortOrder } = filters;
    let result = [...products];
  
    // 2. Apply Price Filter
    result = result.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );
  
    // 3. Apply Rating Filter
    if (minRating > 0) {
      result = result.filter((item) => item.rating?.rate >= minRating);
    }
  
    // 4. Apply Sorting
    if (sortOrder === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      result.sort((a, b) => b.rating.rate - a.rating.rate);
    }
  
    return result;
  };