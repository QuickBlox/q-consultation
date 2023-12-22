const fs = require('fs')
const path = require('path')
const util = require('util')
const readline = require('readline-sync')

const writeFile = util.promisify(fs.writeFile)

const qcConfigFileLocation = path.resolve(__dirname, '..', '..', '.env')

const QB_DEFAULT_API_ENDPOINT = 'api.quickblox.com'
const QB_DEFAULT_CHAT_ENDPOINT = 'chat.quickblox.com'
const DEFAULT_CLIENT_APP_URL = 'https://127.0.0.1:3001'
const DEFAULT_SERVER_APP_URL = 'http://127.0.0.1:4000'
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

  const QB_ADMIN_EMAIL = readline.questionEMail(`Enter QuickBlox account owner email:\n`)
  const QB_ADMIN_PASSWORD = readline.question(`Enter QuickBlox account owner password:\n`, { hideEchoBack: true })

  const enableIntegrationAPI = readline.keyInYN(`Enable integration with your API?\n`) || false
  const BEARER_TOKEN = enableIntegrationAPI ? readline.question(`Enter Bearer Token:\n`) : ''

  const enableOpenAI = readline.keyInYN(`Enable OpenAI?\n`) || false
  const OPENAI_API_KEY = enableOpenAI ? readline.question(`Enter OpenAI API Key:\n`) : ''
  const AI_QUICK_ANSWER = enableOpenAI && readline.keyInYN(`Enable AI Quick answer?\n`) || false
  const AI_SUGGEST_PROVIDER = enableOpenAI && readline.keyInYN(`Enable AI Suggest provider?\n`) || false
  const AI_RECORD_ANALYTICS = enableOpenAI && readline.keyInYN(`Enable AI Record analytics?\n`) || false
  const AI_REPHRASE = enableOpenAI && readline.keyInYN(`Enable AI Rephrase?\n`) || false
  const AI_TRANSLATE = enableOpenAI && readline.keyInYN(`Enable AI Rephrase?\n`) || false

  const PROVIDER_ASSISTANT_ID = readline.questionInt(`Enter Provider Assistant ID (optional):\n`, { defaultInput: -1 })

  const APP_NAME =  readline.question(`Enter Application name (optional):\n`) || 'Q-Consultation'
  const APP_DESCRIPTION =  readline.question(`Enter Application description (optional):\n`) || 'Q-Consultation'

  const ENABLE_REDUX_LOGGER = readline.keyInYN(`Enable Redux logger?\n`) || false
  const DISPLAY_VERSION = readline.keyInYN(`Display the version?\n`) || false
  const CLIENT_APP_URL = readline.question(`Enter Client app URL (optional):\n`, { defaultInput: DEFAULT_CLIENT_APP_URL, limit: /^https?:\/\/[^\s\/$.?#].[^\s]*$/ })
  const SERVER_APP_URL = readline.question(`Enter Server app URL (optional):\n`, { defaultInput: DEFAULT_SERVER_APP_URL, limit: /^https?:\/\/[^\s\/$.?#].[^\s]*$/ })
  const ENABLE_GUEST_CLIENT = readline.keyInYN(`Enable Guest Client?\n`) || false
  const HAS_HISTORY = readline.keyInYN(`Enable History page?\n`) || false
  const HAS_PROVIDER_LIST = readline.keyInYN(`Enable Provider page?\n`) || false
  const HAS_CHANGE_LANGUAGE = readline.keyInYN(`Enable change language?\n`) || false
  const DEFAULT_LANGUAGE = readline.question(`Enter default language (optional) [en/es/uk]:\n`, { defaultInput: 'en', limit: ['en', 'es', 'uk'] })
  const FILE_SIZE_LIMIT = readline.questionInt(`Enter a file size limit in bytes (optional):\n`, { defaultInput: DEFAULT_FILE_SIZE_LIMIT })
  const FILE_EXTENSIONS_WHITELIST = readline.question(`Enter a space-separated list of available file extensions (optional):\n`, { defaultInput: DEFAULT_FILE_EXTENSIONS_WHITELIST })

  return {
    QB_SDK_CONFIG_APP_ID,
    QB_SDK_CONFIG_AUTH_KEY,
    QB_SDK_CONFIG_AUTH_SECRET,
    QB_SDK_CONFIG_ACCOUNT_KEY,
    QB_SDK_CONFIG_DEBUG,
    QB_SDK_CONFIG_ENDPOINT_API,
    QB_SDK_CONFIG_ENDPOINT_CHAT,
    QB_SDK_CONFIG_ICE_SERVERS,
    QB_ADMIN_EMAIL,
    QB_ADMIN_PASSWORD,
    BEARER_TOKEN,
    OPENAI_API_KEY,
    AI_QUICK_ANSWER,
    AI_SUGGEST_PROVIDER,
    AI_RECORD_ANALYTICS,
    AI_REPHRASE,
    AI_TRANSLATE,
    PROVIDER_ASSISTANT_ID,
    APP_NAME,
    APP_DESCRIPTION,
    ENABLE_REDUX_LOGGER,
    DISPLAY_VERSION,
    CLIENT_APP_URL,
    SERVER_APP_URL,
    ENABLE_GUEST_CLIENT,
    HAS_HISTORY,
    HAS_PROVIDER_LIST,
    HAS_CHANGE_LANGUAGE,
    DEFAULT_LANGUAGE,
    FILE_SIZE_LIMIT,
    FILE_EXTENSIONS_WHITELIST,
  }
}

function createConfigFile(configLocation, config) {
  const envConfig = Object.entries(config)
    .map(([key, value]) => `${key}=${typeof value === 'string' && key !== 'QB_SDK_CONFIG_ICE_SERVERS' ? `"${value}"` : value}`)
    .join('\n') + '\n'

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
