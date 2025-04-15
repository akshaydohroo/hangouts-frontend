import { Box, Skeleton, Stack } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { getPosts, getPublicPosts } from '../../../functions/post'
import useAppSelector from '../../../hooks/useAppSelector'
import { postsWithUserQueryKey } from '../../../queryKeyStore'
import { convertTime } from '../../../utils/functions'
import CreatePost from './CreatePost'
import UserPost from './UserPost'

export default function UserPosts() {
  const isAuthenticated = useAppSelector(state => state.authenticated.value)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
  } = useInfiniteQuery({
    queryKey: postsWithUserQueryKey(isAuthenticated),
    queryFn: ({ pageParam = 1 }) => {
      return isAuthenticated
        ? getPosts(pageParam, 10)
        : getPublicPosts(pageParam, 10)
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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  if (isError) {
    return <></>
  }
  if (isLoading) {
    return (
      <Stack>
        <Skeleton variant="rectangular" height="33vh" />
        <Skeleton variant="rectangular" height="33vh" />
        <Skeleton variant="rectangular" height="33vh" />
      </Stack>
    )
  }

  const userPosts = data?.pages.flatMap(page => page.rows) || []

  return (
    <Stack>
      <CreatePost />
      <Stack>
        {userPosts.map((userPost, index) => {
          if (index === userPosts.length - 1) {
            return (
              <Box ref={lastPostRef} key={userPost.postId}>
                <UserPost key={userPost.postId} post={userPost} />
              </Box>
            )
          } else {
            return <UserPost key={userPost.postId} post={userPost} />
          }
        })}
      </Stack>
    </Stack>
  )
}

const styles = {
  userPostsWrapper: {},
}
