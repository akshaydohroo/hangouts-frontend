import { Button, Stack, SvgIcon, TextField } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useNavigate } from 'react-router'
import { ReactComponent as SignupSvg } from '../assets/icons/signup.svg'
import FileUpload from '../components/common/FileUpload'
import GoogleLogin from '../components/common/GoogleLogin'
import EmailInput from '../components/Signup/EmailInput'
import GenderInput from '../components/Signup/GenderInput'
import UsernameInput from '../components/Signup/UsernameInput'
import useAppDispatch from '../hooks/useAppDispatch'
import { useIsMobile } from '../hooks/useIsMobile'
import { User, gender } from '../models/User'
import { setError } from '../redux/error'
import { ErrorDetails } from '../utils/types'

export default function Signup() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isMobile = useIsMobile()
  const [formData, setFormData] = React.useState<User>(
    new User({
      name: '',
      email: '',
      picture: '',
      userName: '',
      gender: '',
      password: '',
      birthDate: '',
    })
  )
  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData(
      (oldValue: User) =>
        new User({
          ...oldValue,
          [event.target.name]: !!event.target.files
            ? (event.target.files?.item(0) as File)
            : event.target.value,
        })
    )
  }
  return (
    <Stack sx={styles.signup}>
      <SvgIcon component={SignupSvg} sx={styles.svg} inheritViewBox />
      <Stack sx={styles.formWrapper}>
        <form
          onSubmit={event => {
            event.preventDefault()
            formData
              .signin(isMobile)
              .then(() => {
                return queryClient.resetQueries()
              })
              .then(accessToken => {
                navigate('/')
              })
              .catch((err: Error) => {
                dispatch(setError(new ErrorDetails(err.name, err.message)))
              })
          }}
        >
          <TextField
            type="text"
            label="Name"
            autoComplete="on"
            value={formData.name}
            name="name"
            onChange={onChangeHandler}
          />
          <UsernameInput
            value={formData.userName}
            onValueChangeHandler={onChangeHandler}
          />
          <EmailInput
            value={formData.email}
            onValueChangeHandler={onChangeHandler}
          />
          <TextField
            type="password"
            label="Password"
            autoComplete="on"
            value={formData.password}
            onChange={onChangeHandler}
            name="password"
          />
          <Stack direction="row" alignItems="center" sx={styles.dobAndGender}>
            <TextField
              type="date"
              label="Date Of Birth"
              InputLabelProps={{ shrink: true }}
              value={formData.birthDate}
              onChange={onChangeHandler}
              name="birthDate"
            />
            <GenderInput
              styles={styles.genderInputStyles}
              value={formData.gender as gender}
              onChangeHandler={onChangeHandler}
            />
          </Stack>
          <Stack direction="row" alignItems="center" sx={styles.fileAndSubmit}>
            <FileUpload
              enabled={true}
              name="picture"
              value={formData.picture as File | ''}
              onChangeHandler={onChangeHandler}
            />
            <Button
              variant="contained"
              size="large"
              sx={styles.submitbutton}
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </form>
        <Stack direction="row">
          <GoogleLogin text="signin" />
        </Stack>
      </Stack>
    </Stack>
  )
}
const styles = {
  signup: {
    minHeight: '100%',
    height: 'wrap-content',
    width: '100vw',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: {
      xs: 'column',
      md: 'row',
    },
    overflowY: {
      md: 'hidden', // Prevent overflow on larger screens
    },
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
        my: 1.8,
      },
    },
  },
  svg: {
    height: 'auto',
    width: {
      xs: '90vw',
      sm: '70vw',
      md: '50vw',
    },
    color: 'inherit',
  },
  genderInputStyles: {
    genderInputForm: {
      mx: 1,
      minWidth: 120,
    },
  },
  dobAndGender: {
    width: '100%',
    '& > *': {
      width: '100%',
      flex: 1,
    },
    '& > :first-of-type': {
      mb: {
        xs: 3.6,
        sm: 0,
      },
    },
    flexDirection: {
      xs: 'column',
      sm: 'row',
    },
  },
  fileAndSubmit: {
    width: '100%',
    '& > :first-of-type': {
      flex: 1,
      mb: {
        xs: 3,
        sm: 0,
      },
      mx: {
        sm: 1,
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
      sm: '40%',
    },
  },
}
