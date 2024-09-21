import Brightness4Icon from "@mui/icons-material/Brightness4";
import HomeIcon from "@mui/icons-material/Home";
import {
  AppBar,
  Avatar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { UserAttributes } from "../../models/User";
import { toggleThemeMode } from "../../redux/themeMode";
import NavbarButton from "./NavbarButton";
import UserButton from "./UserButton";
import UserSearch from "./UserSearch";
import { setError } from "../../redux/error";
import { ErrorDetails } from "../../utils/types";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../functions/user";
import {
  convertTime,
  extractErrorDetailFromErrorQuery,
} from "../../utils/functions";
import {
  removeAuthenticated,
  setAuthenticated,
} from "../../redux/authenticated";
import { setSnackbar } from "../../redux/snackbar";
export default function Navbar({}) {
  const mode = useAppSelector((state) => state.themeMode.value);
  const dispatch = useAppDispatch();
  const userQuery = useQuery(["user", "data"], {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, "min", "ms"),
  });

    if (userQuery.isError) {
      dispatch(
        setError(extractErrorDetailFromErrorQuery(userQuery.error as any))
      );
    }
    if (!userQuery.isLoading ) {
      if(userQuery.data == null){
        dispatch(
          setError(new ErrorDetails("User data not found", "User data not found"))
        );
        dispatch(removeAuthenticated());
      }else{
        console.log(userQuery.data);
        dispatch(setAuthenticated());
      }
    } else {
      dispatch(setSnackbar({autoHideDuration:1000 ,message: "Loading user data", severity: "info" }));
    }

  return (
    <AppBar sx={styles.appBar(mode)} enableColorOnDark position="static">
      <Toolbar>
        <Stack sx={styles.homeAndBrandName}>
          <IconButton sx={styles.homeButton}>
            <HomeIcon />
          </IconButton>
          <Typography sx={styles.brandName}>Hangouts</Typography>
        </Stack>
        <Stack sx={styles.rightNavbar}>
          <UserSearch />
          <NavbarButton type="notifications" />
          <NavbarButton type="chats" />
          <IconButton
            onClick={() => {
              dispatch(toggleThemeMode());
            }}
          >
            <Brightness4Icon sx={styles.homeButton} />
          </IconButton>
          <UserButton picture={userQuery.data?.picture as string | undefined} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
const styles = {
  appBar: (mode: boolean) => ({
    backgroundColor: mode ? "#000814" : "#003049",
    color: "white",
  }),
  homeAndBrandName: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 800,
  },
  homeButton: {
    color: "white",
    "& > svg": {
      fontSize: "30px",
    },
  },
  rightNavbar: {
    flexDirection: "row",
    alignItems: "center",
    "& > button": {
      mx: 2,
    },
  },
};
