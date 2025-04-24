import { SendRounded } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { createComment } from '../../functions/comment'
import { changeCommentInCache } from '../../functions/post'
import useAppDispatch from '../../hooks/useAppDispatch'
import { commentPostQueryKey } from '../../queryKeyStore'
import { setSnackbar } from '../../redux/snackbar'
import { UserCommentContext } from '../dashboard/Post/CommentsDialog'

export default function CreateComment({
  parentCommentId,
}: {
  parentCommentId: string | null
}) {
  const userCommentContext = useContext(UserCommentContext)
  if (!userCommentContext) {
    throw new Error('UserCommentContext is not available')
  }
  const { userData, postId, setParentReplyCommentId } = userCommentContext
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const mutateReplies = useMutation({
    mutationFn: async () => {
      if (text.trim() === '') {
        setError('Comment cannot be empty')
        throw new Error('Comment cannot be empty')
      } else if (text.length > 1000) {
        setError('Comment is too long')
        throw new Error('Comment is too long')
      }
      await createComment(postId, parentCommentId, text)
    },
    onSuccess: () => {
      setText('')
      setError(null)
      setParentReplyCommentId(undefined)
      queryClient.invalidateQueries(
        commentPostQueryKey(postId, parentCommentId, true)
      )
      changeCommentInCache(queryClient, postId, 1)
      dispatch(
        setSnackbar({
          open: true,
          message: 'Comment sent successfully',
          severity: 'success',
          alertVarient: 'filled',
        })
      )
    },
    onError: (error: Error) => {
      dispatch(
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
          alertVarient: 'filled',
        })
      )
    },
  })

  if (!userData) {
    throw Error('User data is not available')
  }

  function sendComment() {}
  function setTextHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (value.length > 1000) {
      setError('Comment cannot exceed 1000 characters')
      return
    } else {
      setError(null)
      setText(value)
    }
  }

  return (
    <List disablePadding sx={styles.commentContainer}>
      <ListItem alignItems="flex-start" sx={styles.commentItem}>
        {/* Avatar */}
        <Avatar
          src={userData.picture as string}
          alt={userData.name}
          sx={styles.avatar}
        />

        <Stack sx={{ flex: 1 }}>
          {/* User info: Name & Timestamp */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={styles.author}>
              {userData.userName}
            </Typography>
            <Typography variant="caption" sx={styles.timestamp}>
              {new Date().toLocaleString()}
            </Typography>
          </Stack>
          <Box sx={styles.commentInputContainer}>
            <TextField
              error={!!error}
              helperText={
                error && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      position: 'absolute',
                      bottom: -5,
                      left: 20,
                      m: 0,
                    }}
                  >
                    {error}
                  </Typography>
                )
              }
              onChange={setTextHandler}
              multiline
              rows={2}
              type="text"
              value={text}
              autoFocus={true}
              required={true}
              name="comment"
              variant="outlined"
              placeholder="Write a comment..."
              fullWidth
              sx={{ p: 2 }}
            />
            <IconButton
              sx={styles.sendCommentButton}
              onClick={() => mutateReplies.mutate()}
            >
              <SendRounded />
            </IconButton>
          </Box>
        </Stack>
      </ListItem>
    </List>
  )
}
const styles = {
  commentContainer: {
    width: '100%',
  },
  commentItem: {
    display: 'flex',
    alignItems: 'flex-start',
    px: 2,
    py: 1.5,
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  avatar: {
    width: 40,
    height: 40,
    mr: 1.5,
  },
  author: {
    fontWeight: 600,
    color: 'primary.main',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: 'text.secondary',
  },
  commentInputContainer: {
    position: 'relative',
    minWidth: '250px',
  },
  sendCommentButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    color: 'primary.main',
    backgroundColor: 'background.paper',
  },
}
