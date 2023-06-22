import { FastifyInstance } from 'fastify'
import QB, { QBConfig, QBError, QBSession, QBUser } from 'quickblox'

export const qbInit = (config: FastifyInstance['config']) => {
  const qbConfig: QBConfig = {
    debug: config.QB_SDK_CONFIG_DEBUG,
    endpoints: {},
    webrtc: {},
  }

  if (config.QB_SDK_CONFIG_ENDPOINT_API) {
    qbConfig.endpoints.api = config.QB_SDK_CONFIG_ENDPOINT_API
  }

  if (config.QB_SDK_CONFIG_ENDPOINT_CHAT) {
    qbConfig.endpoints.chat = config.QB_SDK_CONFIG_ENDPOINT_CHAT
  }

  if (config.QB_SDK_CONFIG_ICE_SERVERS) {
    qbConfig.webrtc.iceServers = config.QB_SDK_CONFIG_ICE_SERVERS
  }

  QB.init(
    config.QB_SDK_CONFIG_APP_ID,
    config.QB_SDK_CONFIG_AUTH_KEY,
    config.QB_SDK_CONFIG_AUTH_SECRET,
    config.QB_SDK_CONFIG_ACCOUNT_KEY,
    qbConfig,
  )
}

export const qbSessionWithToken = (token: string) =>
  new Promise<QBSession>((resolve, reject) => {
    QB.startSessionWithToken(token, (error, res) => {
      if (error) {
        reject(error)
      } else {
        resolve(res.session)
      }
    })
  })

export const qbCreateSession = (email?: string, password?: string) =>
  new Promise<QBSession>((resolve, reject) => {
    const cbSession = (error: QBError | undefined, response: QBSession) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    }

    if (email && password) {
      QB.createSession({ email, password }, cbSession)
    } else {
      QB.createSession(cbSession)
    }
  })

export const QBGetSession = () => {
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

export const qbLogin = (email: string, password: string) =>
  new Promise<QBUser>((resolve, reject) => {
    QB.login({ email, password }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export function qbLogout() {
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
