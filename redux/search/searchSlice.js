import { createSlice } from "@reduxjs/toolkit";
import { filterProducts, getSuggestions } from "./search.utils";

const initialState = {
  searchQuery: "",
  searchResults: [],
  suggestions: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    // 1. Full Search Action
    searchProducts: (state, action) => {
      const { products, query } = action.payload;
      state.searchQuery = query;
      state.searchResults = filterProducts(products, query);
    },
    // 2. Live Suggestions Action
    updateSuggestions: (state, action) => {
      const { products, query } = action.payload;
      state.suggestions = getSuggestions(products, query);
    },
    // 3. Clear Suggestions (e.g. after clicking one)
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    resetSearch: (state) => {
      state.searchQuery = "";
      state.searchResults = [];
      state.suggestions = [];
    },
  },
});

export const { 
  searchProducts, 
  updateSuggestions, 
  clearSuggestions, 
  resetSearch 
} = searchSlice.actions;

// Selectors
export const selectSearchResults = (state) => state.search.searchResults;
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectSuggestions = (state) => state.search.suggestions;

export default searchSlice.reducer;