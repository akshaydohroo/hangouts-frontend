import { AlertColor, AlertProps } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface snackbar {
  value: {
    open: boolean
    autoHideDuration: number
    message: string
    severity?: AlertColor
    isAlert?: boolean
    alertVarient: AlertProps['variant']
  }
}

const initialState: snackbar = {
  value: {
    isAlert: true,
    open: false,
    message: '',
    autoHideDuration: 3000,
    severity: 'info',
    alertVarient: 'filled',
  },
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setSnackbar: (state, action: PayloadAction<Partial<snackbar['value']>>) => {
      state.value = initialState.value
      state.value = { ...state.value, ...action.payload, open: true }
    },
    closeSnackbar: (state, action: PayloadAction<void>) => {
      state.value.open = false
    },
    openSnackbar: (state, action: PayloadAction<void>) => {
      state.value.open = true
    },
    resetSnackbar: (state, action: PayloadAction<void>) => {
      state.value = initialState.value
    },
  },
})

export const { setSnackbar, closeSnackbar, resetSnackbar } =
  counterSlice.actions

export default counterSlice.reducer
