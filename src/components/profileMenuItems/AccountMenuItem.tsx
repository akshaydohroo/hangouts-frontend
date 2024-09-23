import { MenuItem, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function AccountMenuItem({
  handleClose,
}: {
  handleClose: () => void
}) {
  const navigate = useNavigate()

  return (
    <MenuItem
      onClick={() => {
        handleClose()
        navigate('/account')
      }}
    >
      <Typography>Account</Typography>
    </MenuItem>
  )
}
