import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface themeMode {
  value: boolean;
}
const matchDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");

const initialState: themeMode = {
  value: matchDarkMedia.matches,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    toggleThemeMode: (state) => {
      state.value = !state.value;
    },
    setThemeMode: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { toggleThemeMode, setThemeMode } = counterSlice.actions;

export default counterSlice.reducer;
