import { AccountCircle } from "@mui/icons-material";
import { Box, InputAdornment, TextField } from "@mui/material";
import React from "react";

export default function FileUpload({
  value,
  onChangeHandler,
}: {
  value: File | "";
  onChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <Box sx={styles.wrapper}>
      <TextField
        type="file"
        label="Upload Avatar"
        InputLabelProps={{ shrink: true }}
        sx={styles.fileInput}
        onChange={onChangeHandler}
        inputProps={{ accept: ".jpg,.jpeg,.png", }}
        name="picture"

      />
      <TextField
        type="text"
        label="Upload Avatar"
        InputLabelProps={{ shrink: true }}
        sx={styles.styledInput}
        value={!value ? "" : value.name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
  },
  fileInput: {
    position: "absolute",
    zIndex: 2,
    opacity: 0,
    width: "100%",
  },
  styledInput: {
    width: "100%",
  },
};
