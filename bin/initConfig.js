const fs = require('fs')
const path = require('path')
const util = require('util')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const writeFile = util.promisify(fs.writeFile)

const qcConfigFileLocation = path.resolve(__dirname, '..', 'qconsultation_config', 'config.json')

function readlineQuestion(text) {
  return new Promise((resolve) => {
    readline.question(text, (res) => {
      resolve(res)
    })
  })
}

async function getCorrectAnswer(message, values) {
  const value = await readlineQuestion(message)

  if (values.includes(value)) {
    return value
  } else {
    console.log('Incorrect value.');
    return await getCorrectAnswer(message, values)
  }
}

async function getBaseConfiguration() {
  const QB_SDK_CONFIG_APP_ID = await readlineQuestion(`Enter Application ID:\n`)
  const QB_SDK_CONFIG_AUTH_KEY = await readlineQuestion(`Enter Authorization key:\n`)
  const QB_SDK_CONFIG_AUTH_SECRET = await readlineQuestion(`Enter Authorization secret:\n`)
  const QB_SDK_CONFIG_ACCOUNT_KEY = await readlineQuestion(`Enter Account key:\n`)

  const QB_SDK_CONFIG_DEBUG = await getCorrectAnswer(`Enable QuickBlox debug mode? [y/n]\n`, ['y', 'n'])
  const QB_SDK_CONFIG_ENDPOINT_API = await readlineQuestion(`Enter API endpoint (optional):\n`)
  const QB_SDK_CONFIG_ENDPOINT_CHAT = await readlineQuestion(`Enter Chat endpoint (optional):\n`)
  const QB_SDK_CONFIG_ICE_SERVERS = await readlineQuestion(`Enter ICE servers in one line (optional):\n`)

  const AI_QUICK_ANSWER = await getCorrectAnswer(`Enable AI Quick answer? [y/n]\n`, ['y', 'n'])
  const ENABLE_REDUX_LOGGER = await getCorrectAnswer(`Enable Redux logger? [y/n]\n`, ['y', 'n'])
  const CLIENT_APP_URL = await readlineQuestion(`Enter Client app URL:\n`)
  const SERVER_APP_URL = await readlineQuestion(`Enter Server app URL:\n`)
  const DEFAULT_LANGUAGE = await getCorrectAnswer(`Enter default language [en/ua]:\n`, ['en', 'ua'])
  const FILE_SIZE_LIMIT = await readlineQuestion(`Enter a file size limit in bytes (optional):\n`)
  const FILE_EXTENSIONS_WHITELIST = await readlineQuestion(`Enter a space-separated list of available file extensions (optional):\n`)


  return {
    QB_SDK_CONFIG_APP_ID: parseInt(QB_SDK_CONFIG_APP_ID),
    QB_SDK_CONFIG_AUTH_KEY,
    QB_SDK_CONFIG_AUTH_SECRET,
    QB_SDK_CONFIG_ACCOUNT_KEY,
    QB_SDK_CONFIG_DEBUG: QB_SDK_CONFIG_DEBUG === 'y',
    QB_SDK_CONFIG_ENDPOINT_API: QB_SDK_CONFIG_ENDPOINT_API,
    QB_SDK_CONFIG_ENDPOINT_CHAT: QB_SDK_CONFIG_ENDPOINT_CHAT,
    QB_SDK_CONFIG_ICE_SERVERS: QB_SDK_CONFIG_ICE_SERVERS ? JSON.parse(QB_SDK_CONFIG_ICE_SERVERS) : [],
    AI_QUICK_ANSWER: AI_QUICK_ANSWER === 'y',
    ENABLE_REDUX_LOGGER: ENABLE_REDUX_LOGGER === 'y',
    CLIENT_APP_URL,
    SERVER_APP_URL,
    DEFAULT_LANGUAGE,
    FILE_SIZE_LIMIT: FILE_SIZE_LIMIT ? parseInt(FILE_SIZE_LIMIT) : 10485760,
    FILE_EXTENSIONS_WHITELIST: FILE_EXTENSIONS_WHITELIST.replaceAll() || "gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"
  }
}

function createConfigFile(configLocation, config) {
  return writeFile(configLocation, JSON.stringify(config, null, 2))
}

async function bootstrap() {
  try {
    const config = await getBaseConfiguration()

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
