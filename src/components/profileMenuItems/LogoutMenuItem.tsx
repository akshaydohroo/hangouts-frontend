import { ListItemIcon, MenuItem, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import useAppDispatch from '../../hooks/useAppDispatch'
import { User } from '../../models/User'
import { setSnackbar } from '../../redux/snackbar'
import { useQueryClient } from '@tanstack/react-query'

export default function LogoutMenuItem() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  async function onClickLogout() {
    try {
      await User.logout()
      await queryClient.resetQueries()
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
    <MenuItem onClick={() => onClickLogout()}>
      <Typography>Logout</Typography>
    </MenuItem>
  )
}
