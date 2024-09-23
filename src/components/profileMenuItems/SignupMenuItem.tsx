import { MenuItem, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function SignupMenuItem({
  handleClose,
}: {
  handleClose: () => void
}) {
  const navigate = useNavigate()
  return (
    <MenuItem
      onClick={() => {
        handleClose()
        navigate('/signup')
      }}
    >
      <Typography>Sign Up</Typography>
    </MenuItem>
  )
}
