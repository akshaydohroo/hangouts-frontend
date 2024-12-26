import SendIcon from '@mui/icons-material/Send'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import { Box, IconButton, Stack } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { createRef, useState } from 'react'
import { createStory } from '../../../functions/story'
import useAppDispatch from '../../../hooks/useAppDispatch'
import { invalidateUserStories } from '../../../invalidateQueries'
import { setSnackbar } from '../../../redux/snackbar'
import ImageUpload from '../../common/ImageUpload'
import ImageViewer from '../../common/ImageViewer'

export default function CreateStory() {
  const dispatch = useAppDispatch()
  const [storyImage, setStoryImage] = useState<File | null>(null)
  const storyCanvasRef = createRef<HTMLCanvasElement>()
  const queryClient = useQueryClient()

  function submitStory() {
    storyCanvasRef.current?.toBlob(async blob => {
      if (blob) {
        try {
          const storyImageFile = new File([blob], 'story.webp', {
            type: 'image/webp',
          })

          await createStory(storyImageFile)
          queryClient.invalidateQueries({
            predicate: ({ queryKey }) => {
              return invalidateUserStories(queryKey)
            },
          })
          setStoryImage(null)
          dispatch(
            setSnackbar({
              message: 'Story created successfully',
              severity: 'success',
              alertVarient: 'filled',
            })
          )
        } catch (err: Error | any) {
          dispatch(
            setSnackbar({
              message: `${err?.message ?? 'Story creation failed'}`,
              severity: 'error',
              alertVarient: 'filled',
            })
          )
        }
      }
    })
  }

  return (
    <Box sx={styles.createStoryBox}>
      {storyImage ? (
        <Stack sx={styles.editStoryWrapper}>
          <Box sx={styles.imageViewerWrapper}>
            <ImageViewer imageFile={storyImage} canvasRef={storyCanvasRef} />
          </Box>
          <Stack direction="row" sx={styles.createStoryButtonsWrapper}>
            <IconButton>
              <TextFieldsIcon sx={styles.textAddIcon} />
            </IconButton>
            <IconButton onClick={submitStory}>
              <SendIcon sx={styles.storySendIcon} />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        <ImageUpload setImage={setStoryImage} />
      )}
    </Box>
  )
}

const styles = {
  editStoryWrapper: {
    height: '100%',
    width: '100%',
  },
  createStoryBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '75vh',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  createStoryButton: {
    p: 1,
  },
  createStoryIcon: {
    fontSize: '50px',
  },
  imageEditorStyles: {},
  createStoryButtonsWrapper: {
    height: '10%',
    width: '100%',
    justifyContent: 'right',
    backgroundColor: 'rgba(0,0,0,0.1)',
    '& > *': {
      ml: 1,
    },
  },
  imageViewerWrapper: {
    height: '90%',
    width: '100%',
    p: 0,
  },
  textAddIcon: {
    fontSize: 26,
    '&:hover': {
      color: 'primary.main',
    },
  },
  storySendIcon: {
    fontSize: 26,
    mr: 2,
    '&:hover': {
      color: 'primary.main',
    },
  },
}
