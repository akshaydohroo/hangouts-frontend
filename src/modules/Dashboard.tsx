import { Box, Stack } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Navigate } from "react-router";
import Loading from "../components/common/Loading";
import Navbar from "../components/navbar/Navbar";
import { getUserData } from "../functions/user";
import { convertTime, extractErrorDetailFromErrorQuery } from "../utils/functions";
import UserStories from "../components/dashboard/Story/UserStories";
import useAppDispatch from "../hooks/useAppDispatch";
import { setError } from "../redux/error";
import { ErrorDetails } from "../utils/types";

export default function Dashboard() {
  const dispatch = useAppDispatch();
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
    dispatch(setError(extractErrorDetailFromErrorQuery(userQuery.error as any)))
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
