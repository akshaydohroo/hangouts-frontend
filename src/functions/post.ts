import { backend } from '../api'
import { CountPostsWithUser } from '../models/Post'

export async function getPublicPosts(
  page: number,
  limit: number = 10
): Promise<CountPostsWithUser> {
  try {
    const res = await backend.get('/guest/users/posts', {
      params: {
        page,
        limit,
      },
    })
    return res.data as CountPostsWithUser
  } catch (error) {
    throw error
  }
}
