import {
  ChatBubbleOutlineRounded,
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
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPublicPostCommentsCount } from '../../../functions/comment'
import { PostWithUser } from '../../../models/Post'
import { commentsPostCountQueryKey } from '../../../queryKeyStore'
import { abbreviateNumber, convertTime } from '../../../utils/functions'
import CommentsDialog from './CommentsDialog'

export default function UserPost({ post }: { post: PostWithUser }) {
  const {
    postId,
    caption,
    likes,
    picture: postImage,
    user: author,
    createdAt: timestamp,
  } = post
  const [liked, setLiked] = useState<boolean>(false)
  const [imageLoaded, setImageLoaded] = useState<boolean>(false)
  const [commentDialogOpen, setCommentDialogOpen] = useState<boolean>(false)

  const commentsCountQuery = useQuery(commentsPostCountQueryKey(postId), {
    queryFn: () => getPublicPostCommentsCount(postId),
    staleTime: convertTime(5, 'min', 'ms'),
  })

  console.log(commentsCountQuery.data)
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
            <IconButton
              onClick={() => setLiked(!liked)}
              color={liked ? 'error' : 'default'}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="button">{abbreviateNumber(likes)}</Typography>
          </Stack>
          <Stack direction="row" alignItems={'center'}>
            <IconButton onClick={() => setCommentDialogOpen(true)}>
              <ChatBubbleOutlineRounded
                color={commentDialogOpen ? 'success' : 'inherit'}
              />
            </IconButton>

            <Typography variant="button">
              {abbreviateNumber(commentsCountQuery.data?.count || 0)}
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
