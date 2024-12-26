import {
  Container,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import RootSnackBar from './components/common/RootSnackbar'
import { googleOAuthClientId } from './config'
import useAppDispatch from './hooks/useAppDispatch'
import useAppSelector from './hooks/useAppSelector'
import { setSnackbar } from './redux/snackbar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retrying on query fetching
    },
    mutations: {
      // Add any default mutation options here if needed
    },
  },
})

function App() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector(state => state.themeMode.value)
  const error = useAppSelector(state => state.error.value)
  useEffect(() => {
    if (error != null) {
      dispatch(
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error',
        })
      )
    }
  }, [error, dispatch])
  let theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: mode ? 'dark' : 'light',
            ...(mode ? {} : {}),
          },
        })
      ),
    [mode]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <GoogleOAuthProvider clientId={googleOAuthClientId}>
          <Container
            sx={{
              height: '100vh',
              maxWidth: '100vw',
              overflowX: 'hidden',
            }}
            disableGutters
            maxWidth={false}
          >
            <RootSnackBar />
            <Outlet />
          </Container>
        </GoogleOAuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default App
