import { backend } from '../api'
import { validateEmail } from '../utils/functions'
import { useQueryClient } from '@tanstack/react-query'

export type gender = 'Male' | 'Female' | 'Other' | ''

export type UserAttributes = {
  name: string
  id?: string
  email: string
  picture: File | string
  userName: string
  password?: string
  birthDate?: string
  gender?: gender
  createdAt?: string
}
export class User {
  public name: string = ''
  public id?: string
  public email: string = ''
  public picture: File | string = ''
  public userName: string = ''
  public password?: string
  public birthDate?: string
  public gender?: gender
  public createdAt?: string
  constructor(params: UserAttributes) {
    Object.assign(this, params)
  }

  async signin(): Promise<string> {
    const fieldsToIgnore = ['id', 'createdAt']
    try {
      for (let key in this) {
        console.log(key + ' ' + !fieldsToIgnore.includes(key))
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
      return res.data.accessToken as string
    } catch (error) {
      throw error
    }
  }
  static async logout(): Promise<void> {
    try {
      await backend.get('/auth/logout', {
        withCredentials: true,
      })
    } catch (err) {
      throw err
    }
  }
  static async login(userId: string, password: string): Promise<string> {
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
      return res.data.accessToken as string
    } catch (err) {
      throw err
    }
  }
}
