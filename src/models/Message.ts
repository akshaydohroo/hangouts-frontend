import { User } from './User'

export interface MessageWithSender extends Message {
  sender: Pick<User, 'id' | 'name' | 'picture' | 'userName'>
}
export interface ChatMessage extends MessageWithSender {
  replyToMessage?: Pick<Message, 'messageId' | 'text' | 'createdAt'> & {
    sender: Pick<User, 'id' | 'name' | 'picture' | 'userName'>
  }
  readBy?: Pick<User, 'id' | 'name' | 'picture' | 'userName'> &
    {
      createdAt: string
    }[]
}

export interface ChatMessagesPagination {
  count: number
  totalPages: number
  messages: ChatMessage[]
  page: number
  limit: number
}

export type MessageAttributes = {
  messageId: string
  text: string
  senderId: string
  chatId: string
  readCount?: number
  replyToMessageId: string | null
  isRead?: boolean
  createdAt: string
  updatedAt: string
}

export class Message {
  public messageId: string = ''
  public text: string = ''
  public senderId: string = ''
  public chatId: string = ''
  public readCount: number = 0
  public replyToMessageId: string | null = null
  public isRead: boolean = false
  public createdAt: string = ''
  public updatedAt: string = ''

  constructor(params: MessageAttributes) {
    Object.assign(this, params)
  }
}
