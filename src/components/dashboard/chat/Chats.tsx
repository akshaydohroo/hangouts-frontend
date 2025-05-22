import { Skeleton, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { getUserChats } from '../../../functions/chat'
import useAppDispatch from '../../../hooks/useAppDispatch'
import useAppSelector from '../../../hooks/useAppSelector'
import { useDebounce } from '../../../hooks/useDebounce'
import { chatOptionQueryKey } from '../../../queryKeyStore'
import { closeChat } from '../../../redux/chatOpen'
import { convertTime } from '../../../utils/functions'
import DisplayBanner from '../../common/DisplayBanner'
import Loading from '../../common/Loading'
import UserChat from './UserChat'
import UserChats from './UserChats'
import UserChatsSearchBar from './UserChatsSearchBar'

export default function Chats() {
  const chatId = useAppSelector(state => state.chatOpen.value)

  const dispatch = useAppDispatch()

  const [searchChat, setSearchChat] = useState<string>('')

  const searchChatDebounce = useDebounce(searchChat, 200) as string

  const userChats = useQuery(chatOptionQueryKey(searchChatDebounce), {
    queryFn: () => getUserChats(searchChatDebounce),
    staleTime: convertTime(5, 'min', 'ms'),
    enabled: !!searchChatDebounce || !!chatId, // only query when needed
  })

  // useEffect(() => {
  //   dispatch(closeChat())
  // }, [searchChatDebounce])

  useEffect(() => {
    userChats.refetch()
  }, [chatId])

  const selectedChat = useMemo(() => {
    if (!userChats.data) return undefined
    return userChats.data.find(chat => chat.chatId === chatId)
  }, [userChats.data, chatId])

  return (
    <Stack sx={styles.chatsWrapper}>
      {chatId ? (
        userChats.isLoading ? (
          <Loading />
        ) : selectedChat ? (
          <UserChat userChat={selectedChat!} />
        ) : (
          <DisplayBanner
            severity="warning"
            message="Chat not found, please refresh"
            onClose={() => dispatch(closeChat())}
          />
        )
      ) : (
        <>
          <UserChatsSearchBar
            setSearchChat={setSearchChat}
            searchChat={searchChat}
          />

          {userChats.isLoading ? (
            <Stack width="100%" sx={styles.skeletonWrapper}>
              {Array.from({ length: 10 }, (_, i) => (
                <Skeleton key={i} variant="rectangular" sx={styles.skeleton} />
              ))}
            </Stack>
          ) : userChats.isError ? (
            <DisplayBanner
              severity="error"
              message="Error loading chats, please refresh"
              onClose={() => {
                dispatch(closeChat())
                setSearchChat('')
              }}
            />
          ) : userChats.data?.length === 0 ? (
            <DisplayBanner message="No chats found" />
          ) : (
            <UserChats userChats={userChats.data} />
          )}
        </>
      )}
    </Stack>
  )
}

const styles = {
  chatsWrapper: {
    m: 2,
  },
  skeletonWrapper: {
    animation: 'fadeSlideIn 0.4s ease-in-out',
    '@keyframes fadeSlideIn': {
      '0%': {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  skeleton: {
    mb: 1,
    borderRadius: 1,
    width: '100%',
    height: 50,
  },
}
