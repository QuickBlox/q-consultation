import {
  QBCreateUserWithLogin,
  QBCreateUserWithEmail,
  QBUser,
  ListUserResponse,
} from 'quickblox'
import { QBApi } from './api'

export const qbCreateUser = <T = QBCreateUserWithLogin | QBCreateUserWithEmail>(
  QB: QBApi,
  data: T,
) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.users.create(data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbGetUsersByTags = (
  QB: QBApi,
  tags: string | string[],
  config?: {
    page?: number
    per_page?: number
  },
) =>
  new Promise<ListUserResponse>((resolve, reject) => {
    QB.users.get(
      { tags: typeof tags === 'string' ? tags : tags.join(), ...config },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })

export const qbGetUsers = (QB: QBApi, filter: Dictionary<unknown>) =>
  new Promise<ListUserResponse>((resolve, reject) => {
    QB.users.listUsers({ filter }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const getUserById = async (
  QB: QBApi,
  userId: QBUser['id'],
): Promise<QBUser | null> => {
  const { data } = await QB.axios.get<{ user: QBUser }>(`/users/${userId}`)

  return data.user
}

export const qbUpdateUser = (
  QB: QBApi,
  userId: QBUser['id'],
  data: Partial<Omit<QBUser, 'id'>>,
) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.users.update(userId, data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbDeleteUser = (QB: QBApi, userId: QBUser['id']) =>
  new Promise<void>((resolve, reject) => {
    QB.users.delete(userId, (error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
