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
