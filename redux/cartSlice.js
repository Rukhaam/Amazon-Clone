import { createSlice } from "@reduxjs/toolkit";
import { addItemToCart, removeItemFromCart } from "./cart.utils";

const initialState = {
  products: [],
  // Removed "userInfo" because Auth is now handled by Context API
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 1. Add Item (Uses utils to check if item exists & increment qty)
    addToCart: (state, action) => {
      state.products = addItemToCart(state.products, action.payload);
    },
    // 2. Decrease Quantity (Uses utils to remove item if qty is 1)
    decreaseQty: (state, action) => {
      state.products = removeItemFromCart(state.products, action.payload);
    },
    // 3. Delete Item Completely
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload
      );
    },
    // 4. Reset Cart (Used when Signing Out)
    resetCart: (state) => {
      state.products = [];
    },
    setCart: (state, action) => {
      state.products = action.payload;
    },
    
  },
});

export const { addToCart, decreaseQty, deleteItem, resetCart,setCart } =
  cartSlice.actions;

// === SAFE SELECTORS (Prevents Crashes) ===
const EMPTY_CART = [];

export const selectProducts = (state) => state.cart.products || EMPTY_CART;

export const selectTotalQty = (state) =>
  (state.cart.products || EMPTY_CART).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

export const selectTotalPrice = (state) =>
  (state.cart.products || EMPTY_CART).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;
