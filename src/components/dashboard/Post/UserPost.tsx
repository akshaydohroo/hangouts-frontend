import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  Send,
} from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { UserAttributes } from '../../../models/User'

interface UserPostProps {
  user: UserAttributes
  postImage: string
  caption: string
  timestamp: number
}

export default function UserPost({
  user,
  postImage,
  caption,
  timestamp,
}: UserPostProps) {
  const [liked, setLiked] = useState<boolean>(false)

  return (
    <Card sx={styles.userPostWrapper}>
      {/* User Info */}
      <CardHeader
        avatar={<Avatar src={user.picture as string} alt={user.name} />}
        title={user.name}
        subheader={new Date(timestamp).toLocaleString()}
      />

      {/* Post Image */}
      <CardMedia
        component="img"
        height="400"
        image={postImage}
        alt="Post image"
      />

      {/* Actions */}
      <CardActions disableSpacing>
        <IconButton
          onClick={() => setLiked(!liked)}
          color={liked ? 'error' : 'default'}
        >
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <IconButton>
          <ChatBubbleOutline />
        </IconButton>
        <IconButton>
          <Send />
        </IconButton>
      </CardActions>

      {/* Caption */}
      <Typography variant="body2" sx={{ padding: '0 16px 16px' }}>
        <strong>{user.name}</strong> {caption}
      </Typography>
    </Card>
  )
}

const styles = {
  userPostWrapper: {
    borderRadius: 3,
    boxShadow: 3,
    m: 10,
  },
}
