const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const https = require('https')
const crypto = require('crypto')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

const qbDefaultApiEndpoint = 'api.quickblox.com'
const qcConfigFileLocation = path.resolve(__dirname, '..', 'qconsultation_config', 'config.json')
const qcAppointmentSchemaFileLocation = path.resolve(__dirname, '..','qconsultation_config','schema.yml')

function getAccountOwnerCredentials() {
  return new Promise((resolve) => {
    readline.question(
      `Please enter your QuickBlox account owner email:\n`,
      (email) => {
        readline.question(
          `Please enter your QuickBlox account owner password:\n`,
          (password) => {
            readline.close()
            resolve({ email, password })
          },
        )
        // Hide password
        readline._writeToOutput = function _writeToOutput(stringToWrite) {
          if (stringToWrite !== '\r\n') {
            readline.output.write('*')
          } else {
            readline.output.write(stringToWrite)
          }
        }
      },
    )
  })
}

function getConfigFromConfigFile(configLocation) {
  const rawConfig = fs.readFileSync(configLocation)
  const config = JSON.parse(rawConfig)

  // Check config
  if (
    config.QB_SDK_CONFIG_APP_ID === -1 ||
    config.QB_SDK_CONFIG_AUTH_KEY.length === 0 ||
    config.QB_SDK_CONFIG_AUTH_SECRET.length === 0
  ) {
    console.error(`${qcConfigFileLocation} file is empty.`)
    process.exit(1)
  }

  // Check api endpoint
  if (config.QB_SDK_CONFIG_ENDPOINTS_API.length === 0) {
    config.QB_SDK_CONFIG_ENDPOINTS_API = qbDefaultApiEndpoint
  }

  return {
    appId: config.QB_SDK_CONFIG_APP_ID,
    authKey: config.QB_SDK_CONFIG_AUTH_KEY,
    authSecret: config.QB_SDK_CONFIG_AUTH_SECRET,
    apiEndpoint: config.QB_SDK_CONFIG_ENDPOINTS_API,
  }
}

function getAppointmentsSchema(schemaLocation) {
  const doc = yaml.load(fs.readFileSync(schemaLocation, 'utf8'))

  return doc.qb_schema.custom_class_Appointment
}

function generateAuthMsg(authCreds, config) {
  return {
    application_id: config.appId,
    auth_key: config.authKey,
    nonce: Math.floor(Math.random() * 10000),
    timestamp: Math.floor(Date.now() / 1000),
    user: {
      email: authCreds.email,
      password: authCreds.password,
    },
  }
}

function signMessage(message, secret) {
  const sessionMsg = Object.keys(message)
    .map((val) => {
      if (typeof message[val] === 'object') {
        return Object.keys(message[val])
          .map((val1) => {
            return `${val}[${val1}]=${message[val][val1]}`
          })
          .sort()
          .join('&')
      }

      return `${val}=${message[val]}`
    })
    .sort()
    .join('&')

  const signedMessage = crypto
    .createHmac('sha256', secret)
    .update(sessionMsg)
    .digest('hex')
    .toString()

  return signedMessage
}

function authorize(authCreds, config) {
  const message = generateAuthMsg(authCreds, config)
  const signedMessage = signMessage(message, config.authSecret)

  message.signature = signedMessage

  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.apiEndpoint,
      port: 443,
      path: '/session.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        if (res.statusCode == 200 || res.statusCode == 201) {
          resolve(JSON.parse(data).session.token)
        } else {
          const parsedData = JSON.parse(data)

          parsedData.statusCode = res.statusCode
          reject(parsedData)
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })
    req.write(JSON.stringify(message))
    req.end()
  })
}

function createAppointmentSchema(schema, token, config) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.apiEndpoint,
      port: 443,
      path: '/class.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'QB-Token': token,
      },
    }
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve()
        } else if (res.statusCode === 422) {
          if (JSON.parse(data).name === 'is already taken') {
            resolve()
          } else {
            const parsedData = JSON.parse(data)

            parsedData.statusCode = res.statusCode
            reject(parsedData)
          }
        } else {
          const parsedData = JSON.parse(data)

          parsedData.statusCode = res.statusCode
          reject(parsedData)
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })
    req.write(JSON.stringify(schema))
    req.end()
  })
}

async function bootstrap() {
  try {
    const config = getConfigFromConfigFile(qcConfigFileLocation)
    const schema = getAppointmentsSchema(qcAppointmentSchemaFileLocation)
    const credentials = await getAccountOwnerCredentials()
    const token = await authorize(credentials, config)

    await createAppointmentSchema(schema, token, config)
    console.log('Appointment data schema created successfully.')
  } catch (e) {
    console.log('Error:')
    console.error(e)
  } finally {
    process.exit(0)
  }
}

bootstrap()
