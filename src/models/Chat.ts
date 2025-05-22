import { Message } from './Message'
import { User } from './User'

export interface ChatOption extends Chat {
  lastMessage?: Pick<Message, 'messageId' | 'text' | 'createdAt'> & {
    sender: Pick<User, 'id' | 'name' | 'picture' | 'userName'>
  }
  participants: Pick<User, 'id' | 'name' | 'picture' | 'userName'>[]
}

export type ChatAttributes = {
  chatId: string
  chatName: string
  participantsCount: number
  lastMessageId: string | null
  createdAt: string
  updatedAt: string
}

export class Chat {
  public chatId: string = ''
  public chatName: string = ''
  public participantsCount: number = 0
  public messageCount: number = 0
  public lastMessageId: string | null = null
  public createdAt: string = ''
  public updatedAt: string = ''

  constructor(params: ChatAttributes) {
    Object.assign(this, params)
  }
}
