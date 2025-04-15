import { QueryKey } from '@tanstack/query-core/src/types'
export const invalidateUserFollowOptions = (
  queryKey: QueryKey,
  searchString: string,
  page: number
) => {
  if (queryKey.length < 3) return false
  if (
    JSON.stringify(queryKey.slice(0, 2)) !==
    JSON.stringify(['follow', 'options'])
  )
    return false
  if (
    (queryKey[2] as { searchString: string }).searchString !== searchString ||
    (queryKey[2] as { page: number }).page === page
  ) {
    return true
  }
  return false
}
export const invalidateNotificationsUserQuery = (
  queryKey: QueryKey,
  page: number
) => {
  if (queryKey.length < 3) return false
  if (
    JSON.stringify(queryKey.slice(0, 2)) !==
    JSON.stringify(['notifications', 'user'])
  )
    return false
  if ((queryKey[2] as { page: number }).page >= page) {
    return true
  }
  return false
}

export const invalidateFollowingStoryLike = (
  queryKey: QueryKey,
  storyId: string
): boolean => {
  if (queryKey.length < 4) return false
  if (
    JSON.stringify(queryKey.slice(0, 3)) !==
    JSON.stringify(['story', 'following', 'like'])
  )
    return false
  if ((queryKey[3] as { storyId: string }).storyId === storyId) return true

  return false
}

export const invalidateUserStories = (queryKey: QueryKey): boolean => {
  if (queryKey.length < 2) return false
  if (
    JSON.stringify(queryKey.slice(0, 2)) !== JSON.stringify(['story', 'user'])
  )
    return false

  return true
}

export const invalidateUserPosts = (queryKey: QueryKey): boolean => {
  if (queryKey.length < 4) return false
  if (
    JSON.stringify(queryKey.slice(0, 4)) !==
    JSON.stringify(['posts', 'following', 'users', true])
  )
    return false

  return true
}
