import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ReplySharp,
} from '@mui/icons-material'
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import { getPostComments, getPublicPostComments } from '../../functions/comment'
import useAppSelector from '../../hooks/useAppSelector'
import { CommentWithAuthor } from '../../models/Comment'
import { commentPostQueryKey } from '../../queryKeyStore'
import { abbreviateNumber, convertTime } from '../../utils/functions'
import { UserCommentContext } from '../dashboard/Post/CommentsDialog'
import CreateComment from './CreateComment'

const Comment: React.FC<CommentWithAuthor> = comment => {
  const userCommentContext = useContext(UserCommentContext)

  if (!userCommentContext) {
    throw new Error('UserCommentContext is not available')
  }
  const { parentReplyCommentId, setParentReplyCommentId } = userCommentContext

  const [repliesOpen, setRepliesOpen] = useState(false)

  const isAuthenticated = useAppSelector(state => state.authenticated.value)
  const childCommentsQuery = useQuery(
    commentPostQueryKey(comment.postId, comment.commentId, isAuthenticated),
    {
      queryFn: () =>
        isAuthenticated
          ? getPostComments(comment.postId, comment.commentId)
          : getPublicPostComments(comment.postId, comment.commentId),
      staleTime: convertTime(5, 'min', 'ms'),
    }
  )

  const handleToggle = () => {
    setRepliesOpen(!repliesOpen)
  }

  const childCommentsWithAuthor = childCommentsQuery.data

  return (
    <List disablePadding sx={styles.commentContainer}>
      <ListItem alignItems="flex-start" sx={styles.commentItem}>
        {/* Avatar */}
        <Avatar
          src={comment.author.picture as string}
          alt={comment.author.name}
          sx={styles.avatar}
        />

        <Stack sx={{ flex: 1 }}>
          {/* User info: Name & Timestamp */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={styles.author}>
              {comment.author.name}
            </Typography>
            <Typography variant="caption" sx={styles.timestamp}>
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Stack>

          {/* Comment Text */}
          <Typography variant="body1" sx={styles.commentText}>
            {comment.text}
          </Typography>

          {/* Reply Button */}
          <List sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>
            {childCommentsWithAuthor && childCommentsWithAuthor.length > 0 && (
              <ListItemButton onClick={handleToggle} sx={styles.repliesButton}>
                {abbreviateNumber(childCommentsWithAuthor.length)}
                {repliesOpen ? (
                  <KeyboardArrowUp sx={styles.icon} />
                ) : (
                  <KeyboardArrowDown sx={styles.icon} />
                )}
                <Typography variant="body2">
                  {repliesOpen ? 'Hide Replies' : 'View Replies'}
                </Typography>
              </ListItemButton>
            )}
            <ListItemButton
              sx={styles.replyButton}
              onClick={() => {
                if (parentReplyCommentId === comment.commentId) {
                  setParentReplyCommentId(undefined)
                } else {
                  setParentReplyCommentId(comment.commentId)
                }
              }}
              disabled={!isAuthenticated}
            >
              <ReplySharp sx={styles.icon} />
              <Typography variant="body2">Reply</Typography>
            </ListItemButton>
          </List>
        </Stack>
      </ListItem>

      <List component="div" disablePadding sx={styles.replyContainer}>
        {/* Nested Comments */}
        {parentReplyCommentId === comment.commentId && (
          <CreateComment parentCommentId={comment.commentId} />
        )}
        {repliesOpen &&
          childCommentsWithAuthor &&
          childCommentsWithAuthor.length > 0 &&
          childCommentsWithAuthor.map(
            (child: CommentWithAuthor, index: number) => (
              <Comment key={index} {...child} />
            )
          )}
      </List>
    </List>
  )
}

// Styles Object
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
  commentText: {
    fontSize: '0.95rem',
    color: 'text.primary',
    mt: 0.5,
  },
  replyButton: {
    fontSize: '0.85rem',
    textTransform: 'none',
    color: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mt: 0.5,
    maxWidth: '150px',
    width: '20%',
  },
  repliesButton: {
    fontSize: '0.85rem',
    textTransform: 'none',
    color: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mt: 0.5,
    maxWidth: '150px',
    width: '20%',
  },
  icon: {
    fontSize: 18,
  },
  replyContainer: {
    pl: 4, // Small left padding
    borderLeft: '1.5px dotted',
    borderColor: 'divider',
  },
}

export default Comment
