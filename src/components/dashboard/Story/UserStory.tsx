import { Avatar, IconButton } from '@mui/material'
import { User } from '../../../models/User'

export default function UserStory({
  followingUser,
}: {
  followingUser: Pick<User, 'id' | 'userName' | 'picture' | 'name'>
}) {
  const story = followingUser
  return (
    <IconButton sx={styles.avatarIconButton}>
      <Avatar
        src={followingUser.picture as string}
        sx={{ ...styles.avatar }}
      ></Avatar>
    </IconButton>
  )
}
const styles = {
  avatarIconButton: {
    height: 'fit-content',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    mx: 1,
  },
  avatar: {
    height: 60,
    width: 60,
  },
}
