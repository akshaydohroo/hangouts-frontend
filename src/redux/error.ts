import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorDetails } from "../utils/types";

const initialState: {
  value: ErrorDetails | null;
} = {
  value: null,
};

export const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<ErrorDetails>) => {
      state.value = { ...action.payload };
      console.log(state.value)
    },
    resetError : (state, action:PayloadAction<void>) => {
      state.value = null
    }
  },
});

export const {setError, resetError} = errorSlice.actions;

export default errorSlice.reducer;
