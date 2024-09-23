import { createSlice } from '@reduxjs/toolkit'

interface authenticated {
  value: boolean
}
const initialState: authenticated = {
  value: false,
}

export const counterSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    setAuthenticated: state => {
      state.value = true
    },
    removeAuthenticated: state => {
      state.value = false
    },
  },
})

export const { setAuthenticated, removeAuthenticated } = counterSlice.actions

export default counterSlice.reducer
