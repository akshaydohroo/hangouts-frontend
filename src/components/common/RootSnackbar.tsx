import { Alert, Box, Snackbar } from '@mui/material'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import { resetSnackbar } from '../../redux/snackbar'

export default function RootSnackBar() {
  const { open, autoHideDuration, message, severity, isAlert, alertVarient } =
    useAppSelector(state => state.snackbar.value)
  const dispatch = useAppDispatch()
  function handleClose() {
    dispatch(resetSnackbar())
  }
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
    >
      {isAlert ? (
        <Alert onClose={handleClose} severity={severity} variant={alertVarient}>
          {message}
        </Alert>
      ) : (
        <Box>{message}</Box>
      )}
    </Snackbar>
  )
}
