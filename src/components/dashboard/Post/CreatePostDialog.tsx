import { Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { createPost } from '../../../functions/post'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { invalidateUserPosts } from '../../../invalidateQueries'
import { setSnackbar } from '../../../redux/snackbar'
import ImageUpload from '../../common/ImageUpload'
import ImageViewer from '../../common/ImageViewer'

export default function CreatePostDialog({
  addPostDialogOpen,
  setAddPostDialogClose,
}: {
  addPostDialogOpen: boolean
  setAddPostDialogClose: () => void
}) {
  const dispatch = useAppDispatch()
  const [postText, setPostText] = useState('')
  const [postImage, setPostImage] = useState<File | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!addPostDialogOpen) {
      setPostImage(null)
      setPostText('')
    }
  }, [addPostDialogOpen])

  const postCanvasRef = useRef<HTMLCanvasElement>(null)

  const submitPost = () => {
    postCanvasRef.current?.toBlob(async blob => {
      if (blob) {
        try {
          if (postText === '') {
            throw Error('Post text is required')
          }

          const postImageFile = new File([blob], 'post.webp', {
            type: 'image/webp',
          })
          await createPost(postImageFile, postText)
          queryClient.invalidateQueries({
            predicate: ({ queryKey }) => {
              return invalidateUserPosts(queryKey)
            },
          })
          setPostImage(null)
          setPostText('')
          dispatch(
            setSnackbar({
              message: 'Post created successfully',
              severity: 'success',
              alertVarient: 'filled',
            })
          )
        } catch (err: Error | any) {
          dispatch(
            setSnackbar({
              message: `${err?.message ?? 'Post creation failed'}`,
              severity: 'error',
              alertVarient: 'filled',
            })
          )
        }
      } else {
        console.error('Post Blob is null')
        dispatch(
          setSnackbar({
            message: 'Post creation failed',
            severity: 'error',
            alertVarient: 'filled',
          })
        )
      }
    })
  }

  return (
    <Dialog
      open={addPostDialogOpen}
      onClose={setAddPostDialogClose}
      sx={styles.dialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={styles.title}>
        Create a Post
        <IconButton onClick={setAddPostDialogClose} sx={styles.closeButton}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <Box sx={styles.imageUploadWrapper}>
          {postImage ? (
            <ImageViewer imageFile={postImage} canvasRef={postCanvasRef} />
          ) : (
            <ImageUpload setImage={setPostImage} />
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          required={true}
          rows={2}
          placeholder="Write a caption..."
          variant="outlined"
          value={postText}
          onChange={e => setPostText(e.target.value)}
          sx={styles.textField}
        />
      </DialogContent>
      <DialogActions sx={styles.actions}>
        <Button onClick={setAddPostDialogClose} sx={styles.cancelButton}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={styles.postButton}
          disabled={postImage == null || postText === ''}
          onClick={submitPost}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const styles = {
  dialog: {
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    textAlign: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: 'text.secondary',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    px: 3,
    py: 2,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: 3,
  },
  image: {
    width: '100%',
    borderRadius: '12px',
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
    },
    mt: 2,
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    width: '100%',
    height: 400,
    borderRadius: '12px',
    background: 'rgba(25, 118, 210, 0.9)',
    color: '#fff',
    '&:hover': {
      background: 'rgba(21, 101, 192, 0.9)',
    },
  },
  uploadIcon: {
    fontSize: 28,
  },
  actions: {
    justifyContent: 'space-between',
    px: 3,
    pb: 2,
  },
  cancelButton: {
    color: 'text.secondary',
  },
  postButton: {
    borderRadius: 3,
  },
  imageUploadWrapper: {
    height: {
      xs: '40vh',
      sm: '50vh',
      md: '60vh',
    },
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}
