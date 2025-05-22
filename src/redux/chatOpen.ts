import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface chat {
  value: string
}
const initialState: chat = {
  value: '',
}

export const counterSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatOpen: (state, action: PayloadAction<chat>) => {
      state.value = action.payload.value || ''
    },
    closeChat: state => {
      state.value = ''
    },
  },
})

export const { setChatOpen, closeChat } = counterSlice.actions

export default counterSlice.reducer
