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
  followUsersQueryKey,
  userDataQueryKey,
  userTypeDataQueryKey,
  userfollowOptionsQueryKey,
  usernameAvailableQueryKey,
}
