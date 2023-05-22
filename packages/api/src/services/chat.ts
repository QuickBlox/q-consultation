import QB, {
  QBSession,
  QBUser,
  QBChatDialog,
  QBChatMessage,
  QBChatNewMessage,
} from 'quickblox'

export const qbChatConnect = (
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

export const qbChatDisconnect = () => {
  QB.chat.disconnect()
}

export const qbChatCreate = (
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

export const qbChatJoin = (dialogId: QBChatDialog['_id']) =>
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

export const qbChatSendMessage = (to: string, message: QBChatNewMessage) => {
  return new Promise<QBChatMessage['_id']>((resolve) => {
    resolve(QB.chat.send(to, message))
  })
}
