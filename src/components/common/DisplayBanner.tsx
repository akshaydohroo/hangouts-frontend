import CloseIcon from '@mui/icons-material/Close'
import { Alert, Box, IconButton, Theme, Typography } from '@mui/material'
import { useState } from 'react'

interface BannerProps {
  message: string
  severity?: 'info' | 'error' | 'success' | 'warning'
  onClose?: () => void
}

export default function DisplayBanner({
  message,
  severity = 'info',
  onClose,
}: BannerProps) {
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <Box sx={styles.container}>
      <Alert
        severity={severity}
        sx={theme => styles.alert(theme, severity)}
        icon={false}
        action={
          <IconButton
            onClick={() => {
              onClose && onClose()
              setOpen(false)
            }}
            sx={styles.closeButton}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Typography variant="body2" sx={styles.text}>
          {message}
        </Typography>
      </Alert>
    </Box>
  )
}

const styles = {
  container: {
    width: '100%',
    px: 2,
    py: 1,
  },
  alert: (theme: Theme, severity: string) => ({
    backgroundColor: `${severity}.light`,
    color: `${severity}.contrastText`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  }),
  text: {
    fontWeight: 500,
  },
  closeButton: {
    color: 'inherit',
    p: 0.5,
  },
}
