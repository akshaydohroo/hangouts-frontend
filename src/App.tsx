import {
  Container,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Outlet } from "react-router-dom";
import RootSnackBar from "./components/common/RootSnackbar";
import { googleOAuthClientId } from "./config";
import useAppSelector from "./hooks/useAppSelector";


const queryClient = new QueryClient();

function App() {
  const mode = useAppSelector((state) => state.themeMode.value);

  let theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: mode ? "dark" : "light",
            ...(mode ? {} : {}),
          },
        })
      ),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <GoogleOAuthProvider clientId={googleOAuthClientId}>
          <Container
            sx={{
              minHeight: "100vh",
              maxWidth: "100vw",
              overflowX: "hidden",
              height: "100vh",
            }}
            disableGutters
            maxWidth={false}
          >
            <RootSnackBar />
            <Outlet />
          </Container>
        </GoogleOAuthProvider>
      </ThemeProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  );
}

export default App;
