import { Stack } from '@mui/material'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { ChatOption } from '../../../models/Chat'
import { setChatOpen } from '../../../redux/chatOpen'
import UserChatOption from './UserChatOption'
export default function UserChats({ userChats }: { userChats: ChatOption[] }) {
  const dispatch = useAppDispatch()
  const onClickHandler = (chatId: string) => {
    dispatch(setChatOpen({ value: chatId }))
  }

  return (
    <Stack sx={styles}>
      {userChats.map((chat: ChatOption) => (
        <UserChatOption
          key={chat.chatId}
          chatOption={chat}
          onClick={() => onClickHandler(chat.chatId)}
        />
      ))}
    </Stack>
  )
}
const styles = {
  chatOptionsWrapper: {
    width: '100%',
    borderRadius: '0.5rem',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
}
