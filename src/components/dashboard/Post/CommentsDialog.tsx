import { Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { createContext, useState } from 'react'
import {
  getPostComments,
  getPublicPostComments,
} from '../../../functions/comment'
import { getUserData } from '../../../functions/user'
import useAppSelector from '../../../hooks/useAppSelector'
import { UserAttributes } from '../../../models/User'
import { commentPostQueryKey, userDataQueryKey } from '../../../queryKeyStore'
import { convertTime } from '../../../utils/functions'
import Comment from '../../common/Comment'
import CreateComment from '../../common/CreateComment'

export interface UserCommentContextType {
  postId: string
  userData: UserAttributes | undefined
  parentReplyCommentId?: string | null
  setParentReplyCommentId: (commentId: string | undefined) => void
}

export const UserCommentContext = createContext<
  UserCommentContextType | undefined
>(undefined)

export default function CommentsDialog({
  open,
  onClose,
  postId,
}: {
  open: boolean
  onClose: () => void
  postId: string
}) {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const [parentReplyCommentId, setParentReplyCommentId] = useState<
    string | undefined | null
  >(undefined)
  const commentsQuery = useQuery(
    commentPostQueryKey(postId, null, isAuthenticated),
    {
      queryFn: () =>
        isAuthenticated
          ? getPostComments(postId, null)
          : getPublicPostComments(postId, null),
      staleTime: convertTime(5, 'min', 'ms'),
      enabled: open,
    }
  )

  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
  })
  const userData = userQuery.data

  const comments = commentsQuery.data
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Comments
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 10, top: 10 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <UserCommentContext.Provider
        value={{
          postId,
          userData,
          parentReplyCommentId,
          setParentReplyCommentId,
        }}
      >
        <DialogContent sx={{ height: 400, overflowY: 'auto' }}>
          {parentReplyCommentId === null && (
            <CreateComment parentCommentId={null} />
          )}
          {comments?.map(comment => (
            <Comment key={comment.commentId} {...comment} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="success"
            size="medium"
            onClick={() => {
              if (parentReplyCommentId === null) {
                setParentReplyCommentId(undefined)
              } else {
                setParentReplyCommentId(null)
              }
            }}
          >
            <Typography variant="button" color="white">
              Add Comment
            </Typography>
          </Button>
        </DialogActions>
      </UserCommentContext.Provider>
    </Dialog>
  )
}
