import { QBConfig } from '@qc/quickblox'

interface QBInitConfig {
  QB_SDK_CONFIG_DEBUG?: boolean
  QB_SDK_CONFIG_ENDPOINT_API?: string
  QB_SDK_CONFIG_ENDPOINT_CHAT?: string
  QB_SDK_CONFIG_ICE_SERVERS?: string
}

export const createInitConfig = (config: QBInitConfig) => {
  const qbConfig: QBConfig = {
    debug: config.QB_SDK_CONFIG_DEBUG || false,
    endpoints: {
      api: config.QB_SDK_CONFIG_ENDPOINT_API,
      chat: config.QB_SDK_CONFIG_ENDPOINT_CHAT,
    },
    webrtc: {
      iceServers: config.QB_SDK_CONFIG_ICE_SERVERS as any,
    },
  }

  return qbConfig
}
