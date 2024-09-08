import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import useAppDispatch from "../../hooks/useAppDispatch";
import { setSnackbar } from "../../redux/snackbar";

export default function UserButton({ picture }: { picture: string }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useAppDispatch();
  async function onClickLogout() {
    try {
      await User.logout();
      dispatch(
        setSnackbar({
          message: "You have logged out successfully",
          severity: "info",
          alertVarient: "standard",
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        setSnackbar({
          message:
            "There was error during logout, You are redirected to login page",
          severity: "warning",
          alertVarient: "standard",
        })
      );
    } finally {
      navigate("/login");
    }
  }
  return (
    <>
      <IconButton
        id={`user-button`}
        aria-controls={open ? `user-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={styles.userButton}
      >
        <Avatar sx={{ width: 28, height: 28 }} src={picture} />
      </IconButton>
      <Menu
        id={`user-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": `user-button`,
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={onClickLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
const styles = {
  userButton: {
    color: "white",
    "& > *": {
      fontSize: 24,
    },
  },
};
