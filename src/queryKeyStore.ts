const userDataQueryKey = ['user', 'data']
const followUsersQueryKey = (page: number) => [
  'user',
  'follows',
  {
    page,
  },
]
const userTypeDataQueryKey = (type: string, page: number) => [
  'user',
  `${type}`,
  {
    page,
  },
]
const followUserStoriesQueryKey = (userId: string) => [
  'story',
  'following',
  {
    userId,
  },
]
const userStoriesQueryKey = () => ['story', 'user']
const userfollowOptionsQueryKey = (searchString: string, page: number) => [
  'follow',
  'options',
  {
    searchString,
    page,
  },
]

const usernameAvailableQueryKey = (username: string) => [
  'username',
  'available',
  { username },
]
const emailAvailableQueryKey = (email: string) => [
  'email',
  'available',
  { email },
]

export {
  emailAvailableQueryKey,
  followUserStoriesQueryKey,
  followUsersQueryKey,
  userDataQueryKey,
  userStoriesQueryKey,
  userTypeDataQueryKey,
  userfollowOptionsQueryKey,
  usernameAvailableQueryKey,
}
