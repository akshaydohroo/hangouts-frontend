import { Avatar, Box, Typography, useTheme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { forwardRef } from 'react'
import { getUserData } from '../../../functions/user'
import { ChatOption } from '../../../models/Chat'
import { ChatMessage } from '../../../models/Message'
import { userDataQueryKey } from '../../../queryKeyStore'
import { convertTime, timeSince } from '../../../utils/functions'

interface MessageProps {
  chatMessage: ChatMessage
  userChat: ChatOption
}

export type MessageRef = {}

const Message = forwardRef<MessageRef, MessageProps>(
  ({ chatMessage, userChat }, ref) => {
    const theme = useTheme()
    const userQuery = useQuery(userDataQueryKey, {
      queryFn: () => getUserData(),
      staleTime: convertTime(5, 'min', 'ms'),
    })
    const isOwnMessage = chatMessage.sender.id === userQuery.data?.id
    return (
      <Box sx={styles.container(isOwnMessage)} ref={ref}>
        {!isOwnMessage && (
          <Avatar
            src={(chatMessage.sender.picture as string) || ''}
            alt={chatMessage.sender.name}
            sx={styles.avatar}
          />
        )}

        <Box sx={styles.messageBox(isOwnMessage)}>
          {chatMessage.replyToMessage && (
            <Box sx={styles.replyBox}>
              <Typography variant="caption" sx={styles.replySender}>
                Replying to {chatMessage.replyToMessage.sender.name}:
              </Typography>
              <Typography variant="caption" noWrap sx={styles.replyText}>
                {chatMessage.replyToMessage.text}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={styles.content}>
            {chatMessage.text}
          </Typography>

          <Box sx={styles.footer}>
            <Typography variant="caption" sx={styles.timestamp}>
              {timeSince(new Date(chatMessage.createdAt))}
            </Typography>

            {isOwnMessage && (
              <Typography variant="caption" sx={styles.readStatus}>
                {(chatMessage?.readBy?.length ?? 0) ===
                userChat.participantsCount
                  ? '✅ Seen'
                  : '🕓 Sent'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    )
  }
)

export default Message

const styles: Record<string, any> = {
  container: (isOwn: boolean) => ({
    width: '100%',
    display: 'flex',
    justifyContent: isOwn ? 'flex-end' : 'flex-start',
    alignItems: 'flex-end',
    mb: 1.5,
    px: 1,
  }),
  avatar: {
    width: 32,
    height: 32,
    mr: 1,
  },
  messageBox: (isOwn: boolean) => ({
    maxWidth: '70%',
    backgroundColor: isOwn ? 'success.main' : 'grey.200',
    color: isOwn ? 'white' : 'text.primary',
    px: 2,
    py: 1,
    borderRadius: 3,
    borderTopRightRadius: isOwn ? 0 : 3,
    borderTopLeftRadius: isOwn ? 3 : 0,
  }),
  replyBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderLeft: '3px solid',
    borderColor: 'primary.main',
    px: 1,
    mb: 0.5,
  },
  replySender: {
    fontWeight: 500,
  },
  replyText: {
    fontStyle: 'italic',
  },
  content: {
    wordBreak: 'break-word',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    mt: 0.5,
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'gray.600',
    mr: 1,
  },
  readStatus: {
    fontSize: '0.75rem',
    color: 'white',
    ml: 1,
  },
}
