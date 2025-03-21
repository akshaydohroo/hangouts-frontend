import { UserAttributes } from './User'

export interface CommentWithAuthor extends Comment {
  author: Pick<UserAttributes, 'id' | 'name' | 'picture' | 'userName'>
}

export type CommentAttributes = {
  commentId: string
  parentCommentId: string | null
  userId: string
  postId: string
  text: string
  likes: number
  createdAt: string
  updatedAt: string
}

export class Comment {
  public commentId: string = ''
  public parentCommentId: string | null = null
  public userId: string = ''
  public postId: string = ''
  public text: string = ''
  public likes: number = 0
  public createdAt: string = ''
  public updatedAt: string = ''

  constructor(params: CommentAttributes) {
    Object.assign(this, params)
  }
}
