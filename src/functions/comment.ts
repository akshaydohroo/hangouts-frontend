import { backend } from '../api'
import { CommentWithAuthor } from '../models/Comment'

export async function getPublicPostComments(
  postId: string,
  parentCommentId: string | null
): Promise<CommentWithAuthor[]> {
  try {
    const params = parentCommentId ? { parentCommentId } : {}
    const res = await backend.get(`/guest/users/comments/${postId}`, {
      params,
      withCredentials: true,
    })
    return res.data as CommentWithAuthor[]
  } catch (error) {
    throw error
  }
}
export async function getPublicPostCommentsCount(
  postId: string
): Promise<{ count: number }> {
  try {
    const res = await backend.get(`/guest/users/comments/count/${postId}`, {
      withCredentials: true,
    })
    return res.data as { count: number }
  } catch (error) {
    throw error
  }
}
