type QBInitParams = {
  appIdOrToken: string | number
  authKeyOrAppId: string | number
  authSecret?: string
  accountKey: string
  config?: QBConfig
}

export function QBInit(params: QBInitParams) {
  QB.init(
    params.appIdOrToken,
    params.authKeyOrAppId,
    params.authSecret,
    params.accountKey,
    params.config,
  )
}

export function QBCreateSession() {
  return new Promise<QBSession>((resolve, reject) => {
    QB.createSession((sessionError, session) => {
      if (sessionError) {
        reject(sessionError)
      } else {
        resolve(session)
      }
    })
  })
}

export function QBGetSession() {
  return new Promise<QBSession>((resolve, reject) => {
    QB.getSession((getSessionError, response) => {
      if (getSessionError || !response?.session) {
        reject(getSessionError || Error('No session'))
      } else {
        resolve(response.session)
      }
    })
  })
}

export function loginToQuickBlox(params: QBLoginParams) {
  return new Promise<QBUser>((resolve, reject) => {
    QB.login(params, (loginError, user) => {
      if (loginError) {
        reject(loginError)
      } else {
        resolve(user)
      }
    })
  })
}

export function QBLogin(params: QBLoginParams) {
  let session: QBSession

  return QBCreateSession()
    .then((_session) => {
      session = _session

      return loginToQuickBlox(params)
    })
    .then((user) => ({ user, session }))
}

export function QBLogout() {
  return new Promise((resolve) => {
    QB.destroySession(resolve)
  })
}

export function QBChatConnect(params: ChatConnectParams) {
  return new Promise((resolve, reject) => {
    QB.chat.connect(params, (error, success) => {
      if (error) {
        reject(error)
      } else {
        resolve(success)
      }
    })
  })
}

export function QBChatDisconnect() {
  QB.chat.disconnect()
}

export function QBUserUpdate(userId: QBUser['id'], user: Partial<QBUser>) {
  return new Promise<QBUser>((resolve, reject) => {
    QB.users.update(userId, user, (error, updatedUser) => {
      if (error) {
        reject(error)
      } else {
        resolve(updatedUser)
      }
    })
  })
}

export function QBUserGet(params: GetUserParams | number) {
  if (typeof params === 'number') {
    return new Promise<QBUser | undefined>((resolve, reject) => {
      QB.users.get(params, (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      })
    })
  }

  return new Promise<ListUserResponse>((resolve, reject) => {
    QB.users.get(params, (error, result: ListUserResponse) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export function QBUserList(params: ListUserParams) {
  return new Promise<ListUserResponse | undefined>((resolve, reject) => {
    QB.users.listUsers(params, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

export function QBDataGet<T extends QBCustomObject>(
  className: string,
  filters: Dictionary<unknown>,
) {
  return new Promise<{
    class_name: string
    items: T[]
    limit: number
    skip: number
  }>((resolve, reject) => {
    QB.data.list<T>(className, filters, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export function QBDataCreate<T extends QBCustomObject>(
  className: string,
  data: Dictionary<unknown>,
) {
  return new Promise<T>((resolve, reject) => {
    QB.data.create<T>(className, data, (error, customObject) => {
      if (error) {
        reject(error)
      } else {
        resolve(customObject)
      }
    })
  })
}

export function QBDataDelete<
  T extends QBCustomObject['_id'] | Array<QBCustomObject['_id']>,
>(className: string, ids: T) {
  return new Promise<QBDataDeletedResponse>((resolve, reject) => {
    QB.data.delete<T>(className, ids, (error, customObject) => {
      if (error) {
        reject(error)
      } else {
        resolve(customObject)
      }
    })
  })
}

export function QBDataUpdate<T extends QBCustomObject>(
  className: string,
  _id: T['_id'],
  data: Dictionary<unknown>,
) {
  return new Promise<T>((resolve, reject) => {
    QB.data.update<{ _id: string } & Dictionary<unknown>, T>(
      className,
      { _id, ...data },
      (error, item) => {
        if (error) {
          reject(error)
        } else {
          resolve(item)
        }
      },
    )
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function QBGetDialog(filters: Dictionary<any>) {
  return new Promise<QBGetDialogResult | undefined>((resolve, reject) => {
    QB.chat.dialog.list(filters, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

export function QBCreateDialog(
  userIds: QBUser['id'] | Array<QBUser['id']>,
  data?: Dictionary<unknown>,
) {
  return new Promise<QBChatDialog>((resolve, reject) => {
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
}

export function QBUpdateDialog(
  dialogId: QBChatDialog['_id'],
  data: Dictionary<unknown>,
) {
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

export function QBJoinDialog(dialogId: QBChatDialog['_id']) {
  return new Promise((resolve, reject) => {
    const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(dialogId)

    QB.chat.muc.join(dialogJid, (error, res) => {
      if (error) {
        reject(error)
      } else {
        resolve(res)
      }
    })
  })
}

export function QBLeaveDialog(dialogId: QBChatDialog['_id']) {
  return new Promise((resolve, reject) => {
    const dialogJid = QB.chat.helpers.getRoomJidFromDialogId(dialogId)

    QB.chat.muc.leave(dialogJid, (error, res) => {
      if (error) {
        reject(error)
      } else {
        resolve(res)
      }
    })
  })
}

export function QBGetInfoFile(fileId: QBContentObject['id']) {
  return new Promise((resolve, reject) => {
    QB.content.getInfo(fileId, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

export function QBDeleteContent(contentId: QBContentObject['id']) {
  return new Promise((resolve, reject) => {
    QB.content.delete(contentId, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}

export function QBChatGetMessages(
  dialogId: QBChatDialog['_id'],
  skip = 0,
  limit = 100,
) {
  return new Promise<GetMessagesResult & { dialogId: QBChatDialog['_id'] }>(
    (resolve, reject) => {
      QB.chat.message.list(
        {
          chat_dialog_id: dialogId,
          sort_desc: 'date_sent',
          limit,
          skip,
          mark_as_read: 0,
        },
        (error, messages) => {
          if (error) {
            reject(error)
          } else {
            resolve({ ...messages, dialogId })
          }
        },
      )
    },
  )
}

export function QBChatSendMessage(to: string, message: QBChatNewMessage) {
  return new Promise<QBChatMessage['_id']>((resolve) => {
    resolve(QB.chat.send(to, message))
  })
}

export function QBChatSendSystemMessage(
  to: QBUser['id'] | string,
  message: { extension: QBSystemMessage['extension'] },
) {
  return new Promise<QBSystemMessage['id']>((resolve) => {
    resolve(QB.chat.sendSystemMessage(to, message))
  })
}

export function QBChatMarkMessageRead(params: QBMessageStatusParams) {
  QB.chat.sendReadStatus(params)
}

export function QBWebRTCSessionGetUserMedia(
  session: QBWebRTCSession,
  params: QBGetUserMediaParams,
) {
  return new Promise<MediaStream | undefined>((resolve, reject) => {
    session.getUserMedia({ ...params }, (error, stream) => {
      if (error) {
        reject(error)
      } else {
        resolve(stream)
      }
    })
  })
}
