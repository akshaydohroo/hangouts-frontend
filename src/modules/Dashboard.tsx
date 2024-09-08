import { Box, Stack } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate } from "react-router";
import Loading from "../components/common/Loading";
import Navbar from "../components/navbar/Navbar";
import { getUserData } from "../functions/user";
import { convertTime } from "../utils/functions";
import UserStories from "../components/dashboard/Story/UserStories";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const userQuery = useQuery(["user", "data"], {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, "min", "ms"),
  });
  React.useEffect(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);
  if (userQuery.isLoading) {
    return <Loading />;
  }
  if (userQuery.isError) {
    return <Navigate to="/login" />;
  }
  return (
    <Box>
      <Navbar />
      <Stack direction="row">
        <Stack width="70%">
          <UserStories />
          <Stack>Posts</Stack>
        </Stack>
        <Box width="30%">Chats</Box>
      </Stack>
    </Box>
  );
}
