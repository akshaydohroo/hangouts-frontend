import { backend } from '../api'
import { ChatOption } from '../models/Chat'
import { ChatMessagesPagination } from '../models/Message'

export async function getOrCreateUserChat(userId: string): Promise<string> {
  try {
    if (!userId || userId === '') {
      throw new Error('User ID is required')
    }
    const res = await backend.get(`/chat/user/start/${userId}`, {
      withCredentials: true,
    })
    return res.data?.chatId as string
  } catch (error) {
    throw error
  }
}

export async function getUserChats(searchTerm: string): Promise<ChatOption[]> {
  try {
    const res = await backend.get(`/chat/user`, {
      params: { searchTerm },
      withCredentials: true,
    })
    return res.data as ChatOption[]
  } catch (error) {
    throw error
  }
}

export async function getUserChatMessages(
  chatId: string,
  page: number,
  limit: number
): Promise<ChatMessagesPagination> {
  try {
    const res = await backend.get(`/chat/messages/${chatId}`, {
      params: { page, limit },
      withCredentials: true,
    })
    return res.data as ChatMessagesPagination
  } catch (error) {
    throw error
  }
}
