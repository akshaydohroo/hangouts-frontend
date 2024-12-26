import { Avatar, IconButton } from '@mui/material'
import { User } from '../../../models/User'
import StoryAvatarWrapper from './StoryAvatarWrapper'

export default function UserStory({
  user,
  storiesCount,
  setSelfStoryDialogOpen,
}: {
  user: Pick<User, 'id' | 'userName' | 'picture' | 'name'>
  storiesCount: number | undefined
  setSelfStoryDialogOpen: (open: boolean) => void
}) {
  return (
    <StoryAvatarWrapper storyCount={storiesCount ?? 0}>
      <IconButton
        sx={styles.avatarIconButton}
        onClick={() => setSelfStoryDialogOpen(true)}
      >
        <Avatar src={user.picture as string} sx={{ ...styles.avatar }}></Avatar>
      </IconButton>
    </StoryAvatarWrapper>
  )
}
const styles = {
  avatarIconButton: {
    height: 'fit-content',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    p: 0,
  },
  avatar: {
    height: 60,
    width: 60,
  },
}
