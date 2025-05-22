import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { closeChat } from '../../../redux/chatOpen'

export default function UserChatsSearchBar({
  searchChat,
  setSearchChat,
}: {
  searchChat: string
  setSearchChat: (value: string) => void
}) {
  const dispatch = useAppDispatch()
  return (
    <TextField
      variant="outlined"
      placeholder="Search chats"
      size="medium"
      fullWidth
      sx={styles.searchBar}
      value={searchChat}
      onChange={e => setSearchChat(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                dispatch(closeChat())
                setSearchChat('')
              }}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
const styles = {
  searchBar: {
    p: 2,
    m: 1,
    borderRadius: 2,
  },
}
