import {
  Avatar,
  Box,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useState } from 'react'
import {
  getFollowingUserWithStories,
  getPublicUserWithStories,
  getStories,
} from '../../../functions/story'
import { getUserData } from '../../../functions/user'
import useAppSelector from '../../../hooks/useAppSelector'
import { followingUserWithStories } from '../../../models/Story'
import {
  followingUsersWithStoriesQueryKey,
  userDataQueryKey,
  userStoriesQueryKey,
} from '../../../queryKeyStore'
import { convertTime, pageControl } from '../../../utils/functions'
import CarouselControl from './CarouselControl'
import FollowingUserStory from './FollowingUserStory'
import FollowingUserStoryDialog from './FollowingUserStoryDialog'
import UserStory from './UserStory'
import UserStoryDialog from './UserStoryDialog'

export default function UserStories() {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const followingUserWithStoriesQuery = useInfiniteQuery({
    queryKey: followingUsersWithStoriesQueryKey(isAuthenticated),
    queryFn: ({ queryKey, pageParam = 1 }) => {
      return isAuthenticated
        ? getFollowingUserWithStories(pageParam, 50)
        : getPublicUserWithStories(pageParam, 50)
    },
    staleTime: convertTime(5, 'min', 'ms'),
    keepPreviousData: false,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length < lastPage.totalPages) {
        return pages.length + 1
      }
      return undefined
    },
  })

  const userQuery = useQuery(userDataQueryKey, {
    queryFn: () => getUserData(),
    staleTime: convertTime(5, 'min', 'ms'),
    enabled: isAuthenticated,
  })

  const userStoriesQuery = useQuery({
    queryKey: userStoriesQueryKey(),
    queryFn: () => {
      return getStories()
    },
    staleTime: convertTime(5, 'min', 'ms'),
    enabled: isAuthenticated,
  })

  console.log(isAuthenticated + 'isAuthenticated')

  const userStories = userStoriesQuery.data

  const followingUsers =
    followingUserWithStoriesQuery.data?.pages.flatMap(page => page.rows) || []
  const page = followingUserWithStoriesQuery.data?.pages.length || 0

  const selfId = userQuery.data?.id

  const [followingUserStoryIndex, setFollowingUserStoryIndex] = useState<
    number | null
  >(null)

  const [selfStoryDialogOpen, setSelfStoryDialogOpen] = useState<boolean>(false)

  const followingUserStoryIndexController = useMemo(() => {
    return pageControl(setFollowingUserStoryIndex, followingUsers.length)
  }, [setFollowingUserStoryIndex, followingUsers.length])

  const carouselRef = useRef<HTMLDivElement | null>(null)

  if (followingUserWithStoriesQuery.isError && userQuery.isError) {
    return <></>
  }
  if (followingUserWithStoriesQuery.isLoading && userQuery.isLoading) {
    return (
      <Box sx={styles.wrapper}>
        <Stack direction="row" sx={styles.carousel} ref={carouselRef}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton
              variant="circular"
              width={65}
              height={65}
              sx={{ ml: 3.5, mr: 2.5 }}
              key={idx}
            />
          ))}
        </Stack>
      </Box>
    )
  }

  return (
    <>
      {selfStoryDialogOpen && (
        <UserStoryDialog
          open={true}
          handleClose={() => setSelfStoryDialogOpen(false)}
          userData={userQuery.data}
          stories={userStories}
        />
      )}

      {followingUserStoryIndex !== null &&
        followingUsers[followingUserStoryIndex || 0] !== undefined && (
          <FollowingUserStoryDialog
            open={true}
            handleClose={() => setFollowingUserStoryIndex(null)}
            followingUserWithStories={
              followingUsers[followingUserStoryIndex || 0]
            }
            followingUserStoryIndexController={
              followingUserStoryIndexController
            }
          />
        )}

      <Box sx={styles.wrapper}>
        <Stack direction="row" sx={styles.carousel} ref={carouselRef}>
          {userQuery.data ? (
            <ListItem key={userQuery.data.id as string}>
              <UserStory
                user={userQuery.data}
                storiesCount={userStories?.length}
                setSelfStoryDialogOpen={setSelfStoryDialogOpen}
              />
            </ListItem>
          ) : (
            <Avatar sx={{ height: 65, width: 65, ml: 3.5, mr: 2.5 }}></Avatar>
          )}
          {followingUserWithStoriesQuery.data && (
            <>
              {followingUsers.map(
                (
                  followingUser: followingUserWithStories,
                  followingUserIndex: number
                ) => (
                  <ListItem key={followingUser.id}>
                    <FollowingUserStory
                      followingUser={followingUser}
                      followingUserStoryIndexController={
                        followingUserStoryIndexController
                      }
                      followingUserIndex={followingUserIndex}
                      storiesCount={followingUser.stories.length}
                    />
                  </ListItem>
                )
              )}
              {followingUsers.length === 0 && (
                <>
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <Avatar
                      sx={{ height: 60, width: 60, mx: 1 }}
                      key={idx}
                    ></Avatar>
                  ))}
                  <Typography
                    variant="subtitle2"
                    color="MenuText"
                    fontWeight="500"
                  >
                    Stories of people you follow will appear here
                  </Typography>
                </>
              )}
            </>
          )}
        </Stack>
        <CarouselControl
          carouselRef={carouselRef}
          hasNextPage={followingUserWithStoriesQuery.hasNextPage}
          fetchNextPage={followingUserWithStoriesQuery.fetchNextPage}
          page={page}
        />
      </Box>
    </>
  )
}
const styles = {
  wrapper: {
    ml: 1,
    p: 1,
    my: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  carousel: {
    width: '100%',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& > button:first-of-type': {
      ml: 0,
    },
    '& > button:last-of-type': {
      mr: 0,
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    scrollBehavior: 'smooth',
    alignItems: 'center',
  },
}
