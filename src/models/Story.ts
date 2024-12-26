import { backend } from '../api'
import { User } from './User'

export type StoryAttributes = {
  storyId: string
  userId: string
  picture: string
  likes: number
  seeCount: number
  createdAt: string
  updatedAt: string
}
export interface followingUserWithStories
  extends Pick<User, 'id' | 'userName' | 'picture' | 'name'> {
  stories: Pick<Story, 'storyId' | 'picture' | 'createdAt'>[]
}

export type followingUserWithStoriesQuery = {
  count: number
  totalPages: number
  rows: followingUserWithStories[]
}
export class Story {
  public storyId: string = ''
  public userId: string = ''
  public picture: string = ''
  public likes: number = 0
  public seenCount: number = 0
  public createdAt: string = ''
  public updatedAt: string = ''
  constructor(params: StoryAttributes) {
    Object.assign(this, params)
  }

  static async addViewer(storyId: String): Promise<void> {
    try {
      await backend.post(
        `/story/following/view/${storyId}`,
        {},
        {
          withCredentials: true,
        }
      )
    } catch (error) {
      throw error
    }
  }

  async likeStory(isLike: Boolean): Promise<void> {
    try {
      await backend.put(`/story/like/${this.storyId}`, isLike, {
        withCredentials: true,
      })
    } catch (error) {
      throw error
    }
  }
}
export const StoryReactions = {
  like: '👍',
  love: '❤️',
  laugh: '😂',
  surprise: '😮',
  sad: '😢',
  angry: '😡',
}
