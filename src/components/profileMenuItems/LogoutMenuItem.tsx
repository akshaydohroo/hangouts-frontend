import { MenuItem, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import useAppDispatch from '../../hooks/useAppDispatch'
import { User } from '../../models/User'
import { setSnackbar } from '../../redux/snackbar'

export default function LogoutMenuItem({
  handleClose,
}: {
  handleClose: () => void
}) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  async function onClickLogout() {
    try {
      await User.logout()
      await queryClient.cancelQueries()
      dispatch(
        setSnackbar({
          message: 'You have logged out successfully',
          severity: 'info',
          alertVarient: 'standard',
        })
      )
    } catch (error) {
      console.error(error)
      dispatch(
        setSnackbar({
          message:
            'There was error during logout, You are redirected to login page',
          severity: 'warning',
          alertVarient: 'standard',
        })
      )
    } finally {
      navigate('/login')
    }
  }
  return (
    <MenuItem
      onClick={() => {
        handleClose()
        onClickLogout()
      }}
    >
      <Typography>Logout</Typography>
    </MenuItem>
  )
}
