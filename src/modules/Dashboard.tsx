import { Box, Stack } from '@mui/material'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
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
              <Stack width="70%">
                <UserStories />
                <Stack>
                  <UserPosts />
                </Stack>
              </Stack>
              <Box width="30%">Chats</Box>
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
}
