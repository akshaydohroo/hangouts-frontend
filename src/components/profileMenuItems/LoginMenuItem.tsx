import { MenuItem, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function LoginMenuItem({
  handleClose,
}: {
  handleClose: () => void
}) {
  const navigate = useNavigate()
  return (
    <MenuItem
      onClick={() => {
        handleClose()
        navigate('/login')
      }}
    >
      <Typography>Login</Typography>
    </MenuItem>
  )
}
