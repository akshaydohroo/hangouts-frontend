import { Search } from '@mui/icons-material'
import { Box, List, TextField, Theme, Typography } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useInfiniteQuery } from '@tanstack/react-query'
import * as React from 'react'
import { followUsersOptions } from '../../functions/userFollower'
import useAppSelector from '../../hooks/useAppSelector'
import {
  UserFollowOptionsQuery,
  UsersOptionQuery,
} from '../../models/UserFollower'
import { convertTime } from '../../utils/functions'
import UserSearchOption from './UserSearchOption'

export default function UserSearchDialog({
  open,
  handleClose,
}: {
  open: boolean
  handleClose: () => void
}) {
  const [inputValue, setInputValue] = React.useState<string>('')
  const descriptionElementRef = React.useRef<HTMLElement>(null)
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery<UserFollowOptionsQuery | UsersOptionQuery, Error>(
    [
      'follow',
      'options',
      {
        searchString: inputValue,
      },
    ],
    {
      queryFn: ({ queryKey, pageParam = 1 }) => {
        const { searchString } = queryKey[queryKey.length - 1] as {
          searchString: string
        }
        return followUsersOptions(pageParam, 10, searchString, isAuthenticated)
      },
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.totalPages) {
          return pages.length + 1
        }
        return undefined
      },
      enabled: inputValue.trim().length > 2,
      staleTime: convertTime(1, 'min', 'ms'),
      cacheTime: convertTime(2, 'min', 'ms'),
    }
  )

  const observer = React.useRef<IntersectionObserver>()
  const lastUserElementRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  )

  if (isError) {
    throw error
  }

  const options = data?.pages.flatMap(page => page.rows) || []
  const page = data?.pages.length || 0
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef
      if (descriptionElement !== null) {
        descriptionElement.focus()
      }
    }
  }, [open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="user-search-dialog"
      aria-describedby="user-search-dialog-description"
      sx={styles.dialog}
    >
      <DialogTitle id="scroll-dialog-title">
        <TextField
          placeholder="Search User"
          aria-label="Search User"
          sx={styles.searchTextfield}
          InputProps={{
            startAdornment: <Search />,
          }}
          autoComplete="off"
          value={inputValue}
          onChange={event => {
            setInputValue(event.target.value)
          }}
        />
      </DialogTitle>
      <DialogContent dividers={true} sx={styles.dialogContent}>
        <List sx={styles.searchOptionsList}>
          {options.map((option, index) => {
            if (options.length === index + 1) {
              return (
                <Box
                  ref={lastUserElementRef}
                  key={option.id}
                  sx={styles.searchOptionsLastElement}
                >
                  <UserSearchOption
                    option={option}
                    page={page}
                    searchString={inputValue}
                  />
                </Box>
              )
            } else {
              return (
                <UserSearchOption
                  key={option.id}
                  option={option}
                  page={page}
                  searchString={inputValue}
                />
              )
            }
          })}
        </List>
        {isFetchingNextPage && <Typography>Loading more...</Typography>}
      </DialogContent>
    </Dialog>
  )
}

const styles = {
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogTitleText: {},
  searchTextfield: (theme: Theme) => ({
    width: '100%',
    '& .MuiInputBase-root': {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1, 1),
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1),
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.text.secondary,
    },
  }),
  dialogContent: {
    height: '60vh', // Increased height
    width: '100%', // Ensure the content takes full width
  },
  searchOptionsList: {
    height: '60vh', // Increased height
    width: '100%', // Ensure the list takes full width
    '& > *': {
      width: '100% !important', // Ensure each list item takes full width
    },
  },
  searchOptionsLastElement: {
    '& > *': {
      width: '100% !important', // Ensure each list item takes full width
    },
  },
  dialog: (theme: Theme) => ({
    '& .MuiDialog-paper': {
      width: '100%',
      maxWidth: 400,
      borderRadius: theme.shape.borderRadius,
    },
  }),
}
