import { Search } from '@mui/icons-material'
import { Box, ListItem, Popover, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  bindFocus,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks'
import React, { useMemo, useState } from 'react'
import { followUsersOptions } from '../../functions/userFollower'
import useAppSelector from '../../hooks/useAppSelector'
import {
  UserFollowOptionsQuery,
  UsersOptionQuery,
} from '../../models/UserFollower'
import { userfollowOptionsQueryKey } from '../../queryKeyStore'
import { convertTime, pageControl } from '../../utils/functions'
import PaginationControl from '../common/PaginationControl'
import UserSearchOption from './UserSearchOption'

export default function UserSearch() {
  const [inputValue, setInputValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const userFollowOptionsQuery = useQuery<
    UserFollowOptionsQuery | UsersOptionQuery,
    Error
  >(userfollowOptionsQueryKey(inputValue, page), {
    queryFn: ({ queryKey }) => {
      const { page, searchString } = queryKey[queryKey.length - 1] as {
        searchString: string
        page: number
      }
      return followUsersOptions(page, 5, searchString, isAuthenticated)
    },
    keepPreviousData: true,
    enabled: inputValue.trim().length > 2,
    staleTime: convertTime(30, 's', 'ms'),
  })
  if (userFollowOptionsQuery.isError) {
    throw userFollowOptionsQuery.error
  }
  const options = userFollowOptionsQuery.data?.rows || []
  const totalPages = userFollowOptionsQuery.data?.totalPages || 0
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'user-follow-options',
  })
  const pageController = useMemo(() => {
    return pageControl(
      setPage as React.Dispatch<React.SetStateAction<number | null>>,
      totalPages
    )
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
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '& .MuiInputBase-root': {
      padding: '8px 12px',
    },
    '& .MuiInputBase-input': {
      fontSize: '16px',
      padding: '12px',
      color: 'text.primary',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      lineHeight: '1.5',
    },
    '& .MuiSvgIcon-root': {
      color: 'text.secondary',
    },
    '&:hover': {
      backgroundColor: 'background.paper',
    },
    '& .Mui-focused': {
      backgroundColor: 'background.paper',
      boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
    },
  },
}
