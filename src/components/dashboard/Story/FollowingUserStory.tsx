import { Avatar, IconButton } from '@mui/material'
import { User } from '../../../models/User'
import StoryAvatarWrapper from './StoryAvatarWrapper'

export default function FollowingUserStory({
  followingUser,
  followingUserStoryIndexController,
  followingUserIndex,
  storiesCount,
}: {
  followingUser: Pick<User, 'id' | 'userName' | 'picture' | 'name'>
  followingUserStoryIndexController: {
    inc: () => void
    dec: () => void
    set: (index: number) => void
  }
  followingUserIndex: number
  storiesCount: number
}) {
  return (
    <StoryAvatarWrapper storyCount={storiesCount}>
      <IconButton
        sx={styles.avatarIconButton}
        onClick={() =>
          followingUserStoryIndexController.set(followingUserIndex)
        }
      >
        <Avatar
          src={followingUser.picture as string}
          sx={{ ...styles.avatar }}
        ></Avatar>
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
