import { Box, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import 'react-resizable/css/styles.css'

export default function ImageViewer({
  imageFile,
  canvasRef,
}: {
  imageFile: File
  canvasRef: React.RefObject<HTMLCanvasElement>
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageSrc(reader.result as string) // Set the data URL to state
    }
    reader.readAsDataURL(imageFile) // Convert the file to a data URL
  }, [imageFile])

  useEffect(() => {
    if (imageSrc) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      const image = new Image()
      image.src = imageSrc
      image.onload = () => {
        if (canvas && ctx) {
          canvas.width = image.width
          canvas.height = image.height
          ctx.drawImage(image, 0, 0)
        }
      }
    }
  }, [imageSrc])

  return (
    <Box sx={styles.wrapper}>
      {imageSrc ? (
        <canvas ref={canvasRef} style={styles.canvas}>
          <img src={imageSrc} style={styles.image as React.CSSProperties} />
        </canvas>
      ) : (
        <Skeleton height="90%" width="90%" />
      )}
    </Box>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'start',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  imgWrapper: {
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    objectFit: 'contain',
    height: '100%',
    width: '100%',
  },
  canvas: {
    height: '100%',
  },
}
