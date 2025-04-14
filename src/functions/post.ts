import { backend } from '../api'
import { CountPostsWithUser } from '../models/Post'
import { uploadFileInChunks } from '../utils/functions'

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

export async function createPost(picture: File, caption: string) {
  try {
    await uploadFileInChunks(picture, 2 * 1024 * 1024, '/post/user/create', {
      caption,
    })
  } catch (error) {
    throw error
  }
}
