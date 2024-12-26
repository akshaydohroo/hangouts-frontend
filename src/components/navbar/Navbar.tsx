import { Search } from '@mui/icons-material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import HomeIcon from '@mui/icons-material/Home'
import {
  AppBar,
  IconButton,
  Stack,
  Theme,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserData } from '../../functions/user'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import { userDataQueryKey } from '../../queryKeyStore'
import { toggleThemeMode } from '../../redux/themeMode'
import { convertTime } from '../../utils/functions'
import NavbarButton from './NavbarButton'
import UserButton from './UserButton'
import UserSearch from './UserSearch'
import UserSearchDialog from './UserSearchDialog'
export default function Navbar() {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const mode = useAppSelector(state => state.themeMode.value)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
    enabled: isAuthenticated,
  })
  const isMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  )
  const [userSearchDialogState, setuserSearchDialogState] =
    useState<boolean>(false)

  const userSearchDialogClose = () => {
    setuserSearchDialogState(false)
  }
  const userSearchDialogToggle = () => {
    setuserSearchDialogState(prevState => !prevState)
  }
  return (
    <AppBar sx={styles.appBar(mode)} enableColorOnDark position="static">
      <Toolbar sx={styles.toolbar}>
        <Stack sx={styles.homeAndBrandName}>
          <IconButton sx={styles.homeButton} onClick={() => navigate('/')}>
            <HomeIcon />
          </IconButton>
          <Typography sx={styles.brandName}>Hangouts</Typography>
        </Stack>

        <Stack sx={styles.rightNavbar}>
          {!isMobileScreen ? (
            <UserSearch />
          ) : (
            <>
              <IconButton onClick={userSearchDialogToggle}>
                <Search sx={styles.homeButton} />
              </IconButton>
              <UserSearchDialog
                open={userSearchDialogState}
                handleClose={userSearchDialogClose}
              />
            </>
          )}
          <NavbarButton type="notifications" />
          <NavbarButton type="chats" />

          <IconButton
            onClick={() => {
              dispatch(toggleThemeMode())
            }}
          >
            <Brightness4Icon sx={styles.homeButton} />
          </IconButton>
          <UserButton picture={userQuery.data?.picture as string | undefined} />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
const styles = {
  appBar: (mode: boolean) => ({
    backgroundColor: mode ? '#000814' : '#003049',
    color: 'white',
  }),
  toolbar: {
    pl: {
      xs: '1vw !important', // small screens
      sm: '1.5vw', // medium screens
      md: '2vw', // large screens
      lg: '4vw', // extra large screens
    },
    justifyContent: 'space-between',
  },
  homeAndBrandName: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  brandName: {
    fontSize: {
      xs: 18, // small screens
      sm: 20, // medium screens
      md: 24, // large screens
    },
    fontWeight: 800,
  },
  homeButton: {
    color: 'white',
    '& > svg': {
      fontSize: '30px',
    },
  },
  rightNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    '& > button': {
      mx: {
        xs: '0.8vw', // small screens
        sm: '1.5vw', // medium screens
        md: '2vw', // large screens
      },
    },
  },
}
