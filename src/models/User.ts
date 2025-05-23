import { backend } from '../api'
import { validateEmail } from '../utils/functions'

export type gender = 'Male' | 'Female' | 'Other' | ''

export type UserAttributesChange = Omit<UserAttributes, 'id' | 'createdAt'>

export type UserAttributes = {
  name: string
  id?: string
  email: string
  picture: File | ''
  userName: string
  password?: string
  birthDate?: string
  gender?: gender
  visibility?: string
  createdAt?: string
}
export class User {
  public name: string = ''
  public id?: string
  public email: string = ''
  public picture: File | '' = ''
  public userName: string = ''
  public password?: string
  public birthDate?: string
  public gender?: gender
  public createdAt?: string
  constructor(params: UserAttributes) {
    Object.assign(this, params)
  }

  async signin(isMobile: boolean): Promise<string> {
    const fieldsToIgnore = ['id', 'createdAt']
    try {
      for (let key in this) {
        if (!fieldsToIgnore.includes(key) && !this[key])
          throw Error(`${key} is empty, ${key} should have a valid value`)
      }
      if (this.picture instanceof File && this.picture.size > 5000000) {
        throw Error('Avatar size is greater than 5mb')
      }
      // const password = encryptPassword(this.password as string);
      const res = await backend.postForm(
        '/auth/signin',
        { ...this, password: this.password },
        {
          withCredentials: true,
        }
      )
      const accessToken = res.data.accessToken as string
      const refreshToken = res.data.refreshToken as string
      if (accessToken && isMobile) {
        localStorage.setItem('accessToken', accessToken)
      }
      if (refreshToken && isMobile) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      return res.data.accessToken as string
    } catch (error) {
      throw error
    }
  }
  static async logout(): Promise<void> {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      await backend.get('/auth/logout', {
        withCredentials: true,
      })
    } catch (err) {
      throw err
    }
  }
  static async login(
    userId: string,
    password: string,
    isMobile: boolean
  ): Promise<string> {
    try {
      if (!userId) throw Error('Username or Email expected')
      if (!password) throw Error('Password Expected')
      const res = await backend.post(
        '/auth/login',
        {
          [validateEmail(userId) ? 'email' : 'userName']: userId,
          password,
        },
        {
          withCredentials: true,
        }
      )
      const accessToken = res.data.accessToken as string
      const refreshToken = res.data.refreshToken as string
      if (accessToken && isMobile) {
        localStorage.setItem('accessToken', accessToken)
      }
      if (refreshToken && isMobile) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      return res.data.accessToken as string
    } catch (err) {
      throw err
    }
  }
  static async dataUpdate(
    userAttributesChange: UserAttributesChange
  ): Promise<User> {
    try {
      const res = await backend.put('/user/data', userAttributesChange, {
        withCredentials: true,
      })
      return res.data as User
    } catch (err) {
      throw err
    }
  }
}
