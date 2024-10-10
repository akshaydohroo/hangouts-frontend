import { TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getEmailAvailable } from '../../functions/user'
import { useDebounce } from '../../hooks/useDebounce'
import { emailAvailableQueryKey } from '../../queryKeyStore'
import { convertTime, validateEmail } from '../../utils/functions'

export default function EmailInput({
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

  const emailAvailableQuery = useQuery(emailAvailableQueryKey(debounceValue), {
    queryFn: () => getEmailAvailable(debounceValue),
    staleTime: convertTime(5, 'min', 'ms'),
    enabled:
      !!debounceValue &&
      debounceValue.length > 5 &&
      validateEmail(debounceValue) &&
      debounceValue !== defaultValue,
  })

  const [error, setError] = useState<Error | null>(null)
  useEffect(() => {
    if (error != null && setErrorExists != null) {
      setErrorExists(true)
    } else if (setErrorExists != null) {
      setErrorExists(false)
    }
  }, [error, setError])
  useEffect(() => {
    if (emailAvailableQuery.isFetched && emailAvailableQuery.data?.exists) {
      setError(new Error('Email not available'))
    } else if (emailAvailableQuery.isError) {
      setError(emailAvailableQuery.error as Error)
    } else if (value.length > 0 && value.length < 8) {
      setError(new Error('Email must be at least 8 characters'))
    } else if (value.length > 0 && !validateEmail(value)) {
      setError(new Error('Email is not valid'))
    } else {
      setError(null)
    }
  }, [
    value,
    emailAvailableQuery.isError,
    emailAvailableQuery.error,
    emailAvailableQuery.data,
    emailAvailableQuery.isFetched,
  ])

  return (
    <TextField
      disabled={!enabled}
      type="email"
      label="Email"
      autoComplete="on"
      value={value}
      onChange={onValueChangeHandler}
      name="email"
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
