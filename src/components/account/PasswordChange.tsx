import { Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'

export default function PasswordChange({
  enabled = true,
  sxStyles,
  onChangeHandler,
  setErrorExists,
}: {
  enabled: Boolean
  sxStyles?: {
    inputsWrapper?: any
    password?: any
    retypePassword?: any
  }
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>
  setErrorExists?: React.Dispatch<React.SetStateAction<Boolean>>
}) {
  const [password, setPassword] = useState<string>('')
  const [retypePassword, setRetypePassword] = useState<string>('')
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    if (error != null && setErrorExists != null) {
      setErrorExists(true)
    } else if (setErrorExists != null) {
      setErrorExists(false)
    }
  }, [error, setError])
  useEffect(() => {
    if (
      password.length > 0 &&
      (password.length < 8 || password !== retypePassword)
    ) {
      if (password.length < 8) {
        setError(new Error('Password must be at least 8 characters'))
        return
      } else {
        setError(new Error('Passwords do not match'))
        return
      }
    } else {
      if (password.length > 0) {
        onChangeHandler({
          target: { value: password, name: 'password' },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      setError(null)
    }
  }, [password, retypePassword, error, setError])
  return (
    <Stack sx={{ ...sxStyles?.inputsWrapper }}>
      <TextField
        sx={{ ...sxStyles?.password }}
        type="password"
        label="Password"
        variant="outlined"
        disabled={!enabled}
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        sx={{ ...styles.retypePassword, ...sxStyles?.retypePassword }}
        type="password"
        label="Retype Password"
        variant="outlined"
        disabled={!enabled}
        name="password"
        value={retypePassword}
        error={error != null}
        helperText={error?.message}
        onChange={e => setRetypePassword(e.target.value)}
      />
    </Stack>
  )
}
const styles = {
  retypePassword: {
    '& > p': {
      position: 'absolute',
      bottom: -20,
    },
    position: 'relative',
  },
}
