import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";
import FilterReducer from "./filter/filterSlice";
import searchReducer from "./search/searchSlice";
import userReducer from "./search/searchSlice";
// import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";



// 1. Configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Which slices do you want to persist?
  // We want Cart to stay. We can also persist User to prevent "flicker" on refresh.
  whitelist: ["cart", "user"], 
  // Blacklist things you DON'T want saved (like search results or temporary filters)
  blacklist: ["search", "filter"], 
};

// 2. Combine Reducers (Required for redux-persist)
import { combineReducers } from "@reduxjs/toolkit";
const rootReducer = combineReducers({
  cart: cartReducer,
  user: userReducer,
  search: searchReducer,
  filter: FilterReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);