import { InfiniteData, QueryClient } from '@tanstack/react-query'
import { backend } from '../api'
import { CountPostsWithUser, PostWithUser } from '../models/Post'
import { postsWithUserQueryKey } from '../queryKeyStore'
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

export async function getPosts(
  page: number,
  limit: number = 10
): Promise<CountPostsWithUser> {
  try {
    const res = await backend.get('/post/users', {
      params: {
        page,
        limit,
      },
      withCredentials: true,
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

export async function getIsLikedPost(postId: string) {
  try {
    const res = await backend.get('/post/like/user', {
      params: {
        postId,
      },
      withCredentials: true,
    })
    return res.data.isLiked as boolean
  } catch (error) {
    throw error
  }
}

export async function postToggleLikePost(postId: string, like: boolean) {
  try {
    const res = await backend.post(
      '/post/like/user',
      {
        like: like,
      },
      {
        params: {
          postId: postId,
        },
        withCredentials: true,
      }
    )
    return res.data as {}
  } catch (error) {
    throw error
  }
}

export function changeLikesInCache(
  queryClient: QueryClient,
  postId: string,
  amount: number
) {
  queryClient.setQueryData(
    postsWithUserQueryKey(true),
    (oldData?: InfiniteData<CountPostsWithUser>) => {
      console.log(oldData?.pages.length + ' old data')

      if (oldData) {
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: CountPostsWithUser) => {
            const updatedPosts = page.posts.map((post: PostWithUser) => {
              if (post.postId === postId) {
                return { ...post, likes: post.likes + amount }
              }
              return post
            })
            return {
              ...page,
              posts: updatedPosts,
            }
          }),
        }
        return newData
      }
      return oldData
    }
  )
}

export function changeCommentInCache(
  queryClient: QueryClient,
  postId: string,
  amount: number
) {
  queryClient.setQueryData(
    postsWithUserQueryKey(true),
    (oldData?: InfiniteData<CountPostsWithUser>) => {
      console.log(oldData?.pages.length + ' old data')

      if (oldData) {
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: CountPostsWithUser) => {
            const updatedPosts = page.posts.map((post: PostWithUser) => {
              if (post.postId === postId) {
                return { ...post, likes: post.commentsCount + amount }
              }
              return post
            })
            return {
              ...page,
              posts: updatedPosts,
            }
          }),
        }
        return newData
      }
      return oldData
    }
  )
}
