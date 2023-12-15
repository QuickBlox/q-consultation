import axios from 'axios'
import {
  QBConfig,
  QBContentObject,
  QBCustomObject,
  QBError,
  QBUser,
  QuickBlox,
} from 'quickblox'
import FormData from 'form-data'
import { QBCallback } from './types'

type Dictionary<T> = Record<string, T>

type QBExtendedUsers = QuickBlox['users'] & {
  getById(id: QBUser['id'], callback: QBCallback<QBUser>): void
}

type QBExtendedData = QuickBlox['data'] & {
  createChild<T extends QBCustomObject>(
    parentClassName: string,
    parentId: QBCustomObject['_id'],
    childClassName: string,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ): void
  updateByCriteria<T extends QBCustomObject>(
    className: string,
    filters: Dictionary<unknown>,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ): void
  deleteByCriteria(
    className: string,
    data: Dictionary<unknown>,
    callback: QBCallback<{ total_deleted: number }>,
  ): void
}

export class QBExtended extends QuickBlox {
  private _axios = axios.create()

  public users = <QBExtendedUsers>{}

  public data = <QBExtendedData>{}

  public init(
    appIdOrToken: string | number,
    authKeyOrAppId: string | number,
    authSecret: string | null | undefined,
    accountKey: string,
    config?: QBConfig,
  ) {
    super.init(appIdOrToken, authKeyOrAppId, authSecret, accountKey, config)
    this._initAxios()
    this._bindMethods()
  }

  private _bindMethods() {
    this.chat.dialog.create = this.chat.dialog.create.bind(this.chat.dialog)
    this.chat.dialog.list = this.chat.dialog.list.bind(this.chat.dialog)
    this.chat.dialog.update = this.chat.dialog.update.bind(this.chat.dialog)

    this.chat.message.list = this.chat.message.list.bind(this.chat.message)

    this.chat.muc.join = this.chat.muc.join.bind(this.chat.muc)
    this.chat.muc.leave = this.chat.muc.leave.bind(this.chat.muc)

    this.chat.connect = this.chat.connect.bind(this.chat)
    this.chat.disconnect = this.chat.disconnect.bind(this.chat)
    this.chat.ping = this.chat.ping.bind(this.chat)
    this.chat.send = this.chat.send.bind(this.chat)
    this.chat.sendDeliveredStatus = this.chat.sendDeliveredStatus.bind(this.chat)
    this.chat.sendIsStopTypingStatus = this.chat.sendIsStopTypingStatus.bind(this.chat)
    this.chat.sendIsTypingStatus = this.chat.sendIsTypingStatus.bind(this.chat)
    this.chat.sendReadStatus = this.chat.sendReadStatus.bind(this.chat)
    this.chat.sendSystemMessage = this.chat.sendSystemMessage.bind(this.chat)

    this.content.create = this.content.create.bind(this.content)
    this.content.createAndUpload = this.content.createAndUpload.bind(this.content)
    this.content.delete = this.content.delete.bind(this.content)
    this.content.getInfo = this.content.getInfo.bind(this.content)
    this.content.markUploaded = this.content.markUploaded.bind(this.content)
    this.content.privateUrl = this.content.privateUrl.bind(this.content)
    this.content.publicUrl = this.content.publicUrl.bind(this.content)

    this.data.create = this.data.create.bind(this.data)
    this.data.delete = this.data.delete.bind(this.data)
    this.data.deleteFile = this.data.deleteFile.bind(this.data)
    this.data.fileUrl = this.data.fileUrl.bind(this.data)
    this.data.list = this.data.list.bind(this.data)
    this.data.update = this.data.update.bind(this.data)
    this.data.uploadFile = this.data.uploadFile.bind(this.data)

    this.users.create = this.users.create.bind(this.users)
    this.users.delete = this.users.delete.bind(this.users)
    this.users.get = this.users.get.bind(this.users)
    this.users.listUsers = this.users.listUsers.bind(this.users)
    this.users.update = this.users.update.bind(this.users)

    if (this.webrtc) {
      this.webrtc.createNewSession = this.webrtc.createNewSession.bind(this.webrtc)
      this.webrtc.getMediaDevices = this.webrtc.getMediaDevices.bind(this.webrtc)
    }

    this.createSession = this.createSession.bind(this)
    this.destroySession = this.destroySession.bind(this)
    this.getSession = this.getSession.bind(this)
    this.init = this.init.bind(this)
    this.initWithAppId = this.initWithAppId.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.startSessionWithToken = this.startSessionWithToken.bind(this)

    /* New methods */
    this.users.getById = this._usersGetById.bind(this)

    this.data.createChild = this._dataCreateChild.bind(this)
    this.data.updateByCriteria = this._dataUpdateByCriteria.bind(this)
    this.data.deleteByCriteria = this._dataDeleteByCriteria.bind(this)

    this.content.createAndUpload = this._contentCreateAndUpload.bind(this)
  }

