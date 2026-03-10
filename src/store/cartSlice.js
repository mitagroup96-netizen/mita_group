// store/cartSlice.js
import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // FIXED: Updated addToCart to handle quantity from payload
    addToCart: (state, action) => {
      const item = action.payload;

      // Log to verify we're getting the right price
      console.log("CartSlice adding item:", {
        title: item.title,
        price: item.price, // This should now be 280, not 560
        originalPrice: item.originalPrice,
        discount: item.discount,
      });

      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({
          ...item,
          quantity: item.quantity || 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },

    // Optional: Add specific quantity
    setCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
  },
});

// Base selector
export const selectCartItems = (state) => state.cart.items;

// Memoized selectors using reselect
export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0),
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0),
);

export const selectCartItemById = (id) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.id === id),
  );

export const selectCartItemsWithDetails = createSelector(
  [selectCartItems],
  (items) =>
    items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    })),
);

export const selectCartSummary = createSelector(
  [selectCartItems, selectCartCount, selectCartTotal],
  (items, count, total) => ({
    items,
    count,
    total,
    itemCount: items.length,
    isEmpty: items.length === 0,
  }),
);

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  updateCartItem,
  setCartItemQuantity, // Export the new action
} = cartSlice.actions;

export default cartSlice.reducer;
