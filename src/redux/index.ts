import { configureStore } from "@reduxjs/toolkit";
import themeMode from "./themeMode";
import snackbar from "./snackbar";
const store = configureStore({
  reducer: {
    themeMode,
    snackbar,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
