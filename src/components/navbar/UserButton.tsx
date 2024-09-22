import { Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import React from 'react'
import LoginMenuItem from '../profileMenuItems/LoginMenuItem'
import LogoutMenuItem from '../profileMenuItems/LogoutMenuItem'
import AccountMenuItem from '../profileMenuItems/AccountMenuItem'
import useAppSelector from '../../hooks/useAppSelector'
import { Sign } from 'crypto'
import SignupMenuItem from '../profileMenuItems/SignupMenuItem'

export default function UserButton({
  picture,
}: {
  picture: string | undefined
}) {
  console.log(picture === undefined)
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <>
      <IconButton
        id={`user-button`}
        aria-controls={open ? `user-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={styles.userButton}
      >
        {picture === undefined ? (
          <Avatar sx={{ width: 28, height: 28 }} />
        ) : (
          <Avatar sx={{ width: 28, height: 28 }} src={picture} />
        )}
      </IconButton>
      <Menu
        id={`user-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `user-button`,
        }}
      >
        {isAuthenticated ? (
          <>
            <AccountMenuItem />
            <LogoutMenuItem />
          </>
        ) : (
          <>
            <LoginMenuItem />
            <SignupMenuItem />
          </>
        )}
      </Menu>
    </>
  )
}
const styles = {
  userButton: {
    color: 'white',
    '& > *': {
      fontSize: 24,
    },
  },
}
