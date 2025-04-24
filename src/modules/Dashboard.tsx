import { Send } from '@mui/icons-material'
import { Box, Fab, Skeleton, Stack, Theme, useMediaQuery } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import Draggable from 'react-draggable'
import { Route, Routes } from 'react-router-dom'
import AuthBanner from '../components/common/AuthBanner'
import UserPosts from '../components/dashboard/Post/UserPosts'
import UserStories from '../components/dashboard/Story/UserStories'
import Navbar from '../components/navbar/Navbar'
import { getUserData } from '../functions/user'
import useAppDispatch from '../hooks/useAppDispatch'
import useAppSelector from '../hooks/useAppSelector'
import Account from '../modules/Account' // Import the Account component
import { userDataQueryKey } from '../queryKeyStore'
import { removeAuthenticated, setAuthenticated } from '../redux/authenticated'
import { setError } from '../redux/error'
import {
  convertTime,
  extractErrorDetailFromErrorQuery,
} from '../utils/functions'
import { ErrorDetails } from '../utils/types'

export default function Dashboard() {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
  })

  const isMobileScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md')
  )

  useEffect(() => {
    queryClient.resetQueries()
  }, [])

  if (userQuery.isError) {
    dispatch(setError(extractErrorDetailFromErrorQuery(userQuery.error as any)))
  }
  if (userQuery.isFetched == null && userQuery.data == null) {
    dispatch(
      setError(new ErrorDetails('User data not found', 'User data not found'))
    )
  }
  const userData = userQuery.data
  useEffect(() => {
    if (userData?.userName && userData?.email) {
      dispatch(setAuthenticated())
    }
    if (!userData?.userName && !userData?.email) {
      dispatch(removeAuthenticated())
    }
  }, [userData, dispatch])

  return (
    <Stack sx={styles.dashboard}>
      <Navbar />
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route
          path="*"
          element={
            <Stack direction="row">
              <Stack minWidth={isMobileScreen ? '100%' : '70%'}>
                <UserStories />
                <Stack>
                  <UserPosts />
                </Stack>
              </Stack>
              {isMobileScreen ? (
                <>
                  <Draggable defaultPosition={{ x: 0, y: 0 }} bounds="parent">
                    <Fab
                      color="success"
                      aria-label="chat"
                      sx={styles.chatButton}
                    >
                      <Send />
                    </Fab>
                  </Draggable>
                  {!isAuthenticated && <AuthBanner />}
                </>
              ) : isAuthenticated ? (
                <Box minWidth="30%">Chats</Box>
              ) : userQuery.isLoading ? (
                <Skeleton height={300} width="30%"></Skeleton>
              ) : (
                <Box minWidth="30%" maxWidth="30%" m={0} p={0}>
                  <AuthBanner />
                </Box>
              )}
            </Stack>
          }
        />
      </Routes>
    </Stack>
  )
}
const styles = {
  dashboard: {
    minHeight: '100%',
    height: 'wrap-content',
    width: '100vw',
  },
  chatButton: {
    position: 'fixed',
    right: 16,
    bottom: 16,
  },
}
