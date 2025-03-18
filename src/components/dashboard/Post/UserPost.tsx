import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  Send,
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { UserAttributes } from '../../../models/User'

interface UserPostProps {
  user: UserAttributes
  postImage: string
  caption: string
  timestamp: string
}

export default function UserPost({
  user,
  postImage,
  caption,
  timestamp,
}: UserPostProps) {
  const [liked, setLiked] = useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)

  return (
    <Card sx={styles.userPostWrapper}>
      <CardHeader
        avatar={<Avatar src={user.picture as string} alt={user.name} />}
        title={user.name}
        subheader={new Date(timestamp).toLocaleString()}
      />

      <Box
        sx={{
          width: '100%',
          height: 400, // Adjust this height as needed
          backgroundColor: 'black', // Fills extra space with black
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', // Ensures no extra spacing
        }}
      >
        {!imageLoaded && (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        )}
        <CardMedia
          component="img"
          image={postImage}
          alt="Post image"
          sx={{
            width: '100%', // Full width
            height: '100%', // Full height of container
            objectFit: 'contain', // Ensures aspect ratio is maintained
            display: imageLoaded ? 'block' : 'none',
          }}
          onLoad={() => setImageLoaded(true)}
        />
      </Box>

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
    m: {
      xs: 2, // margin for extra-small screens
      sm: 3, // margin for small screens
      md: 5, // margin for medium screens
    },
  },
}
