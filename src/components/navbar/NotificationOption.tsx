import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { NotificationBackendWithSender } from "../../models/Notification";
import { timeSince } from "../../utils/functions";
import { deleteNotification } from "../../functions/notification";
import { UUID } from "crypto";
import useAppDispatch from "../../hooks/useAppDispatch";
import { setSnackbar } from "../../redux/snackbar";
import { useQueryClient } from "@tanstack/react-query";
import { acceptUserFollowRequest } from "../../functions/userFollower";
import { invalidateNotificationsUserQuery } from "../../invalidateQueries";
export default function NotificationOption({
  page,
  notificationWithSender,
}: {
  page: number;
  notificationWithSender: NotificationBackendWithSender;
}) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  async function onClickNotificationHandler(type: "accept" | "clear") {
    try {
      let notificationStatus: string;
      if (type === "accept") {
        await acceptUserFollowRequest(notificationWithSender.senderId);
        notificationStatus = `Follow request from ${notificationWithSender.sender.name} accepted`;
      } else {
        notificationStatus = "Notification cleared";
      }
      await deleteNotification(notificationWithSender.notificationId as UUID);
      queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          invalidateNotificationsUserQuery(queryKey, page),
      });
      dispatch(
        setSnackbar({
          message: `${notificationStatus}`,
          severity: type === "accept" ? "success" : "info",
          alertVarient: type === "accept" ? "filled" : "standard",
        })
      );
    } catch (err) {
      console.error(err);
      dispatch(
        setSnackbar({
          message: "Notification error, user action couldnt be performed",
          severity: "error",
          alertVarient: "filled",
        })
      );
    }
  }

  return (
    <Stack direction="row" sx={styles.wrapper}>
      <Stack my={1} ml={1} sx={styles.notificationWrapper}>
        <Stack direction="row" sx={styles.senderPictureAndUsernameWrapper}>
          <Avatar
            src={notificationWithSender.sender.picture as string}
            sx={styles.avatar}
          />
          <Typography sx={styles.timeSince} component="div">
            @{notificationWithSender.sender.userName}
          </Typography>
          <Typography component="div" variant="caption">
            {timeSince(new Date(notificationWithSender.createdAt as string))}{" "}
            ago
          </Typography>
        </Stack>
        <Typography sx={styles.notificationMessage}>
          {notificationWithSender.notificationMessage}
        </Typography>
      </Stack>
      <Stack sx={styles.notificationControl}>
        <Box>
          <Tooltip title="Clear Notification" arrow placement="right">
            <IconButton
              sx={styles.rejectButton}
              onClick={() => onClickNotificationHandler("clear")}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title="Accept Request" arrow placement="right">
            <IconButton
              sx={styles.acceptButton}
              onClick={() => onClickNotificationHandler("accept")}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </Stack>
  );
}

const styles = {
  wrapper: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  notificationWrapper: {
    flex: 1,
  },
  senderPictureAndUsernameWrapper: {
    alignItems: "center",
    mb: 0.5,
    "& > div": {
      mr: 2,
    },
  },
  notificationControl: {
    width: 44,
    "& > *:first-of-type": {
      position: "absolute",
      top: 0,
    },
    "& > *:last-of-type": {
      position: "absolute",
      bottom: 0,
    },
  },
  avatar: {
    height: 36,
    width: 36,
  },
  acceptButton: {
    "&:hover, &:focus": {
      color: "success.main",
    },
  },
  rejectButton: {
    "&:hover, &:focus": {
      color: "error.main",
    },
  },
  timeSince: {
    fontSize: 14,
    color: "text.secondary",
  },
  notificationMessage: {
    fontSize: 15,
  },
};
