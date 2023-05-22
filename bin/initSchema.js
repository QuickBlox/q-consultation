const fs = require('fs')
const path = require('path')
const https = require('https')
const crypto = require('crypto')
const util = require('util')
const yaml = require('js-yaml')
const readline = require('readline-sync')
const dotenv = require('dotenv')

const readFile = util.promisify(fs.readFile)

const qcConfigFileLocation = path.resolve(__dirname, '..', 'qconsultation_config', '.env')
const qcSchemasFileLocation = path.resolve(__dirname, '..', 'qconsultation_config', 'schema.yml')
const { parsed: config } = dotenv.config({ path: qcConfigFileLocation })

function getAccountOwnerCredentials() {
  if (config.QB_ADMIN_EMAIL && config.QB_ADMIN_PASSWORD) {
    console.log(`QuickBlox account owner credentials found in config file: ${qcConfigFileLocation}`)

    return {
      email: config.QB_ADMIN_EMAIL,
      password: config.QB_ADMIN_PASSWORD,
    }
  }

  const email = readline.questionEMail(`Please enter your QuickBlox account owner email:\n`)
  const password = readline.question(`Please enter your QuickBlox account owner password:\n`, { hideEchoBack: true })

  return {
    email,
    password,
  }
}

async function getAllSchemas(schemaLocation) {
  const schema = await readFile(schemaLocation, 'utf8')
  const doc = yaml.load(schema)

  return Object.values(doc.qb_schema)
}

function generateAuthMsg(authCredentials) {
  return {
    application_id: config.QB_SDK_CONFIG_APP_ID,
    auth_key: config.QB_SDK_CONFIG_AUTH_KEY,
    nonce: Math.floor(Math.random() * 10000),
    timestamp: Math.floor(Date.now() / 1000),
    user: {
      email: authCredentials.email,
      password: authCredentials.password,
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

function authorize(authCredentials) {
  const message = generateAuthMsg(authCredentials)
  const signedMessage = signMessage(message, config.QB_SDK_CONFIG_AUTH_SECRET)

  message.signature = signedMessage

  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.QB_SDK_CONFIG_ENDPOINT_API,
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

function uploadSchema(schema, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.QB_SDK_CONFIG_ENDPOINT_API,
      port: 443,
      path: '/class.json',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'QB-Token': token,
      },
    }
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        const parsedData = JSON.parse(chunk.toString())

        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`${schema.name} schema created successfully.`)
          resolve()
        } else if (res.statusCode === 422) {
          if (parsedData.name.includes('is already taken')) {
            console.log(`${schema.name} schema is already taken.`)
            resolve()
          } else {
            reject({
              ...parsedData,
              statusCode: res.statusCode
            })
          }
        } else {
          reject({
            ...parsedData,
            statusCode: res.statusCode
          })
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
    const credentials = getAccountOwnerCredentials()

    const [token, schemas] = await Promise.all([
      authorize(credentials),
      getAllSchemas(qcSchemasFileLocation),
    ])
    await Promise.all(schemas.map((schema) => uploadSchema(schema, token)))

    process.exit(0)
  } catch (e) {
    console.log('Error:')

    if (typeof e === 'object' && e.statusCode === 401) {
      console.error('Incorrect email or password!')
    } else {
      console.error(e.message)
    }

    process.exit(1)
  }
}

bootstrap()
