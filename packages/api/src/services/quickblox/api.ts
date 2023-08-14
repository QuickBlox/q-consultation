import axios, { AxiosInstance } from 'axios'
import { QBConfig, QuickBlox } from 'quickblox'

export class QBApi extends QuickBlox {
  public axios: AxiosInstance

  public init() {
    const qbConfig: QBConfig = {
      debug: process.env.QB_SDK_CONFIG_DEBUG
        ? JSON.parse(process.env.QB_SDK_CONFIG_DEBUG)
        : false,
      endpoints: {},
      webrtc: {},
    }

    if (process.env.QB_SDK_CONFIG_ENDPOINT_API) {
      qbConfig.endpoints.api = process.env.QB_SDK_CONFIG_ENDPOINT_API
    }

    if (process.env.QB_SDK_CONFIG_ENDPOINT_CHAT) {
      qbConfig.endpoints.chat = process.env.QB_SDK_CONFIG_ENDPOINT_CHAT
    }

    if (process.env.QB_SDK_CONFIG_ICE_SERVERS) {
      qbConfig.webrtc.iceServers = process.env.QB_SDK_CONFIG_ICE_SERVERS
    }

    const hasSDKConfig = [
      process.env.QB_SDK_CONFIG_APP_ID,
      process.env.QB_SDK_CONFIG_AUTH_KEY,
      process.env.QB_SDK_CONFIG_AUTH_SECRET,
      process.env.QB_SDK_CONFIG_ACCOUNT_KEY,
    ].every((env) => env)

    if (!hasSDKConfig) {
      throw new Error('Missing QB_SDK_CONFIG environment variables')
    }

    super.init(
      process.env.QB_SDK_CONFIG_APP_ID!,
      process.env.QB_SDK_CONFIG_AUTH_KEY!,
      process.env.QB_SDK_CONFIG_AUTH_SECRET,
      process.env.QB_SDK_CONFIG_ACCOUNT_KEY!,
      qbConfig,
    )

    return this
  }

  private axiosInit() {
    const instance = axios.create()

    instance.interceptors.request.use((config) => {
      const {
        session,
        config: { endpoints },
      } = this.service.qbInst
      const qbApiConfig = { ...config }

      qbApiConfig.baseURL = `https://${endpoints.api}`

      if (session?.token) {
        qbApiConfig.headers = {
          ...qbApiConfig.headers,
          'QB-Token': session.token,
        }
      }

      return qbApiConfig
    })

    return instance
  }

  constructor() {
    super()
    this.axios = this.axiosInit()
  }
}

export const QBUserApi = new QBApi()
export const QBAdminApi = new QBApi()
