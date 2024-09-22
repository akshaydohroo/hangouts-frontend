import { Search } from '@mui/icons-material'
import { Box, ListItem, Popover, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  bindFocus,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks'
import React from 'react'
import { followUsersOptions } from '../../functions/userFollower'
import {
  UserFollowOptionsQuery,
  UsersOptionQuery,
} from '../../models/UserFollower'
import { convertTime, pageControl } from '../../utils/functions'
import UserSearchOption from './UserSearchOption'
import PaginationControl from '../common/PaginationControl'
import useAppSelector from '../../hooks/useAppSelector'

export default function UserSearch() {
  const [inputValue, setInputValue] = React.useState<string>('')
  const [page, setPage] = React.useState<number>(1)
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const userFollowOptionsQuery = useQuery<
    UserFollowOptionsQuery | UsersOptionQuery,
    Error
  >(
    [
      'follow',
      'options',
      {
        searchString: inputValue,
        page,
      },
    ],
    {
      queryFn: ({ queryKey }) => {
        const { page, searchString } = queryKey[queryKey.length - 1] as {
          searchString: string
          page: number
        }
        return followUsersOptions(page, searchString, isAuthenticated)
      },
      keepPreviousData: true,
      enabled: inputValue.trim().length > 2,
      staleTime: convertTime(30, 's', 'ms'),
    }
  )
  if (userFollowOptionsQuery.isError) {
    throw userFollowOptionsQuery.error
  }
  const options = userFollowOptionsQuery.data?.rows || []
  const totalPages = userFollowOptionsQuery.data?.totalPages || 0
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'user-follow-options',
  })
  const pageController = React.useMemo(() => {
    return pageControl(setPage, totalPages)
  }, [totalPages, setPage])
  return (
    <Box sx={styles.wrapper}>
      <Box {...bindFocus(popupState)}>
        <TextField
          placeholder="Search User"
          aria-label="Search User"
          sx={styles.searchTextField}
          InputProps={{
            startAdornment: <Search />,
          }}
          autoComplete="off"
          value={inputValue}
          onChange={event => {
            setPage(1)
            setInputValue(event.target.value)
          }}
        />
      </Box>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {options.map(option => (
          <UserSearchOption
            option={option}
            key={option.id}
            page={page}
            searchString={inputValue}
          />
        ))}
        {options.length > 0 && (
          <PaginationControl pageController={pageController} />
        )}
        {options.length === 0 && (
          <ListItem sx={{ width: 300, height: 50 }}>
            <Typography>No Options Found...</Typography>
          </ListItem>
        )}
      </Popover>
    </Box>
  )
}

const styles = {
  wrapper: {},
  searchTextField: {
    backgroundColor: 'background.default',
    width: 300,
  },
}
