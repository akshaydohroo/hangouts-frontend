export const userDataQueryKey = ['user', 'data']
export const followUsersQueryKey = () => ['user', 'follows']
export const userfollowOptionsQueryKey = (
  searchString: string,
  page: number
) => [
  'follow',
  'options',
  {
    searchString,
    page,
  },
]
export const userTypeDataQueryKey = (type: string, page: number) => [
  'user',
  `${type}`,
  {
    page,
  },
]
export const followingUsersWithStoriesQueryKey = (isAuthenticated: boolean) => [
  'story',
  'following',
  'users',
  isAuthenticated,
]
export const followUserStoriesQueryKey = (followingId: string) => [
  'story',
  'following',
  {
    followingId,
  },
]

export const storyFollowingLikeQueryKey = (storyId: string) => [
  'story',
  'following',
  'like',
  {
    storyId,
  },
]

export const userStoriesQueryKey = () => ['story', 'user']

export const usernameAvailableQueryKey = (username: string) => [
  'username',
  'available',
  { username },
]
export const emailAvailableQueryKey = (email: string) => [
  'email',
  'available',
  { email },
]

export const postsWithUserQueryKey = (isAuthenticated: boolean) => [
  'posts',
  'following',
  'users',
  isAuthenticated,
]

export const commentPostQueryKey = (
  postId: string,
  parentCommentId: string | null,
  isAuthenticated: boolean
) => ['comment', 'post', { postId, parentCommentId, isAuthenticated }]

export const commentsPostCountQueryKey = (postId: string) => [
  'comment',
  'post',
  { postId },
]

export const postLikeQueryKey = (postId: string) => [
  'post',
  'user',
  'like',
  { postId },
]
