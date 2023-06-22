import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "cart";

const getCartFromStorage = () => {
  const cart = localStorage.getItem(CART_KEY);
  const shippingInfo = JSON.parse(localStorage.getItem("shippingInfo"));
  if (cart) {
    return { items: JSON.parse(cart), shippingInfo };
  }
  return { items: [], shippingInfo: null };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getCartFromStorage().items,
    shippingInfo: null, // Initialize shippingInfo to null
  },
  reducers: {
    addItem(state, action) {
      const { product, quantity } = action.payload;
      const existingProduct = state.items.find(
        (item) => item._id === product._id
      );

      if (!existingProduct) {
        state.items.push({ ...product, quantity });
        saveCartToStorage(state.items);
      }
    },
    removeItem(state, action) {
      const filteredState = state.items.filter(
        (item) => item._id !== action.payload
      );
      saveCartToStorage(filteredState);
      state.items = filteredState;
    },

    incrementItem(state, action) {
      const productIndex = state.items.findIndex(
        (item) => item._id === action.payload
      );
      if (productIndex >= 0) {
        state.items[productIndex].quantity++;
        saveCartToStorage(state.items);
      }
    },
    decrementItem(state, action) {
      const productIndex = state.items.findIndex(
        (item) => item._id === action.payload
      );
      if (productIndex >= 0 && state.items[productIndex].quantity > 1) {
        state.items[productIndex].quantity--;
        saveCartToStorage(state.items);
      }
    },
    resetCart(state) {
      if (state.loggedIn) {
        // Clear the shipping info, but keep the cart items
        state.shippingInfo = null;
        saveCartToStorage(state.items);
      } else {
        // Reset the entire cart
        state.items = [];
        state.shippingInfo = null;
        saveCartToStorage(state.items);
      }
    },

    setLoggedIn(state, action) {
      state.loggedIn = action.payload;
    },
    addShippingInfo(state, action) {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
  },
});

export const {
  addItem,
  removeItem,
  decrementItem,
  incrementItem,
  resetCart,
  setLoggedIn,
  addShippingInfo,
} = cartSlice.actions;
export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: [],
//   reducers: {
//     addItem(state, action) {
//       const newItem = {
//         id: action.payload.id,
//         name: action.payload.name,
//         price: action.payload.price,
//         quantity: 1,
//       };
//       const existingItemIndex = state.findIndex(
//         (item) => item.id === newItem.id
//       );
//       if (existingItemIndex >= 0) {
//         state[existingItemIndex].quantity += 1;
//       } else {
//         state.push(newItem);
//       }
//     },
//     removeItem(state, action) {
//       const itemIndex = state.findIndex((item) => item.id === action.payload);
//       if (itemIndex >= 0) {
//         state.splice(itemIndex, 1);
//       }
//     },
//     updateQuantity(state, action) {
//       const { id, quantity } = action.payload;
//       const itemIndex = state.findIndex((item) => item.id === id);
//       if (itemIndex >= 0) {
//         state[itemIndex].quantity = quantity;
//       }
//     },
//     clearCart(state) {
//       state = [];
//     },
//   },
// });

// export const { addItem, removeItem, updateQuantity, clearCart } =
//   cartSlice.actions;
// export default cartSlice.reducer;
