import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface chatDialog {
  value: boolean
}
const initialState: chatDialog = {
  value: false,
}

export const counterSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    toggleChatDialog: (state, action: PayloadAction<Boolean>) => {
      state.value = !action.payload
    },
    openChatDialog: state => {
      state.value = true
    },
    closeChatDialog: state => {
      state.value = false
    },
  },
})

export const { toggleChatDialog, openChatDialog, closeChatDialog } =
  counterSlice.actions

export default counterSlice.reducer
