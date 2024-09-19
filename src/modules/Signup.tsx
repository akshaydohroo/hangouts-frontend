import { Button, Stack, SvgIcon, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import { ReactComponent as SignupSvg } from "../assets/icons/signup.svg";
import FileUpload from "../components/Signup/FileUpload";
import GenderInput from "../components/Signup/GenderInput";
import GoogleLogin from "../components/common/GoogleLogin";
import { User, gender } from "../models/User";
import { setError } from "../redux/error";
import useAppDispatch from "../hooks/useAppDispatch";
import { ErrorDetails } from "../utils/types";

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<User>(
    new User({
      name: "",
      email: "",
      picture: "",
      userName: "",
      gender: "",
      password: "",
      birthDate: "",
    })
  );
  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData(
      (oldValue: User) =>
        new User({
          ...oldValue,
          [event.target.name]: !!event.target.files
            ? (event.target.files?.item(0) as File)
            : event.target.value,
        })
    );
  }
  return (
    <Stack sx={styles.signup}>
      <SvgIcon component={SignupSvg} sx={styles.svg} inheritViewBox />
      <Stack sx={styles.formWrapper}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            formData
              .signin()
              .then((accessToken) => {
                navigate("/");
              })
              .catch((err: Error) => {
                dispatch(setError(new ErrorDetails(err.name, err.message)));
              });
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
          <TextField
            type="username"
            label="Username"
            autoComplete="on"
            value={formData.userName}
            onChange={onChangeHandler}
            name="userName"
          />
          <TextField
            type="email"
            label="Email"
            autoComplete="on"
            value={formData.email}
            onChange={onChangeHandler}
            name="email"
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
              value={formData.gender as gender}
              onChangeHandler={onChangeHandler}
            />
          </Stack>
          <Stack direction="row" alignItems="center" sx={styles.fileAndSubmit}>
            <FileUpload
              value={formData.picture as File | ""}
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
  );
}
const styles = {
  signup: {
    minHeight: "100vh",
    width: "100vw",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: {
      xs: "column",
      md: "row",
    },overflowY: {
      md: "hidden", // Prevent overflow on larger screens
    },
  },
  formWrapper: {
    "& > form": {
      display: "flex",
      flexDirection: "column",
      width: {
        xs: "80vw",
        sm: "60vw",
        md: "30vw",
      },
      "& > *": {
        my: 1.5,
      },
    },
  },
  svg: {
    height: "auto",
    width: {
      xs: "90vw",
      sm: "70vw",
      md: "53vw",
    },
    color: "inherit",
  },
  dobAndGender: {
    width: "100%",
    "& > *": {
      flex: 1,
      width: "100%",
    },
    "& > :first-of-type": {
      mb: {
        xs: 1.5,
        sm: 0,
      },
    },
    flexDirection: {
      xs: "column",
      sm: "row",
    },
  },
  fileAndSubmit: {
    width: "100%",
    "& > :first-of-type": {
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
      xs: "column",
      sm: "row",
    },
  },
  submitbutton: {
    width: {
      xs: "100%",
      sm: "40%",
    },
  },
};
