import { Send } from '@mui/icons-material'
import {
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Theme,
  useTheme,
} from '@mui/material'
import { useState } from 'react'

export default function SendMessageBox({
  onSend,
  disabled = false,
}: {
  onSend: (message: string) => void
  disabled?: boolean
}) {
  const [message, setMessage] = useState('')
  const theme = useTheme()

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Paper elevation={2} sx={styles.container(theme)}>
      <TextField
        placeholder="Type your message..."
        variant="outlined"
        size="small"
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={disabled}
        InputProps={{
          sx: styles.input(theme),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSend}
                disabled={disabled || !message.trim()}
                sx={styles.sendButton(theme)}
              >
                <Send fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  )
}
const styles = {
  container: (theme: Theme) => ({
    p: 1,
    borderRadius: theme.shape.borderRadius,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  }),
  input: (theme: Theme) => ({
    fontSize: 14,
    '& .MuiOutlinedInput-root': {
      paddingRight: 0,
    },
  }),
  sendButton: (theme: Theme) => ({
    color: theme.palette.primary.main,
    '&:disabled': {
      color: theme.palette.action.disabled,
    },
  }),
}
