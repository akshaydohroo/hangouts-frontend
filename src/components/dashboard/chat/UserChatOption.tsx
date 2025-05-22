import {
  Avatar,
  AvatarGroup,
  Box,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import { ChatOption } from '../../../models/Chat'
import { timeSince } from '../../../utils/functions'

export default function UserChatOption({
  chatOption,
  onClick,
}: {
  chatOption: ChatOption
  onClick?: () => void
}) {
  const theme = useTheme()
  const { participants, lastMessage } = chatOption
  const isGroupChat = participants.length > 1

  const chatName = isGroupChat
    ? chatOption.chatName || participants.map(p => p.name).join(', ')
    : participants[0]?.name

  const avatarContent = isGroupChat ? (
    <AvatarGroup max={3} sx={styles.avatarGroup}>
      {participants.slice(0, 3).map(p => (
        <Avatar key={p.id} src={(p.picture as string) || ''} alt={p.name} />
      ))}
    </AvatarGroup>
  ) : (
    <Avatar
      src={(participants[0]?.picture as string) || ''}
      alt={participants[0]?.name}
      sx={styles.avatar}
    />
  )

  return (
    <Box sx={styles.container(theme)} onClick={onClick}>
      {avatarContent}

      <Stack sx={styles.textContent}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" sx={styles.chatName} noWrap>
            {chatName}
          </Typography>
          {lastMessage && (
            <Typography variant="caption" sx={styles.timestamp}>
              {timeSince(new Date(lastMessage.createdAt))}
            </Typography>
          )}
        </Stack>

        {lastMessage && (
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={styles.messageText}
          >
            <strong>{lastMessage.sender.name}: </strong>
            {lastMessage.text}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}

const styles = {
  container: (theme: Theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.action.hover
          : theme.palette.action.selected,
      cursor: 'pointer',
    },
  }),
  avatar: {
    width: 48,
    height: 48,
  },
  avatarGroup: {
    '& .MuiAvatar-root': {
      width: 36,
      height: 36,
      fontSize: 14,
    },
  },
  textContent: {
    flex: 1,
    minWidth: 0,
  },
  chatName: {
    fontWeight: 600,
    color: 'text.primary',
  },
  messageText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  timestamp: {
    color: 'text.disabled',
    marginLeft: 1,
    whiteSpace: 'nowrap',
  },
}
