import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: []
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    ADD_PROJECT: (state, action) => {
      state.products.push(action.payload);
    },
    DELETE_PROJECT: (state, action) => {
      state.products = state.products.filter(product => product.id !== action.payload);
    },
    UPDATE_PROJECT: (state, action) => {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    FETCH_PROJECT: (state, action) => {
      state.products = action.payload;
    }
  }
});

export const { ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT, FETCH_PROJECT } = productSlice.actions;

export default productSlice.reducer;
