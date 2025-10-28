import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  shareCatalog: null,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    openShareModal: (state, action) => {
      state.shareCatalog = action.payload;
    },
    closeShareModal: (state) => {
      state.shareCatalog = null;
    },
  },
});

export const { setSearchQuery, openShareModal, closeShareModal } = gallerySlice.actions;
export default gallerySlice.reducer;
