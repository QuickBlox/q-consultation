const fs = require('fs')
const path = require('path')
const util = require('util')
const yaml = require('js-yaml')
const https = require('https')
const crypto = require('crypto')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})
const getConfig = require('./config')

const readFile = util.promisify(fs.readFile)

const qcAppointmentSchemaFileLocation = path.resolve(__dirname, '..','qconsultation_config','schema.yml')

function readlineQuestion(text, writeToOutput) {
  return new Promise((resolve) => {
    readline.question(text, (res) => {
      resolve(res)
    })
    if (writeToOutput) {
      readline._writeToOutput = writeToOutput
    }
  })
}

async function getAccountOwnerCredentials() {
  const email = await readlineQuestion(`Please enter your QuickBlox account owner email:\n`)
  const password = await readlineQuestion(`Please enter your QuickBlox account owner password:\n`, (stringToWrite) => {
    if (stringToWrite !== '\r\n') {
      readline.output.write('*')
    } else {
      readline.output.write(stringToWrite)
    }
  })

  return { email, password }
}

async function getAppointmentsSchema(schemaLocation) {
  const schema = await readFile(schemaLocation, 'utf8')
  const doc = yaml.load(schema)

  return doc.qb_schema.custom_class_Appointment
}

function generateAuthMsg(authCredentials, config) {
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

function authorize(authCredentials, config) {
  const message = generateAuthMsg(authCredentials, config)
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

function uploadAppointmentSchema(schema, token, config) {
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
    const config = getConfig()
    const credentials = await getAccountOwnerCredentials()

    const [schema, token] = await Promise.all([
      getAppointmentsSchema(qcAppointmentSchemaFileLocation),
      authorize(credentials, config)
    ])
    await uploadAppointmentSchema(schema, token, config)
    console.log('Appointment data schema created successfully.')

    process.exit(0)
  } catch (e) {
    console.log('Error:')

    if (typeof e === 'object' && e.statusCode === 422) {
      console.error('Appointment schema is already taken!')
    } else if (typeof e === 'object' && e.statusCode === 401) {
      console.error('Incorrect email or password!')
    } else {
      console.error(e.message)
    }

    process.exit(1)
  }
}

bootstrap()
