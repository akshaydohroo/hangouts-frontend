import { Avatar, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Story } from '../../../models/Story'
import { User } from '../../../models/User'
import { userStoriesQueryKey } from '../../../queryKeyStore'
import { convertTime } from '../../../utils/functions'

export default function UserStory({
  user,
}: {
  user: Pick<User, 'id' | 'userName' | 'picture' | 'name'>
}) {
  const userStoriesQuery = useQuery({
    queryKey: userStoriesQueryKey(),
    queryFn: () => {
      return Story.getStories()
    },
    staleTime: convertTime(5, 'min', 'ms'),
  })
  console.log(userStoriesQuery.data)
  return (
    <IconButton sx={styles.avatarIconButton}>
      <Avatar src={user.picture as string} sx={{ ...styles.avatar }}></Avatar>
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
