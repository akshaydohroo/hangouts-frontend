import { io, Socket } from 'socket.io-client'
import { backendBaseUrl } from '../config'

const URL = backendBaseUrl

export const socket: Socket = io(URL, {
  withCredentials: true,
  autoConnect: false, // manually connect when needed
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
})
