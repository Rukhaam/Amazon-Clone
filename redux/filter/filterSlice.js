import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  minPrice: 0,
  maxPrice: 5000, // Default max range
  minRating: 0,   // 0 means "All stars"
  sortOrder: "relevant", // 'relevant', 'lowToHigh', 'highToLow', 'newest'
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setPriceRange: (state, action) => {
      // Expect payload: { min: 10, max: 100 }
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setMinRating: (state, action) => {
      state.minRating = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    resetFilters: (state) => {
      state.minPrice = 0;
      state.maxPrice = 5000;
      state.minRating = 0;
      state.sortOrder = "relevant";
    },
  },
});

export const { setPriceRange, setMinRating, setSortOrder, resetFilters } = filterSlice.actions;

export const selectFilter = (state) => state.filter;

export default filterSlice.reducer;