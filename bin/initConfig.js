const fs = require('fs')
const path = require('path')
const util = require('util')
const readline = require('readline-sync')

const writeFile = util.promisify(fs.writeFile)

const qcConfigFileLocation = path.resolve(__dirname, '..', 'qconsultation_config', '.env')

const QB_DEFAULT_API_ENDPOINT = 'api.quickblox.com'
const QB_DEFAULT_CHAT_ENDPOINT = 'chat.quickblox.com'
const DEFAULT_CLIENT_APP_URL = 'https://localhost:3001'
const DEFAULT_SERVER_APP_URL = 'http://localhost:4000'
const DEFAULT_FILE_SIZE_LIMIT = 10485760
const DEFAULT_FILE_EXTENSIONS_WHITELIST = 'gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif'

function getBaseConfiguration() {
  const QB_SDK_CONFIG_APP_ID = readline.questionInt(`Enter QuickBlox Application ID:\n`)
  const QB_SDK_CONFIG_AUTH_KEY = readline.question(`Enter QuickBlox Authorization key:\n`)
  const QB_SDK_CONFIG_AUTH_SECRET = readline.question(`Enter QuickBlox Authorization secret:\n`)
  const QB_SDK_CONFIG_ACCOUNT_KEY = readline.question(`Enter QuickBlox Account key:\n`)

  const QB_SDK_CONFIG_DEBUG = readline.keyInYN(`Enable QuickBlox debug mode?\n`) || false
  const QB_SDK_CONFIG_ENDPOINT_API = readline.question(`Enter QuickBlox API endpoint (optional):\n`, { defaultInput: QB_DEFAULT_API_ENDPOINT })
  const QB_SDK_CONFIG_ENDPOINT_CHAT = readline.question(`Enter QuickBlox Chat endpoint (optional):\n`, { defaultInput: QB_DEFAULT_CHAT_ENDPOINT })
  const QB_SDK_CONFIG_ICE_SERVERS = readline.question(`Enter QuickBlox ICE servers in one line (optional):\n`) || []

  const enableIntegrationAPI = readline.keyInYN(`Enable integration with your API?\n`) || false
  const BEARER_TOKEN = enableIntegrationAPI ? readline.question(`Enter Bearer Token:\n`) : ''
  const QB_ADMIN_EMAIL = enableIntegrationAPI ? readline.questionEMail(`Enter QuickBlox account owner email:\n`) : ''
  const QB_ADMIN_PASSWORD = enableIntegrationAPI ? readline.question(`Enter QuickBlox account owner password:\n`, { hideEchoBack: true }) : ''

  const enableOpenAI = readline.keyInYN(`Enable OpenAI?\n`) || false
  const OPENAI_API_KEY = enableOpenAI ? readline.question(`Enter OpenAI API Key:\n`) : ''
  const AI_QUICK_ANSWER = enableOpenAI && readline.keyInYN(`Enable AI Quick answer?\n`) || false
  const AI_SUGGEST_PROVIDER = enableOpenAI && readline.keyInYN(`Enable AI Suggest provider?\n`) || false
  const AI_RECORD_ANALYTICS = enableOpenAI && readline.keyInYN(`Enable AI Record analytics?\n`) || false

  const ENABLE_REDUX_LOGGER = readline.keyInYN(`Enable Redux logger?\n`) || false
  const CLIENT_APP_URL = readline.question(`Enter Client app URL (optional):\n`, { defaultInput: DEFAULT_CLIENT_APP_URL, limit: /^https?:\/\/[^\s\/$.?#].[^\s]*$/ })
  const SERVER_APP_URL = readline.question(`Enter Server app URL (optional):\n`, { defaultInput: DEFAULT_SERVER_APP_URL, limit: /^https?:\/\/[^\s\/$.?#].[^\s]*$/ })
  const DEFAULT_LANGUAGE = readline.question(`Enter default language (optional) [en/ua]:\n`, { defaultInput: 'en', limit: ['en', 'ua'] })
  const FILE_SIZE_LIMIT = readline.questionInt(`Enter a file size limit in bytes (optional):\n`, { defaultInput: DEFAULT_FILE_SIZE_LIMIT })
  const FILE_EXTENSIONS_WHITELIST = readline.question(`Enter a space-separated list of available file extensions (optional):\n`, { defaultInput: DEFAULT_FILE_EXTENSIONS_WHITELIST })
  const ENABLE_GUEST_CLIENT = readline.keyInYN(`Enable Guest Client?\n`) || false

  return {
    QB_SDK_CONFIG_APP_ID,
    QB_SDK_CONFIG_AUTH_KEY,
    QB_SDK_CONFIG_AUTH_SECRET,
    QB_SDK_CONFIG_ACCOUNT_KEY,
    QB_SDK_CONFIG_DEBUG,
    QB_SDK_CONFIG_ENDPOINT_API,
    QB_SDK_CONFIG_ENDPOINT_CHAT,
    QB_SDK_CONFIG_ICE_SERVERS,
    BEARER_TOKEN,
    QB_ADMIN_EMAIL,
    QB_ADMIN_PASSWORD,
    OPENAI_API_KEY,
    AI_QUICK_ANSWER,
    AI_SUGGEST_PROVIDER,
    AI_RECORD_ANALYTICS,
    ENABLE_REDUX_LOGGER,
    CLIENT_APP_URL,
    SERVER_APP_URL,
    DEFAULT_LANGUAGE,
    FILE_SIZE_LIMIT,
    FILE_EXTENSIONS_WHITELIST,
    ENABLE_GUEST_CLIENT,
  }
}

function createConfigFile(configLocation, config) {
  const envConfig = Object.entries(config)
    .map(([key, value]) => `${key}=${typeof value === 'string' && key !== 'QB_SDK_CONFIG_ICE_SERVERS' ? `"${value}"` : value}`)
    .join('\n')

  return writeFile(configLocation, envConfig)
}

async function bootstrap() {
  try {
    const config = getBaseConfiguration()

    await createConfigFile(qcConfigFileLocation, config)
    console.log('Configuration file created successfully')

    process.exit(0)
  } catch (e) {
    console.log('Error:')
    console.error(e.message)

    process.exit(1)
  }
}

bootstrap()
