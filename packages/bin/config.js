const fs = require('fs')
const dotenv = require('dotenv')

const requiredFields = [
  'QB_SDK_CONFIG_APP_ID',
  'QB_SDK_CONFIG_AUTH_KEY',
  'QB_SDK_CONFIG_AUTH_SECRET',
  'QB_SDK_CONFIG_ACCOUNT_KEY',
  'QB_SDK_CONFIG_ENDPOINT_API',
  'QB_SDK_CONFIG_ENDPOINT_CHAT'
]

const excludedFields = [
  'QB_ADMIN_EMAIL',
  'QB_ADMIN_PASSWORD',
  'BEARER_TOKEN',
  'OPENAI_API_KEY',
]

const parseValue = (value) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}

function getDataConfig(config) {
  let isInvalid = typeof config !== "object"

  if (!isInvalid) {
    const fieldsConfig = Object.keys(config)

    isInvalid = requiredFields.some(key => !fieldsConfig.includes(key))
  }

  if (isInvalid) throw new Error('Config is invalid')

  if (
    config.QB_SDK_CONFIG_APP_ID === -1 ||
    config.QB_SDK_CONFIG_AUTH_KEY.length === 0 ||
    config.QB_SDK_CONFIG_AUTH_SECRET.length === 0 ||
    config.QB_SDK_CONFIG_ACCOUNT_KEY.length === 0
  ) {
    throw new Error(`Config is empty (${configPath})`)
  }

  return Object.entries(config).reduce(
    (res, [key, value]) => excludedFields.includes(key) ? res : { ...res, [key]: parseValue(value) },
    {},
  )
}

function getConfig(configPath) {
  try {
    return getDataConfig(process.env)
  } catch (error) {
    if (fs.existsSync(configPath)) {
      const dotenvFile = fs.readFileSync(configPath)
      const appConfig = dotenv.parse(dotenvFile)

      return getDataConfig(appConfig)
    } else {
      throw new Error(`Config was not found at path: ${configPath}`)
    }
  }
}

module.exports = getConfig
