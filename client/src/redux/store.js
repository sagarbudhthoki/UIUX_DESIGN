import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./features/cartSlice";
import productSlice from "./features/productSlice";
import authSlice from "./features/authSlice";
import orderSlice from "./features/orderSlice";
import adminSlice from "./features/adminSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const reducer = combineReducers({
  auth: authSlice,
  admin: adminSlice,
  product: productSlice,
  cart: cartSlice,
  order: orderSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);
export const store = configureStore({
  reducer: persistedReducer,
});
