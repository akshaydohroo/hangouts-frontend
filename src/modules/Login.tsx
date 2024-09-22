import { AccountCircle } from '@mui/icons-material'
import KeyIcon from '@mui/icons-material/Key'
import { Button, Stack, SvgIcon, TextField } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import { ReactComponent as LoginSvg } from '../assets/icons/login.svg'
import GoogleLogin from '../components/common/GoogleLogin'
import { User } from '../models/User'
import useAppDispatch from '../hooks/useAppDispatch'
import { setError } from '../redux/error'
import { ErrorDetails } from '../utils/types'
import { useQueryClient } from '@tanstack/react-query'
export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const [loginForm, setLoginForm] = React.useState<{
    userId: string
    password: string
  }>({
    userId: '',
    password: '',
  })
  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setLoginForm(oldValue => ({
      ...oldValue,
      [event.target.name]: event.target.value,
    }))
  }
  return (
    <Stack sx={styles.login}>
      <SvgIcon component={LoginSvg} sx={styles.svg} inheritViewBox />
      <Stack sx={styles.formWrapper}>
        <form
          onSubmit={event => {
            event.preventDefault()
            User.login(loginForm.userId, loginForm.password)
              .then(() => {
                return queryClient.resetQueries()
              })
              .then(() => {
                navigate('/')
              })
              .catch((err: Error) => {
                dispatch(setError(new ErrorDetails(err.name, err.message)))
              })
          }}
        >
          <TextField
            InputProps={{ startAdornment: <AccountCircle sx={{ mr: 1 }} /> }}
            label="Username or Email"
            type="text"
            autoComplete="on"
            value={loginForm.userId}
            onChange={onChangeHandler}
            name="userId"
          />
          <TextField
            InputProps={{ startAdornment: <KeyIcon sx={{ mr: 1 }} /> }}
            label="Password"
            type="password"
            autoComplete="on"
            value={loginForm.password}
            onChange={onChangeHandler}
            name="password"
          />
          <Stack sx={styles.submitAndOAuth}>
            <Button variant="contained" type="submit" sx={styles.submitbutton}>
              Submit
            </Button>
            <GoogleLogin text="login" />
          </Stack>
        </form>
      </Stack>
    </Stack>
  )
}

const styles = {
  login: {
    minHeight: '100vh',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  },
  svg: {
    height: 'auto',
    width: {
      xs: '90vw',
      sm: '70vw',
      md: '60vw',
    },
    color: 'inherit',
  },
  formWrapper: {
    '& > form': {
      display: 'flex',
      flexDirection: 'column',
      width: {
        xs: '80vw',
        sm: '60vw',
        md: '30vw',
      },
      '& > *': {
        my: 1.5,
      },
    },
  },
  submitAndOAuth: {
    width: '100%',
    '& > :first-of-type': {
      flex: 1,
      mb: {
        xs: 1.5,
        sm: 0,
      },
      mr: {
        sm: 3,
      },
    },
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
  },
  submitbutton: {
    width: {
      xs: '100%',
      sm: '60%',
    },
    height: 'calc(60px - 1vw)',
  },
}
