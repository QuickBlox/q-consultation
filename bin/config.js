const path = require('path')
const fs = require('fs')
const dotenv = require('dotenv')

const CONFIG_PATH = path.resolve(__dirname, '..', 'qconsultation_config', '.env')

const QB_DEFAULT_API_ENDPOINT = 'api.quickblox.com'
const QB_DEFAULT_CHAT_ENDPOINT = 'chat.quickblox.com'

const fields = [
  'QB_SDK_CONFIG_APP_ID',
  'QB_SDK_CONFIG_AUTH_KEY',
  'QB_SDK_CONFIG_AUTH_SECRET',
  'QB_SDK_CONFIG_ACCOUNT_KEY',
  'QB_SDK_CONFIG_DEBUG',
  'QB_SDK_CONFIG_ENDPOINT_API',
  'QB_SDK_CONFIG_ENDPOINT_CHAT',
  'QB_SDK_CONFIG_ICE_SERVERS',
  'AI_QUICK_ANSWER',
  'AI_SUGGEST_PROVIDER',
  'AI_RECORD_ANALYTICS',
  'ENABLE_REDUX_LOGGER',
  'CLIENT_APP_URL',
  'SERVER_APP_URL',
  'DEFAULT_LANGUAGE',
  'FILE_SIZE_LIMIT',
  'FILE_EXTENSIONS_WHITELIST'
]

const parseValue = (value) => {
  try {
    if (/^(true|false)$/i.test(value)) {
      return JSON.parse(value.toLowerCase())
    }

    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

function getConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    const dotenvFile = fs.readFileSync(CONFIG_PATH)
    const appConfig = dotenv.parse(dotenvFile)

    let isInvalid = typeof appConfig !== "object"

    if (!isInvalid) {
      const fieldsConfig = Object.keys(appConfig)

      isInvalid = fields.some(key => !fieldsConfig.includes(key))
    }

    if (isInvalid) throw new Error('Config is invalid')

    if (
      appConfig.QB_SDK_CONFIG_APP_ID === -1 ||
      appConfig.QB_SDK_CONFIG_AUTH_KEY.length === 0 ||
      appConfig.QB_SDK_CONFIG_AUTH_SECRET.length === 0 ||
      appConfig.QB_SDK_CONFIG_ACCOUNT_KEY.length === 0
    ) {
      throw new Error(`Config is empty (${CONFIG_PATH})`)
    }

    if (appConfig.QB_SDK_CONFIG_ENDPOINT_API.length === 0) {
      appConfig.QB_SDK_CONFIG_ENDPOINT_API = QB_DEFAULT_API_ENDPOINT
    }

    if (appConfig.QB_SDK_CONFIG_ENDPOINT_CHAT.length === 0) {
      appConfig.QB_SDK_CONFIG_ENDPOINT_CHAT = QB_DEFAULT_CHAT_ENDPOINT
    }

    return Object.entries(appConfig).reduce(
      (res, [key, value]) => fields.includes(key) ? { ...res, [key]: parseValue(value) } : res,
      {},
    )
  } else {
    throw new Error(`Config was not found at path: ${CONFIG_PATH}`)
  }
}

module.exports = getConfig
