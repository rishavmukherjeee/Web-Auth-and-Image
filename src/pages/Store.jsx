import { configureStore } from '@reduxjs/toolkit';
import imagesReducer from './Slice';

export const store = configureStore({
  reducer: {
    images: imagesReducer,
    // other reducers
  },
});

