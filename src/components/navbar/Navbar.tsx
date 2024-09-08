import Brightness4Icon from "@mui/icons-material/Brightness4";
import HomeIcon from "@mui/icons-material/Home";
import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../functions/user";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { UserAttributes } from "../../models/User";
import { toggleThemeMode } from "../../redux/themeMode";
import { convertTime } from "../../utils/functions";
import NavbarButton from "./NavbarButton";
import UserButton from "./UserButton";
import UserSearch from "./UserSearch";
export default function Navbar() {
  const mode = useAppSelector((state) => state.themeMode.value);
  const dispatch = useAppDispatch();

  const userQuery = useQuery<Omit<UserAttributes, "password">, Error>(
    ["user", "data"],
    {
      queryFn: () => getUserData(),
      staleTime: convertTime(5, "min", "ms"),
    }
  );
  if (userQuery.isError) {
    throw userQuery.error;
  }
  if (!userQuery.data) {
    throw Error("NO data");
  }

  const user = userQuery.data;
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
          <UserButton picture={user.picture as string} />
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
