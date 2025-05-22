import { Cancel } from '@mui/icons-material'
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { getUserChatMessages } from '../../../functions/chat'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { ChatOption } from '../../../models/Chat'
import { ChatMessage, ChatMessagesPagination } from '../../../models/Message'
import { chatMessagesQueryKey } from '../../../queryKeyStore'
import { closeChat } from '../../../redux/chatOpen'
import { socket } from '../../../sockets/chatSocket'
import { BoundedMap } from '../../../utils/data-structures/BoundedMap'
import { convertTime } from '../../../utils/functions'
import Message from './Message'
import SendMessageBox from './SendMessageBox'

export default function UserChat({ userChat }: { userChat: ChatOption }) {
  const totalMessages = userChat.messageCount
  const messagesPerPage = 20
  const totalPages = Math.ceil(totalMessages / messagesPerPage)
  const chatId = userChat.chatId
  const dispatch = useAppDispatch()

  const messageCache = new BoundedMap<string, ChatMessage>(100, 2000)

  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: chatMessagesQueryKey(userChat.chatId),
    queryFn: ({ pageParam = totalPages }) =>
      getUserChatMessages(chatId, pageParam, messagesPerPage),
    getPreviousPageParam: ({ page }) => {
      return page > 1 ? page - 1 : undefined
    },
    getNextPageParam: ({ page, totalPages }) => {
      if (page < totalPages) {
        return page + 1
      }
      return undefined
    },
    staleTime: convertTime(20, 'min', 'ms'),
    keepPreviousData: false,
  })

  const bottomRef = useRef<HTMLDivElement | null>()
  const containerRef = useRef<HTMLDivElement | null>()

  useEffect(() => {
    if (!socket.connected) socket.connect()

    socket.emit('join-chat', chatId)

    socket.on('receive-message', async message => {
      if (messageCache.get(message.messageId)) {
        console.info('Message already in cache, ignoring')
        return
      }
      messageCache.set(message.messageId, message)
      const lastPage = data?.pages[data.pages.length - 1]
      if (!lastPage || lastPage.messages.length === lastPage.limit) {
        await fetchNextPage()
      }
      // Update the cache with the new message
      queryClient.setQueryData(
        chatMessagesQueryKey(chatId),
        (oldData?: InfiniteData<ChatMessagesPagination>) => {
          if (!oldData) return oldData
          const newPages = oldData.pages.map((page, index) => {
            if (index === oldData.pages.length - 1) {
              return {
                ...page,
                messages: [...page.messages, message],
              }
            }
            return page
          })
          console.log(newPages)
          return { ...oldData, pages: newPages }
        }
      )
      requestAnimationFrame(() => {
        containerRef?.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      })
    })

    return () => {
      socket.off('receive-message')
      socket.emit('leave-chat', chatId) // optional cleanup
      socket.close()
    }
  }, [chatId])

  const sendMessage = (content: string) => {
    socket.emit('send-message', { chatId, content })
  }

  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastMessageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingPreviousPage || !node) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      const prevScrollHeight = containerRef.current?.scrollHeight || 0

      observerRef.current = new IntersectionObserver(async entries => {
        if (entries[0].isIntersecting && hasPreviousPage) {
          await fetchPreviousPage()

          // Wait for next tick to let DOM update
          requestAnimationFrame(() => {
            const newScrollHeight = containerRef.current?.scrollHeight || 0
            const scrollDiff = newScrollHeight - prevScrollHeight

            if (containerRef.current) {
              containerRef.current.scrollTop += scrollDiff
            }
          })
        }
      })
      observerRef.current.observe(node)
    },
    [isFetchingPreviousPage, hasPreviousPage, fetchPreviousPage]
  )

  const messages = data?.pages.flatMap(page => page.messages).reverse() || []

  return (
    <Stack sx={styles.wrapper}>
      <Box sx={styles.header}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          <Avatar
            src={(userChat.participants[0]?.picture as string) || ''}
            alt={userChat.participants[0]?.name}
            sx={styles.headerAvatar}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {userChat.participantsCount === 2
                ? userChat.participants[0]?.name
                : userChat.chatName || 'Group Chat'}
            </Typography>
            {userChat.participantsCount > 2 && (
              <Typography variant="caption" color="text.secondary">
                {userChat.participants.map(p => p.name).join(', ')}
              </Typography>
            )}
          </Box>
        </Stack>
        <IconButton
          sx={styles.closeButton}
          onClick={() => dispatch(closeChat())}
        >
          <Cancel />
        </IconButton>
      </Box>

      <Box sx={styles.messageList} ref={containerRef}>
        {isLoading && (
          <Stack alignItems="center" sx={{ mb: 1 }}>
            <CircularProgress size={20} />
          </Stack>
        )}

        {[...messages].map((msg, idx) =>
          idx === messages.length - 1 ? (
            <Message
              key={msg.messageId}
              chatMessage={msg}
              userChat={userChat}
              ref={lastMessageRef}
            />
          ) : (
            <Message
              key={msg.messageId}
              chatMessage={msg}
              userChat={userChat}
            />
          )
        )}
      </Box>

      <Divider />

      <Box sx={styles.sendBox}>
        <SendMessageBox onSend={sendMessage} />
      </Box>
    </Stack>
  )
}

const styles = {
  wrapper: {
    maxHeight: {
      lg: '90vh',
      xs: '70vh',
    },
    minHeight: { lg: '90vh', xs: '70vh' },
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'background.paper',
  },
  header: {
    px: 2,
    py: 1,
    borderBottom: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.default',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  headerAvatar: {
    width: 40,
    height: 40,
  },
  closeButton: {
    color: 'text.secondary',
    '&:hover': {
      color: 'error.main',
    },
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column-reverse',
    px: 2,
    py: 1,
  },
  sendBox: {
    px: 2,
    py: 1,
  },
}
