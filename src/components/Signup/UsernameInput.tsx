import { TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getUsernameAvailable } from '../../functions/user'
import { useDebounce } from '../../hooks/useDebounce'
import { usernameAvailableQueryKey } from '../../queryKeyStore'
import { convertTime } from '../../utils/functions'

export default function UsernameInput({
  defaultValue,
  enabled = true,
  value,
  onValueChangeHandler,
  setErrorExists,
}: {
  defaultValue?: string
  enabled?: Boolean
  value: string
  onValueChangeHandler: React.ChangeEventHandler<HTMLInputElement>
  setErrorExists?: React.Dispatch<React.SetStateAction<Boolean>>
}) {
  const debounceValue = useDebounce(value, 200) as string

  const usernameAvailableQuery = useQuery(
    usernameAvailableQueryKey(debounceValue),
    {
      queryFn: () => getUsernameAvailable(debounceValue),
      staleTime: convertTime(5, 'min', 'ms'),
      enabled:
        !!debounceValue &&
        debounceValue.length > 5 &&
        debounceValue !== defaultValue,
    }
  )
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
      usernameAvailableQuery.isFetched &&
      usernameAvailableQuery.data?.exists
    ) {
      setError(new Error('Username not available'))
    } else if (usernameAvailableQuery.isError) {
      setError(usernameAvailableQuery.error as Error)
    } else if (value.length > 0 && value.length < 5) {
      setError(new Error('Username must be at least 5 characters'))
    } else {
      setError(null)
    }
  }, [
    value,
    usernameAvailableQuery.isError,
    usernameAvailableQuery.error,
    usernameAvailableQuery.data,
    usernameAvailableQuery.isFetched,
  ])

  return (
    <TextField
      disabled={!enabled}
      type="username"
      label="Username"
      autoComplete="on"
      value={value}
      onChange={onValueChangeHandler}
      name="userName"
      error={error != null}
      helperText={error?.message}
      sx={styles.textField}
    />
  )
}
const styles = {
  textField: {
    '& > p': {
      position: 'absolute',
      bottom: -20,
    },
    position: 'relative',
  },
}
