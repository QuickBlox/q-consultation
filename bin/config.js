const path = require('path')
const fs = require('fs')

const DEFAULT_CONFIG_NAME = 'config.json'
const DEFAULT_CONFIG_PATH = path.resolve(__dirname, 'config.tpl')
const CONFIG_PATH = path.resolve(
  __dirname,
  ['..'].join(path.sep),
  'qconsultation_config',
  DEFAULT_CONFIG_NAME
)
let appConfig
if (process.env.CONFIG_PATH) {
  appConfig = require(process.env.CONFIG_PATH)
} else {
  if (fs.existsSync(CONFIG_PATH)) {
    appConfig = require(CONFIG_PATH)
    let isInvalid = typeof appConfig !== "object"

    if (!isInvalid) {
      const defaultConfigText = fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8");
      const defaultConfig = JSON.parse(defaultConfigText)
      const fieldsConfig = Object.keys(appConfig)

      isInvalid = Object.keys(defaultConfig).some(key => !fieldsConfig.includes(key))
    }

    if (isInvalid) throw new Error('Config is invalid')
  } else {
    throw new Error('Config was not found at path: ' + CONFIG_PATH)
  }
}

module.exports = appConfig
