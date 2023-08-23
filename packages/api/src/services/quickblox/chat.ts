import {
  QBSession,
  QBUser,
  QBChatDialog,
  QBChatMessage,
  QBChatNewMessage,
  QBSystemMessage,
} from 'quickblox'
import { QBApi } from './api'

export const qbChatConnect = (
  QB: QBApi,
  userId: QBUser['id'],
  token: QBSession['token'],
) =>
  new Promise((resolve, reject) => {
    QB.chat.connect({ userId, password: token }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbChatDisconnect = (QB: QBApi) => {
  QB.chat.disconnect()
}

export const qbChatCreate = (
  QB: QBApi,
  userIds: QBUser['id'] | Array<QBUser['id']>,
  data?: Dictionary<unknown>,
) =>
  new Promise<QBChatDialog>((resolve, reject) => {
    QB.chat.dialog.create(
      {
        name: '-',
        occupants_ids: Array.isArray(userIds) ? userIds : [userIds],
        type: 2,
        data,
      },
      (error, chat) => {
        if (error) {
          reject(error)
        } else {
          resolve(chat)
        }
      },
    )
  })

export const qbUpdateDialog = (
  QB: QBApi,
  dialogId: QBChatDialog['_id'],
  data: Dictionary<unknown>,
) => {
  return new Promise<QBChatDialog>((resolve, reject) => {
    QB.chat.dialog.update(dialogId, data, (error, chat) => {
      if (error) {
        reject(error)
      } else {
        resolve(chat)
      }
    })
  })
}

export const qbChatJoin = (QB: QBApi, dialogId: QBChatDialog['_id']) =>
  new Promise((resolve, reject) => {
    const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(dialogId)

    QB.chat.muc.join(dialogJid, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbChatSendMessage = (
  QB: QBApi,
  to: string,
  message: QBChatNewMessage,
) => {
  return new Promise<QBChatMessage['_id']>((resolve) => {
    resolve(QB.chat.send(to, message))
  })
}

export const qbChatSendSystemMessage = (
  QB: QBApi,
  to: QBUser['id'] | string,
  message: { extension: QBSystemMessage['extension'] },
) => {
  return new Promise<QBSystemMessage['id']>((resolve) => {
    resolve(QB.chat.sendSystemMessage(to, message))
  })
}

type GetMessagesResult = {
  items: QBChatMessage[]
  limit: number
  skip: number
}

export function qbChatGetMessages(
  QB: QBApi,
  dialogId: QBChatDialog['_id'],
  params: Partial<{
    skip: number
    limit: number
    sort_desc: 'date_sent' | 'created_at' | 'updated_at'
    sort_asc: 'date_sent' | 'created_at' | 'updated_at'
    _id: string
    date_sent: Partial<{
      lt: number
      lte: number
      gt: number
      gte: number
    }>
  }> = {},
) {
  return new Promise<GetMessagesResult>((resolve, reject) => {
    QB.chat.message.list(
      {
        chat_dialog_id: dialogId,
        sort_desc: 'date_sent',
        ...params,
      },
      (error, messages) => {
        if (error) {
          reject(error)
        } else {
          resolve(messages)
        }
      },
    )
  })
}
