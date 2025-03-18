import { User } from './User'

export interface PostWithUser extends Post {
  user: User
}

export type CountPostsWithUser = {
  count: number
  totalPages: number
  rows: PostWithUser[]
}

export type PostAttributes = {
  storyId: string
  userId: string
  picture: string
  likes: number
  seeCount: number
  createdAt: string
  updatedAt: string
}

export class Post {
  public postId: string = ''
  public picture: string = ''
  public caption: string = ''
  public likes: number = 0
  public createdAt: string = ''
  public updatedAt: string = ''

  constructor(params: PostAttributes) {
    Object.assign(this, params)
  }
}
