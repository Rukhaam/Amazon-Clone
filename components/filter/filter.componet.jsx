import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  setSortOrder, 
  selectFilter 
} from "../../redux/filter/filterSlice";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { sortOrder } = useSelector(selectFilter);

  return (
    <div className="w-full bg-white mb-4 p-2 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between md:justify-end gap-3">
      
      <label className="text-sm font-semibold text-start text-gray-700">Sort by:</label>
      
      {/* === Simple Inline Dropdown === */}
      <select
        value={sortOrder}
        onChange={(e) => dispatch(setSortOrder(e.target.value))}
        className="p-2 border border-gray-300 rounded-md text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-amazon-yellow focus:border-amazon-yellow cursor-pointer outline-none min-w-[200px]"
      >
        <option value="highToLow">Price: High to Low</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="rating">Average Ratings</option>
        <option value="newest">Latest</option>
      </select>

    </div>
  );
};

export default FilterSidebar;