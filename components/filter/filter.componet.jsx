import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMinRating, 
  setSortOrder, 
  setPriceRange,  // 1. Ensure this is imported
  selectFilter, 
  resetFilters} from "../../redux/filter/filterSlice";
import StarIcon from "@mui/icons-material/Star";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { minRating, sortOrder, minPrice, maxPrice } = useSelector(selectFilter);

  // 2. Define the specific logic for each range
  const priceRanges = [
    { label: "Any Price", min: 0, max: 5000 },
    { label: "Under $25", min: 0, max: 25 },
    { label: "$25 to $50", min: 25, max: 50 },
    { label: "$50 to $100", min: 50, max: 100 },
    { label: "$100 to $200", min: 100, max: 200 },
    { label: "$200 & Above", min: 200, max: 999999 },
  ];

  const renderStars = (count) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        fontSize="small"
        className={i < count ? "text-[#F4A41C]" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="w-full bg-white p-4 border-r border-gray-200 hidden md:block">
      {/* === Sort Order === */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Sort By</h3>
        <select
          value={sortOrder}
          onChange={(e) => dispatch(setSortOrder(e.target.value))}
          className="w-full p-1 border border-gray-300 rounded-md text-sm bg-gray-50 focus:ring-amazon-yellow focus:border-amazon-yellow cursor-pointer outline-none"
        >
          <option value="relevant">Featured</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="rating">Avg. Customer Review</option>
        </select>
      </div>

      {/* === Rating Filter === */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Customer Review</h3>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((star) => (
            <div
              key={star}
              onClick={() => dispatch(setMinRating(star))}
              className={`flex items-center gap-1 cursor-pointer hover:text-orange-500 ${
                minRating === star ? "font-bold text-orange-600" : "text-sm"
              }`}
            >
              <div className="flex">{renderStars(star)}</div>
              <span className="text-sm">& Up</span>
            </div>
          ))}
        </div>
      </div>

      {/* === Price Filter (FIXED) === */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-2">Price</h3>
        <ul className="text-sm flex flex-col gap-1 text-gray-700">
          {priceRanges.map((range) => {
             // Check if this range is currently active
             const isActive = minPrice === range.min && maxPrice === range.max;
             
             return (
               <li
                 key={range.label}
                 // 3. Dispatch the specific range on click
                 onClick={() => dispatch(setPriceRange({ min: range.min, max: range.max }))}
                 className={`cursor-pointer hover:text-orange-500 ${
                    isActive ? "font-bold text-orange-700" : ""
                 }`}
               >
                 {range.label}
               </li>
             );
          })}
        </ul>
      </div>

      {/* === Clear Filters === */}
      <button
        onClick={() => dispatch(resetFilters())}
        className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;