import { configureStore } from '@reduxjs/toolkit'
import authenticated from './authenticated'
import error from './error'
import snackbar from './snackbar'
import themeMode from './themeMode'
const store = configureStore({
  reducer: {
    themeMode,
    snackbar,
    authenticated,
    error,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
