import { backend } from '../api' // Ensure this import is correct
import { followingUserWithStoriesQuery, Story } from '../models/Story' // Ensure this import is correct
import { uploadFileInChunks } from '../utils/functions'

export async function createStory(picture: File) {
  try {
    await uploadFileInChunks(picture, 2 * 1024 * 1024, '/story/user/create')
  } catch (error) {
    throw error
  }
}

export async function getFollowingUserWithStories(
  page: number,
  limit: number = 10
): Promise<followingUserWithStoriesQuery> {
  try {
    const res = await backend.get('/story/following/users/', {
      params: {
        page,
        limit,
      },
      withCredentials: true,
    })
    return res.data as followingUserWithStoriesQuery
  } catch (error) {
    throw error
  }
}
export async function getStories(): Promise<Story[]> {
  try {
    const res = await backend.get('/story/user', {
      withCredentials: true,
    })
    return res.data.map((story: any) => new Story(story))
  } catch (error) {
    throw error
  }
}

export async function getStoryFollowingLike(storyId: string): Promise<Boolean> {
  try {
    const res = await backend.get('/story/following/like', {
      params: {
        storyId,
      },
      withCredentials: true,
    })
    return res.data as Boolean
  } catch (error) {
    throw error
  }
}

export async function likeFollowingStory(
  storyId: string,
  isLike: Boolean
): Promise<void> {
  try {
    const res = await backend.put(
      '/story/following/like',
      {
        storyId,
        isLike,
      },
      {
        withCredentials: true,
      }
    )
    return
  } catch (error) {
    throw error
  }
}

export async function sendFollowingStoryReaction(
  storyId: string,
  reaction: string
): Promise<boolean> {
  try {
    const res = await backend.put(
      '/story/following/react',
      {
        storyId,
        reaction,
      },
      {
        withCredentials: true,
      }
    )
    return res.data.status === 'success'
  } catch (error) {
    throw error
  }
}
