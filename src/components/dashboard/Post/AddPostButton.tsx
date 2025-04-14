import { AddSharp } from '@mui/icons-material'
import { Fab, Theme, useTheme } from '@mui/material'

export default function AddPostButton({
  setAddPostDialogOpen,
}: {
  setAddPostDialogOpen: () => void
}) {
  const theme = useTheme()

  return (
    <Fab
      color="primary"
      aria-label="add"
      size="large"
      onClick={setAddPostDialogOpen}
      sx={styles.fab(theme)}
    >
      <AddSharp sx={styles.icon} />
    </Fab>
  )
}

// Styles Object
const styles = {
  fab: (theme: Theme) => ({
    position: 'fixed',
    bottom: 20,
    left: 20,
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)' // Glass effect for dark mode
        : 'rgba(25, 118, 210, 0.9)', // Blue tint for light mode
    color: '#fff',
    backdropFilter: 'blur(10px)', // Glass effect
    zIndex: 1000,
  }),

  icon: {
    fontSize: 40,
  },
}
