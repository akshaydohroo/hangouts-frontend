import { User } from './User'

// export type ReactionLabel =
//   | 'wow'
//   | 'inspiring'
//   | 'informative'
//   | 'support'
//   | 'dislike'
//   | 'sad'
// export type PostReactionType = ReactionLabel | 'none' | 'like'

// export const postReactions = new Map<ReactionLabel, string>([
//   ['wow', '😲'],
//   ['inspiring', '💡'],
//   ['informative', '📘'],
//   ['support', '🤝'],
//   ['dislike', '👎'],
//   ['sad', '😢'],
// ])

export interface PostWithUser extends Post {
  user: User
}

export type CountPostsWithUser = {
  count: number
  totalPages: number
  posts: PostWithUser[]
  page: number
  limit: number
}

export type PostAttributes = {
  storyId: string
  userId: string
  picture: string
  likes: number
  commentsCount: number
  seeCount: number
  createdAt: string
  updatedAt: string
}

export class Post {
  public postId: string = ''
  public picture: string = ''
  public caption: string = ''
  public likes: number = 0
  public commentsCount: number = 0
  public createdAt: string = ''
  public updatedAt: string = ''

  constructor(params: PostAttributes) {
    Object.assign(this, params)
  }
}
