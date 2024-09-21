import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Box, IconButton, ListItem, Popover } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import {
  bindFocus,
  bindPopover,
  usePopupState,
} from "material-ui-popup-state/hooks";
import React from "react";
import { getUserNotifications } from "../../functions/notification";
import { convertTime, pageControl } from "../../utils/functions";
import NotificationOption from "./NotificationOption";
import PaginationControl from "../common/PaginationControl";
import useAppSelector from "../../hooks/useAppSelector";

const iconTypeMap = {
  notifications: <NotificationsIcon />,
  chats: <ChatIcon />,
};
type NavbarButtonProps = {
  type: "chats" | "notifications";
};

export default function NavbarButton({ type }: NavbarButtonProps) {
  const [page, setPage] = React.useState<number>(1);
  const isAuthenticated  = useAppSelector((state) => state.authenticated.value);
  const useNavbarButtonQuery = useQuery({
    queryKey: [
      `${type}`,
      "user",
      {
        page,
      },
    ],
    queryFn: ({ queryKey }) => {
      const { page } = queryKey[queryKey.length - 1] as {
        page: number;
      };
      return getUserNotifications(page);
    },
    staleTime: convertTime(1, "min", "ms"),
    keepPreviousData: true,
    enabled: isAuthenticated, // Run the query only when the user is authenticated
  });
  if (useNavbarButtonQuery.isError) {
    console.error(useNavbarButtonQuery.error);
  }
  const { rows, totalPages = 0, count = 0 } = useNavbarButtonQuery.data || {};
  const pageController = React.useMemo(() => {
    return pageControl(setPage, totalPages);
  }, [totalPages, setPage]);
  const popupState = usePopupState({
    variant: "popover",
    popupId: `${type}-button-options`,
  });
  return (
    <>
      <IconButton
        id={`${type}-button`}
        // aria-controls={open ? `${type}-menu` : undefined}
        aria-haspopup="true"
        // aria-expanded={open ? "true" : undefined}
        sx={styles.navbarButton}
        disabled={
          useNavbarButtonQuery.isInitialLoading || useNavbarButtonQuery.isError
        }
        {...bindFocus(popupState)}
      >
        <Badge badgeContent={count} color="warning" invisible={Boolean(!count)}>
          {iconTypeMap[type]}
        </Badge>
      </IconButton>
      <Popover
        id={`${type}-menu`}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {type === "notifications" ? (
          rows?.map((notificationWithSender) => {
            return (
              <ListItem
                key={notificationWithSender.notificationId as UUID}
                sx={styles.navbarButtonListItem}
                disablePadding
                divider
              >
                <NotificationOption
                  page={page}
                  notificationWithSender={notificationWithSender}
                />
              </ListItem>
            );
          })
        ) : (
          <Box></Box>
        )}
        {rows && rows.length >= 1 && (
          <PaginationControl pageController={pageController} />
        )}
      </Popover>
    </>
  );
}
const styles = {
  navbarButton: {
    color: "white",
    "& > span > svg": {
      fontSize: 24,
    },
  },
  navbarButtonListItem: {
    width: {
      lg: "350px",
      sm: "300px",
    },
  },
};
