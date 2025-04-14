import { AddAPhoto } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Input } from '@mui/material'
import imageCompression, { Options } from 'browser-image-compression'
import { useState } from 'react'
import useAppDispatch from '../../hooks/useAppDispatch'
import { setSnackbar } from '../../redux/snackbar'

export default function ImageUpload({
  setImage,
}: {
  setImage: (file: File) => void
}) {
  const dispatch = useAppDispatch()
  const [progress, setProgress] = useState<number | null>(null)
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }
      const compressedFile = await imageCompression(file, options)
      setImage(compressedFile)
    } catch (err: Error | any) {
      dispatch(
        setSnackbar({
          message: `${err?.message ?? 'Image upload failed'}`,
          severity: 'error',
          alertVarient: 'filled',
        })
      )
    }
  }
  const handleImageUploadProgress = (progress: number) => {
    setProgress(progress)
  }
  const options: Options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress: handleImageUploadProgress, // optional, a function takes one progress argument (percentage from 0 to 100)
  }

  return (
    <Box>
      <label htmlFor="upload-photo">
        <Input
          id="upload-photo"
          type="file"
          sx={{ display: 'none' }}
          onChange={handleFileUpload}
          inputProps={{ accept: '.jpg,.jpeg,.png' }}
        />
        {progress && progress < 100 ? (
          <CircularProgress value={progress} />
        ) : (
          <IconButton component="span" sx={styles.uploadImageButton}>
            <AddAPhoto sx={styles.uploadImageIcon} />
          </IconButton>
        )}
      </label>
    </Box>
  )
}

const styles = {
  uploadImageButton: {
    p: 1,
  },
  uploadImageIcon: {
    fontSize: '100px',
  },
}
