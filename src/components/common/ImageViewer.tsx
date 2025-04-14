import { Box, Skeleton } from '@mui/material'
import { useEffect, useLayoutEffect, useState } from 'react'
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
      setImageSrc(reader.result as string)
    }
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  useLayoutEffect(() => {
    if (!imageSrc) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.src = imageSrc

    image.onload = () => {
      const container = canvas.parentElement
      if (!container || !ctx) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      const imgAspectRatio = image.width / image.height
      const containerAspectRatio = containerWidth / containerHeight

      let drawWidth, drawHeight

      if (imgAspectRatio > containerAspectRatio) {
        // Image is wider relative to container
        drawWidth = containerWidth
        drawHeight = containerWidth / imgAspectRatio
      } else {
        // Image is taller relative to container
        drawHeight = containerHeight
        drawWidth = containerHeight * imgAspectRatio
      }

      canvas.width = drawWidth
      canvas.height = drawHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, drawWidth, drawHeight)
    }
  }, [imageSrc, canvasRef])

  return (
    <Box sx={styles.wrapper}>
      {imageSrc ? (
        <canvas ref={canvasRef} style={styles.canvas} />
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
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    maxWidth: '100%',
  },
  canvas: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}
