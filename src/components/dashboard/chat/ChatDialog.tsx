import CloseIcon from '@mui/icons-material/Close'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import useAppDispatch from '../../../hooks/useAppDispatch'
import useAppSelector from '../../../hooks/useAppSelector'
import { closeChatDialog } from '../../../redux/chatDialogOpen'
import Chats from './Chats'

export default function ChatDialog() {
  const theme = useTheme()
  const open = useAppSelector(store => store.chatDialogOpen.value)
  const dispatch = useAppDispatch()
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'))
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeChatDialog())}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Chat
        <IconButton
          aria-label="close"
          onClick={() => dispatch(closeChatDialog())}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Chats />
      </DialogContent>
    </Dialog>
  )
}