  private _initAxios() {
    this._axios.interceptors.request.use((axiosConfig) => {
      const {
        session,
        config: { endpoints },
      } = this.service.qbInst

      // eslint-disable-next-line no-param-reassign
      axiosConfig.baseURL = `https://${endpoints.api}`

      if (session?.token) {
        axiosConfig.headers.set('QB-Token', session.token)
      }

      return axiosConfig
    })
    this._axios.interceptors.response.use(
      (data) => data,
      (error) =>
        Promise.reject(error?.response?.data || error?.message || error),
    )
  }

  private _usersGetById(id: QBUser['id'], callback: QBCallback<QBUser>) {
    this._axios
      .get<{ user: QBUser }>(`/users/${id}`)
      .then(({ data: { user } }) => callback(null, user))
      .catch((error: QBError) => callback(error, null))
  }

  private _dataCreateChild<T extends QBCustomObject>(
    parentClassName: string,
    parentId: QBCustomObject['_id'],
    childClassName: string,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ) {
    this._axios
      .post<T>(`/data/${parentClassName}/${parentId}/${childClassName}`, data)
      .then(({ data: res }) => callback(null, res))
      .catch((error: QBError) => callback(error, null))
  }

  private _dataUpdateByCriteria<T extends QBCustomObject>(
    className: string,
    filters: Dictionary<unknown>,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ) {
    this._axios
      .post<T>(`/data/${className}/by_criteria`, {
        ...data,
        search_criteria: filters,
      })
      .then(({ data: res }) => callback(null, res))
      .catch((error: QBError) => callback(error, null))
  }

  private _dataDeleteByCriteria(
    className: string,
    data: Dictionary<unknown>,
    callback: QBCallback<{ total_deleted: number }>,
  ) {
    this._axios
      .delete<{ total_deleted: number }>(`/data/${className}/by_criteria`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data,
      })
      .then(({ data: res }) => callback(null, res))
      .catch((error: QBError) => callback(error, null))
  }

  private _contentCreateAndUpload(
    params: {
      name: string
      file: Buffer
      type: string
      size: number
      public?: boolean
    },
    callback: QBCallback<QBContentObject>,
  ) {
    this.content.create(
      { name: params.name, content_type: params.type, public: params.public },
      (blobError, blob) => {
        if (blob) {
          const url = new URL(blob.blob_object_access.params)
          const form = new FormData()

          url.searchParams.forEach((value, key) => {
            form.append(key, value)
          })
          form.append('file', params.file, params.name)

          this._axios
            .post(`${url.origin}${url.pathname}`, form)
            .then(() => {
              this.content.markUploaded(
                { id: blob.id, size: params.size },
                (markError) => {
                  if (markError) {
                    callback(markError, null)
                  } else {
                    callback(null, blob)
                  }
                },
              )

              return null
            })
            .catch((uploadError: QBError) => callback(uploadError, null))
        } else {
          callback(blobError!, null)
        }
      },
    )
  }
}

export default new QBExtended()
