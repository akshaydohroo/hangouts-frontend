import {
  ChatBubbleOutlineRounded,
  ChatBubbleTwoTone,
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
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { PostWithUser } from '../../../models/Post'
import { abbreviateNumber } from '../../../utils/functions'
import CommentsDialog from './CommentsDialog'
import PostReaction from './PostReaction'

export default function UserPost({ post }: { post: PostWithUser }) {
  const {
    postId,
    caption,
    likes,
    commentsCount,
    picture: postImage,
    user: author,
    createdAt: timestamp,
  } = post

  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState<boolean>(false)

  return (
    <Card sx={styles.userPostWrapper}>
      <CardHeader
        avatar={<Avatar src={author.picture as string} alt={author.name} />}
        title={author.name}
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
        <Stack direction="row" alignItems={'center'} sx={{ ml: 0.5 }}>
          <Stack direction="row" alignItems={'center'} sx={{ mb: 0.5 }}>
            <PostReaction postId={post.postId} />
            <Typography variant="button">{abbreviateNumber(likes)}</Typography>
          </Stack>
          <Stack direction="row" alignItems={'center'}>
            <IconButton onClick={() => setCommentDialogOpen(true)}>
              {commentDialogOpen ? (
                <ChatBubbleTwoTone color="success" />
              ) : (
                <ChatBubbleOutlineRounded />
              )}
            </IconButton>

            <Typography variant="button">
              {abbreviateNumber(commentsCount)}
            </Typography>
          </Stack>
          <IconButton>
            <Send />
          </IconButton>
        </Stack>
      </CardActions>
      <CommentsDialog
        open={commentDialogOpen}
        onClose={() => setCommentDialogOpen(false)}
        postId={postId}
      />
      {/* Caption */}
      <Typography variant="body2" sx={{ padding: '0 16px 16px', ml: 0.5 }}>
        <strong>{author.name}</strong> {caption}
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
