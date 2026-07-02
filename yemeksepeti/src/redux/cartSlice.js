import { createSlice } from '@reduxjs/toolkit';

// Load cart state from sessionStorage
const storedCartItems = sessionStorage.getItem('cartItems');
const storedRestaurantId = sessionStorage.getItem('cartRestaurantId');
const storedRestaurantName = sessionStorage.getItem('cartRestaurantName');

const initialState = {
  items: storedCartItems ? JSON.parse(storedCartItems) : [],
  restaurantId: storedRestaurantId ? (isNaN(Number(storedRestaurantId)) ? storedRestaurantId : Number(storedRestaurantId)) : null,
  restaurantName: storedRestaurantName || null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, restaurantId, restaurantName } = action.payload;

      // If adding item from a different restaurant, clear the cart first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }

      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ id, name, price, quantity: 1 });
      }

      // Persist in sessionStorage
      sessionStorage.setItem('cartItems', JSON.stringify(state.items));
      sessionStorage.setItem('cartRestaurantId', state.restaurantId);
      sessionStorage.setItem('cartRestaurantName', state.restaurantName);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
        sessionStorage.removeItem('cartRestaurantId');
        sessionStorage.removeItem('cartRestaurantName');
      }

      sessionStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity += 1;
      }
      sessionStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity -= 1;
        if (item.quantity === 0) {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }

      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
        sessionStorage.removeItem('cartRestaurantId');
        sessionStorage.removeItem('cartRestaurantName');
      }

      sessionStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      sessionStorage.removeItem('cartItems');
      sessionStorage.removeItem('cartRestaurantId');
      sessionStorage.removeItem('cartRestaurantName');
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
