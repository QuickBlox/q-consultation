import { QBError, QBLoginParams, QBSession, QBUser } from 'quickblox'
import { QBApi } from './api'

export const qbSessionWithToken = (QB: QBApi, token: string) =>
  new Promise<QBSession>((resolve, reject) => {
    QB.startSessionWithToken(token, (error, res) => {
      if (res) {
        resolve(res.session)
      } else {
        reject(error)
      }
    })
  })

export const qbCreateSession = (QB: QBApi, credentials?: QBLoginParams) =>
  new Promise<QBSession>((resolve, reject) => {
    const cbSession = (error?: QBError | null, response?: QBSession | null) => {
      if (response) {
        resolve(response)
      } else {
        reject(error)
      }
    }

    if (credentials) {
      QB.createSession(credentials, cbSession)
    } else {
      QB.createSession(cbSession)
    }
  })

export const qbGetSession = (QB: QBApi) => {
  return new Promise<QBSession>((resolve, reject) => {
    QB.getSession((getSessionError, response) => {
      if (getSessionError || !response?.session) {
        reject(getSessionError || 'No session')
      } else {
        resolve(response.session)
      }
    })
  })
}

type LoginCredentials =
  | {
      login: string
      password: string
    }
  | {
      email: string
      password: string
    }

export const qbLogin = (QB: QBApi, credentials: LoginCredentials) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.login(credentials, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })

export function qbLogout(QB: QBApi) {
  return new Promise<void>((resolve, reject) => {
    QB.destroySession((error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
