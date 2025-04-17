import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function AuthBannerModern() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  // Removed unused theme variable
  const [open, setOpen] = useState(true) // Ensure dialog is open initially

  if (!open) return null

  const handleClose = () => setOpen(false)

  const handleLogin = () => navigate('/login')
  const handleRegister = () => navigate('/signup')

  const bannerContent = (
    <>
      <Typography variant="h6" sx={styles.title}>
        Unlock Core Features
      </Typography>
      <Typography variant="body2" sx={styles.subtitle}>
        Sign in or create an account to react, comment, and personalize your
        experience.
      </Typography>

      <Stack direction="column" spacing={1.5} sx={styles.buttonGroup}>
        <Button variant="contained" fullWidth onClick={handleLogin}>
          Log In
        </Button>
        <Button variant="outlined" fullWidth onClick={handleRegister}>
          Register
        </Button>
      </Stack>
    </>
  )

  return isMobile ? (
    <Dialog open={open} onClose={handleClose} fullWidth sx={styles.dialog}>
      <DialogTitle sx={styles.dialogTitle}>
        Welcome
        <IconButton onClick={handleClose} sx={styles.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{bannerContent}</DialogContent>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={handleClose}>Maybe later</Button>
      </DialogActions>
    </Dialog>
  ) : (
    <Box sx={styles.container}>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={styles.bannerWrapper}
      >
        {bannerContent}
      </Stack>
    </Box>
  )
}

const styles = {
  container: {
    width: '100%',
    padding: 2,
    margin: 2,
    backgroundColor: 'background.paper',
    border: `1px solid divider`,
    borderRadius: 4, // Directly using a value for border radius
    boxShadow: 1, // Assuming a shadow value
    height: '20%',
  },
  bannerWrapper: {
    position: 'relative',
  },
  title: {
    textAlign: 'center',
    fontWeight: 600,
    color: 'text.primary',
    marginBottom: 1,
  },
  subtitle: {
    textAlign: 'center',
    color: 'text.secondary',
    marginBottom: 2,
    paddingX: 2,
  },
  buttonGroup: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1.5,
    marginTop: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 1,
    top: 1,
    color: 'text.secondary',
  },
  dialog: {},
  dialogTitle: {
    fontWeight: 800,
    pb: 0,
    textAlign: 'center',
  },
  dialogActions: {
    justifyContent: 'center',
    paddingBottom: 2,
  },
}
