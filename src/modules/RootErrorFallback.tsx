import { Box, Button, SvgIcon, Typography } from "@mui/material";
import { FallbackProps } from "react-error-boundary";
import { ReactComponent as ErrorSvg } from "../assets/icons/error.svg";
import { ReactComponent as ServerErrorSvg } from "../assets/icons/server_error.svg";

import { ErrorDetails } from "../utils/types";
export default function RootErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: ErrorDetails;
  resetErrorBoundary: () => void;
}) {
  if (!error || !error.message) {
    error = new ErrorDetails(
      "Unexpected Error",
      "An unexpected error has occured",
      500
    );
  }

  return (
    <Box sx={styles.wrapper}>
      <SvgIcon
        component={
          error.errorCode && error.errorCode === 500 ? ServerErrorSvg : ErrorSvg
        }
        sx={styles.svg}
        inheritViewBox
      />
      <Typography variant="h5">{error.message}</Typography>
      <Typography>
        {error.errorCode &&
          error.errorCode === 500 &&
          "We are working tirelessly towards resolving this issue"}
      </Typography>
      <Button onClick={() => resetErrorBoundary()}>click to retry</Button>
    </Box>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100vw",
    minHeight: "100vh",
    maxWidth: "100vw",
    overflowX: "hidden",
    height: "100vh",
  },
  svg: {
    height: "50vh",
    width: "50vw",
  },
};
