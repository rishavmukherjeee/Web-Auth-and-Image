import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchImages = createAsyncThunk('images/fetchImages', async () => {
  const response = await axios.get(import.meta.env.VITE_APP_API+"/api/v1/images");
  return response.data;
});

export const imagesSlice = createSlice({
  name: 'images',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchImages.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default imagesSlice.reducer;
