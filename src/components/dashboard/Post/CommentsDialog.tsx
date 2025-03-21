import { Close } from '@mui/icons-material'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getPublicPostComments } from '../../../functions/comment'
import { commentPostQueryKey } from '../../../queryKeyStore'
import { convertTime } from '../../../utils/functions'
import Comment from '../../common/Comment'

export default function CommentsDialog({
  open,
  onClose,
  postId,
}: {
  open: boolean
  onClose: () => void
  postId: string
}) {
  const commentsQuery = useQuery(commentPostQueryKey(postId, null), {
    queryFn: () => getPublicPostComments(postId, null),
    staleTime: convertTime(5, 'min', 'ms'),
    enabled: open,
  })

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

      <DialogContent sx={{ height: 400, overflowY: 'auto' }}>
        {comments?.map(comment => (
          <Comment key={comment.commentId} {...comment} />
        ))}
      </DialogContent>
    </Dialog>
  )
}
