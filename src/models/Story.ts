import { backend } from '../api'

export type StoryAttributes = {
  storyId: string
  userId: string
  picture: string
  likes: number
  seeCount: number
  createdAt: string
  updatedAt: string
}

export class Story {
  public storyId: string = ''
  public userId: string = ''
  public picture: string = ''
  public likes: number = 0
  public seeCount: number = 0
  public createdAt: string = ''
  public updatedAt: string = ''
  constructor(params: StoryAttributes) {
    Object.assign(this, params)
  }

  static async getStories(): Promise<Story[]> {
    try {
      const res = await backend.get('/story/user', {
        withCredentials: true,
      })
      if (!res.data) return new Array<Story>()
      return res.data as Story[]
    } catch (error) {
      throw error
    }
  }
}
