import { Avatar, Box, ListItem, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getFollowingUsers } from "../../../functions/userFollower";
import { convertTime } from "../../../utils/functions";
import CarouselControl from "./CarouselControl";
import UserStory from "./UserStory";

export default function UserStories() {
  const [page, setPage] = React.useState<number>(1);
  const followingUserQuery = useQuery({
    queryKey: [
      "follows",
      "users",
      {
        page,
      },
    ],
    queryFn: ({ queryKey }) => {
      const { page } = queryKey[queryKey.length - 1] as {
        page: number;
      };
      return getFollowingUsers(page);
    },
    staleTime: convertTime(5, "min", "ms"),
    keepPreviousData: true,
  });
  const carouselRef = React.useRef<HTMLDivElement | null>(null);
  if (followingUserQuery.isError) {
    return <></>;
  }
  if (followingUserQuery.isLoading) {
    return <></>;
  }
  return (
    <Box sx={styles.wrapper}>
      <Stack direction="row" sx={styles.carousel} ref={carouselRef}>
        {followingUserQuery.data.rows.map((followingUser) => (
          <ListItem key={followingUser.id}>
            <UserStory followingUser={followingUser} />
          </ListItem>
        ))}
        {followingUserQuery.data.rows.length === 0 && (
          <>
            {Array.from({ length: 2 }).map((ele, idx) => (
              <Avatar sx={{ height: 60, width: 60, mx: 1 }} key={idx}></Avatar>
            ))}
            <Typography variant="subtitle2" color="MenuText" fontWeight="500">
              Stories of people you follow will appear here
            </Typography>
          </>
        )}
      </Stack>
      <CarouselControl carouselRef={carouselRef} />
    </Box>
  );
}
const styles = {
  wrapper: {
    ml: 1,
    p: 1,
    my: 1,
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  carousel: {
    width: "100%",
    overflowX: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "& > button:first-of-type": {
      ml: 0,
    },
    "& > button:last-of-type": {
      mr: 0,
    },
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    scrollBehavior: "smooth",
    alignItems: "center",
  },
};
