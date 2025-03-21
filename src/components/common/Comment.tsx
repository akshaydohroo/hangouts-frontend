import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { getPublicPostComments } from '../../functions/comment'
import { CommentWithAuthor } from '../../models/Comment'
import { commentPostQueryKey } from '../../queryKeyStore'
import { abbreviateNumber, convertTime } from '../../utils/functions'

const Comment: React.FC<CommentWithAuthor> = comment => {
  const [open, setOpen] = useState(false)

  const childCommentsQuery = useQuery(
    commentPostQueryKey(comment.postId, comment.commentId),
    {
      queryFn: () => getPublicPostComments(comment.postId, comment.commentId),
      staleTime: convertTime(5, 'min', 'ms'),
    }
  )

  const handleToggle = () => {
    setOpen(!open)
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
          {childCommentsWithAuthor && childCommentsWithAuthor.length > 0 && (
            <ListItemButton onClick={handleToggle} sx={styles.replyButton}>
              {abbreviateNumber(childCommentsWithAuthor.length)}
              {open ? (
                <KeyboardArrowUp sx={styles.icon} />
              ) : (
                <KeyboardArrowDown sx={styles.icon} />
              )}
            </ListItemButton>
          )}
        </Stack>
      </ListItem>

      {/* Nested Comments */}
      {open &&
        childCommentsWithAuthor &&
        childCommentsWithAuthor.length > 0 && (
          <List component="div" disablePadding sx={styles.replyContainer}>
            {childCommentsWithAuthor.map((child, index) => (
              <Comment key={index} {...child} />
            ))}
          </List>
        )}
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
    color: 'secondary.main',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    mt: 0.5,
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
