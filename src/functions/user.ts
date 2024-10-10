import { backend } from '../api'
import { User, UserAttributes, UserAttributesChange } from '../models/User'

export async function getUserData(): Promise<Omit<UserAttributes, 'password'>> {
  try {
    const res = await backend.get(`/user/data`, {
      withCredentials: true,
    })
    return res.data
  } catch (err) {
    throw err
  }
}
export const getUsernameAvailable = async (
  username: string
): Promise<{ exists: boolean; status: number }> => {
  try {
    const res = await backend.get(`/user/exists`, {
      params: {
        username: username,
      },
    })
    return res.data
  } catch (err) {
    throw err
  }
}
export const getEmailAvailable = async (
  email: string
): Promise<{ exists: boolean; status: number }> => {
  try {
    const res = await backend.get(`/user/exists`, {
      params: {
        email: email,
      },
    })
    return res.data
  } catch (err) {
    throw err
  }
}
export const validateUserAttributesChange = (
  userAttributesChange: UserAttributesChange
): UserAttributesChange => {
  if (
    userAttributesChange.picture instanceof File &&
    userAttributesChange.picture.size > 5000000
  ) {
    throw Error('Avatar size is greater than 5mb')
  }
  return userAttributesChange
}

export const mutateUserData = async (user: UserAttributesChange) => {
  const userData = validateUserAttributesChange(user)
  const updatedUserData = await User.dataUpdate(userData)
  return updatedUserData
}
