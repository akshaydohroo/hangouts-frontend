import { backend } from '../api'
import { User } from '../models/User'
import {
  UserFollowOptionsQuery,
  UsersOptionQuery,
} from '../models/UserFollower'

export async function followUsersOptions(
  page: number,
  searchString: string,
  isAuthenticated: boolean
): Promise<UserFollowOptionsQuery | UsersOptionQuery> {
  try {
    let res
    if (isAuthenticated) {
      res = await backend.get<UserFollowOptionsQuery>(`/follow/options`, {
        params: {
          searchString,
          page,
          limit: 5,
        },
        withCredentials: true,
      })
    } else {
      res = await backend.get<UsersOptionQuery>(`/guest/users`, {
        params: {
          searchString,
          page,
          limit: 5,
        },
      })
    }
    return res.data
  } catch (err) {
    throw err
  }
}
export async function followUser(userId: string): Promise<string> {
  try {
    if (!userId) {
      throw Error('connect to cannot be empty')
    }
    const res = await backend.get<{ id: string }>(`/follow/${userId}`, {
      withCredentials: true,
    })
    return res.data.id
  } catch (err) {
    throw err
  }
}
export async function acceptUserFollowRequest(senderId: string): Promise<void> {
  try {
    if (!senderId) {
      throw Error('senderId to cannot be empty')
    }
    console.log(senderId)
    await backend.get(`/follow/accept/${senderId}`, {
      withCredentials: true,
    })
    return
  } catch (err) {
    throw err
  }
}
export async function getFollowingUsers(page: number) {
  try {
    const res = await backend.get<{
      rows: Pick<User, 'id' | 'userName' | 'picture' | 'name'>[]
      count: number
      totalPages: number
    }>('/follow/follows', {
      params: {
        page,
        limit: 10,
      },
      withCredentials: true,
    })
    return res.data
  } catch (err) {
    throw err
  }
}
