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

export async function getPostComments(
  postId: string,
  parentCommentId: string | null
): Promise<CommentWithAuthor[]> {
  try {
    const params = parentCommentId ? { parentCommentId } : {}
    const res = await backend.get(`/post/comments/${postId}`, {
      params,
      withCredentials: true,
    })
    return res.data as CommentWithAuthor[]
  } catch (error) {
    throw error
  }
}

export async function createComment(
  postId: string,
  parentCommentId: string | null,
  content: string
) {
  try {
    const res = await backend.post(
      `/post/comments/${postId}`,
      {
        content,
        parentCommentId,
      },
      {
        withCredentials: true,
      }
    )
    return res.data as CommentWithAuthor
  } catch (error) {
    throw error
  }
}
