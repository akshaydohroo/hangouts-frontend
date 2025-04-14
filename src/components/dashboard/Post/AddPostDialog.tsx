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
  useTheme,
} from '@mui/material'
import { createRef, useEffect, useRef, useState } from 'react'
import ImageUpload from '../../common/ImageUpload'
import ImageViewer from '../../common/ImageViewer'

export default function AddPostDialog({
  addPostDialogOpen,
  setAddPostDialogClose,
}: {
  addPostDialogOpen: boolean
  setAddPostDialogClose: () => void
}) {
  const theme = useTheme()
  const [postText, setPostText] = useState('')
  const [postImage, setPostImage] = useState<File | null>(null)
  const storyCanvasRef = createRef<HTMLCanvasElement>()

  useEffect(() => {
    if (!addPostDialogOpen) {
      setPostImage(null)
      setPostText('')
    }
  }, [addPostDialogOpen])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // function submitPost() {

  //     const imageFile = base64ToFile(image as string , "image/post")

  //           await createPost(imageFile,postText)
  //           queryClient.invalidateQueries({
  //             predicate: ({ queryKey }) => {
  //               return invalidateUserStories(queryKey)
  //             },
  //           })
  //           setStoryImage(null)
  //           dispatch(
  //             setSnackbar({
  //               message: 'Story created successfully',
  //               severity: 'success',
  //               alertVarient: 'filled',
  //             })
  //           )
  //         } catch (err: Error | any) {
  //           dispatch(
  //             setSnackbar({
  //               message: `${err?.message ?? 'Story creation failed'}`,
  //               severity: 'error',
  //               alertVarient: 'filled',
  //             })
  //           )
  //         }
  //       }
  //     })
  //   }

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
            // <Box
            //   sx={{
            //     width: '100%',
            //     height: 400, // Adjust this height as needed
            //     backgroundColor: 'black', // Fills extra space with black
            //     display: 'flex',
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //     overflow: 'hidden', // Ensures no extra spacing
            //   }}
            // >
            //   <CardMedia
            //     component="img"
            //     image={image}
            //     alt="Post image"
            //     sx={{
            //       width: '100%', // Full width
            //       height: '100%', // Full height of container
            //       objectFit: 'contain', // Ensures aspect ratio is maintained
            //     }}
            //   />
            // </Box>
            <ImageViewer imageFile={postImage} canvasRef={storyCanvasRef} />
          ) : (
            <ImageUpload setImage={setPostImage} />
            // <Button
            //   component="label"
            //   variant="contained"
            //   sx={styles.uploadButton}
            // >
            //   <AddPhotoAlternate sx={styles.uploadIcon} />
            //   Upload Image
            //   <input
            //     type="file"
            //     accept="image/*"
            //     hidden
            //     onChange={handleFileChange}
            //   />
            // </Button>
          )}
        </Box>
        <TextField
          fullWidth
          multiline
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
        <Button variant="contained" color="primary" sx={styles.postButton}>
          Post
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// 🌟 Styles Object
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
