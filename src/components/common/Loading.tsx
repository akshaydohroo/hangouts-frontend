import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Stack } from "@mui/system";

export default function Loading() {
  return (
    <Stack
      width="100%"
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Stack>
  );
}
