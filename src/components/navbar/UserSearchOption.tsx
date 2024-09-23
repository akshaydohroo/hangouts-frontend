import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { followUser } from '../../functions/userFollower'
import useAppDispatch from '../../hooks/useAppDispatch'
import useAppSelector from '../../hooks/useAppSelector'
import { invalidateUserFollowOptions } from '../../invalidateQueries'
import { UserWithFollower } from '../../models/UserFollower'
import { setSnackbar } from '../../redux/snackbar'

export default function UserSearchOption({
  option,
  page,
  searchString,
}: {
  option: UserWithFollower
  page: number
  searchString: string
}) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const [preRequestIfAnyStatus, setPreRequestIfAnyStatus] = useState<
    'accepted' | 'pending' | null
  >(null)

  useEffect(() => {
    if (option.followers && option.followers.length > 0) {
      setPreRequestIfAnyStatus(option.followers[0]?.connection.status)
    }
  }, [option.followers])
  async function onFollowClickHandler() {
    try {
      const connectionId = await followUser(option.id as string)
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          invalidateUserFollowOptions(queryKey, searchString, page),
      })
      dispatch(
        setSnackbar({
          severity: 'success',
          message: `Follow request sent to ${option.name} successfully.`,
        })
      )
    } catch (error) {
      console.error(error)
      dispatch(
        setSnackbar({
          severity: 'error',
          message: 'Follow request couldnt be sent.',
        })
      )
    }
  }
  return (
    <ListItem sx={{ width: 300 }} divider>
      <Stack direction="row" sx={styles.wrapper}>
        <Avatar src={(option.picture as string) || ''} sx={styles.avatar} />
        <Stack sx={styles.user}>
          <Typography variant="subtitle2" color="GrayText">
            @{option.userName}
          </Typography>
          <Typography variant="subtitle1" sx={styles.name}>
            {option.name}
          </Typography>
        </Stack>
        <IconButton
          sx={styles.connectButton(
            !isAuthenticated
              ? 'disabled'
              : preRequestIfAnyStatus
                ? preRequestIfAnyStatus
                : 'inherit'
          )}
          disabled={!isAuthenticated || Boolean(preRequestIfAnyStatus)}
          onClick={onFollowClickHandler}
        >
          <PersonAddIcon />
        </IconButton>
      </Stack>
    </ListItem>
  )
}
const styles = {
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    ml: 0.5,
    mr: 3,
  },
  user: {
    minWidth: '55%',
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  connectButton: (color: string) => ({
    mr: 0.5,
    ml: 1,
    '&:disabled': {
      color:
        color === 'disabled'
          ? 'disabled'
          : color === 'inherit'
            ? color
            : color === 'accepted'
              ? 'success.main'
              : 'warning.main',
    },
    '&:hover, &:focus': {
      color: 'info.main',
    },
  }),
}
