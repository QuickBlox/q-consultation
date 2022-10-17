const path = require('path')
const fs = require('fs')

const DEFAULT_CONFIG_NAME = 'config.json'
const DEFAULT_CONFIG_PATH = path.resolve(__dirname, 'config.tpl')
const CONFIG_PATH = path.resolve(
  __dirname,
  ['..', '..'].join(path.sep),
  'qconsultation_config',
  DEFAULT_CONFIG_NAME
)

if (!fs.existsSync(CONFIG_PATH)) {
  const configDir = path.dirname(CONFIG_PATH)
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir)
  }

  const defaultConfig = fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8")
  fs.writeFileSync(CONFIG_PATH, defaultConfig)
}
