import { configureStore } from "@reduxjs/toolkit";
import themeMode from "./themeMode";
import snackbar from "./snackbar";
import error from "./error";
import authenticated from "./authenticated";
const store = configureStore({
  reducer: {
    themeMode,
    snackbar,
    authenticated,
    error
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
