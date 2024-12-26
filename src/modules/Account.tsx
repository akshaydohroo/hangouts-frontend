import { Button, Stack, SvgIcon, TextField, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { ReactComponent as AccountSVG } from '../assets/icons/account_settings.svg'
import PasswordChange from '../components/account/PasswordChange'
import VisibitySelect from '../components/account/VisibilitySelect'
import AvatarUpload from '../components/common/AvatarUpload'
import EmailInput from '../components/Signup/EmailInput'
import GenderInput from '../components/Signup/GenderInput'
import UsernameInput from '../components/Signup/UsernameInput'
import { getUserData, mutateUserData } from '../functions/user'
import useAppDispatch from '../hooks/useAppDispatch'
import { User, UserAttributesChange } from '../models/User'
import { userDataQueryKey } from '../queryKeyStore'
import { setError } from '../redux/error'
import { setSnackbar } from '../redux/snackbar'
import {
  convertTime,
  extractErrorDetailFromErrorQuery,
} from '../utils/functions'
import { ErrorDetails } from '../utils/types'

export default function Account() {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
  })
  useEffect(() => {
    if (userQuery.isLoading) {
      dispatch(
        setSnackbar({ message: 'Loading user data...', severity: 'info' })
      )
    }
    if (userQuery.isError) {
      dispatch(setError(extractErrorDetailFromErrorQuery(userQuery.error)))
    }
    if (userQuery.isFetched && userQuery.data == null) {
      dispatch(
        setError(new ErrorDetails('User data not found', 'User data not found'))
      )
    }
  }, [
    userQuery.isLoading,
    userQuery.isError,
    userQuery.isFetched,
    userQuery.data,
    userQuery.error,
    dispatch,
  ])

  const [formEnabled, setFormEnabled] = useState<Boolean>(false)
  const [errorExists, setErrorExists] = useState<Boolean>(false)
  const [formData, setFormData] = useState<UserAttributesChange>(
    new User({
      name: '',
      email: '',
      picture: '',
      userName: '',
      birthDate: '',
      password: '',
      gender: '',
      visibility: '',
    })
  )
  useEffect(() => {
    setFormEnabled(true)
    if (userQuery.data) {
      const userData = { ...userQuery.data }
      userData.picture = ''
      userData.birthDate =
        userData.birthDate &&
        new Date(userData.birthDate).toISOString().split('T')[0]
      setFormData(userData)
    }
  }, [userQuery.data])
  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData((oldValue: UserAttributesChange) => ({
      ...oldValue,
      [event.target.name]: !!event.target.files
        ? (event.target.files?.item(0) as File)
        : event.target.value,
    }))
  }
  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (errorExists) {
      dispatch(
        setSnackbar({
          message: 'Please fix the form errors',
          severity: 'error',
        })
      )
      return
    }
    updateUserMutation.mutate(formData)
  }
  const updateUserMutation = useMutation(mutateUserData, {
    onSuccess: updatedUserData => {
      dispatch(
        setSnackbar({
          message: 'User data updated successfully',
          severity: 'success',
        })
      )
      queryClient.setQueryData(userDataQueryKey, updatedUserData)
    },
    onError: error => {
      if (error instanceof Error) {
        dispatch(setError(new ErrorDetails(error.name, error.message)))
      } else {
        dispatch(setError(new ErrorDetails('Unknown error', 'Unknown error')))
      }
    },
  })

  return (
    <Stack sx={styles.account}>
      <SvgIcon component={AccountSVG} sx={styles.svg} inheritViewBox />
      <Stack
        spacing={3}
        width="100%"
        maxWidth="600px"
        component="form"
        onSubmit={onSubmitHandler}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Account Settings
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Name"
            variant="outlined"
            value={formData.name}
            disabled={!formEnabled}
            name="name"
            onChange={onChangeHandler}
            fullWidth
          />
          <Stack sx={styles.inputsWrapper}>
            <EmailInput
              value={formData.email}
              onValueChangeHandler={onChangeHandler}
              enabled={formEnabled}
              defaultValue={userQuery.data?.email}
              setErrorExists={setErrorExists}
            />
            <UsernameInput
              value={formData.userName}
              onValueChangeHandler={onChangeHandler}
              enabled={formEnabled}
              defaultValue={userQuery.data?.userName}
              setErrorExists={setErrorExists}
            />
          </Stack>
          <Stack sx={styles.inputsWrapper}>
            <GenderInput
              enabled={formEnabled}
              styles={styles.genderInputStyles}
              value={formData.gender}
              onChangeHandler={onChangeHandler}
            />
            <TextField
              disabled={!formEnabled}
              label="Date Of Birth"
              type="date"
              value={formData.birthDate}
              onChange={onChangeHandler}
              name="birthDate"
            />
          </Stack>
          <Stack sx={styles.inputsWrapper}>
            <VisibitySelect
              enabled={formEnabled}
              value={formData.visibility}
              onChangeHandler={onChangeHandler}
            />
            <AvatarUpload
              enabled={formEnabled}
              name={'picture'}
              value={formData.picture}
              onChangeHandler={onChangeHandler}
            />
          </Stack>
          <PasswordChange
            sxStyles={{ inputsWrapper: styles.inputsWrapper }}
            enabled={formEnabled}
            onChangeHandler={onChangeHandler}
            setErrorExists={setErrorExists}
          />
          <Button variant="contained" type="submit" size="large">
            Submit
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

const styles = {
  account: {
    width: '100vw',
    height: '100%', // Ensure the component takes the full height
    px: 4,
    flex: 1,
    py: 2,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
    '& > *': {
      mx: 4,
    },
  },
  svg: {
    height: 'auto',
    width: {
      xs: '70vw',
      sm: '60vw',
      md: '40vw',
    },
    color: 'inherit',
  },
  genderInputStyles: {},
  inputsWrapper: {
    py: 1,
    display: 'flex',
    '& > *': {
      flex: 1,
    },
    '& > div:first-of-type': {
      mr: {
        xs: 0,
        lg: 2,
      },
      mb: {
        xs: 4,
        lg: 0,
      },
    },
    flexDirection: {
      xs: 'column',
      lg: 'row',
    },
  },
}
