const path = require('path')
const data = require('./script.json')
const fs = require('fs')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config({
  path: path.resolve(__dirname, '../qconsultation_config/.env'),
})
const auth = {
  headers: {
    Authorization: `bearer ${process.env.BEARER_TOKEN}`,
  },
}
let IdData = {
  providers: {},
  clients: {},
  appointments: {},
}

async function sendProvidersToServer(array) {
  for (const provider of array) {
    await apiRequestsProviders(provider)
  }
}

async function apiRequestsProviders(provider) {
  try {
    const formData = new FormData()
    const absolutePath = path.resolve(__dirname, provider.avatar)

    formData.append('full_name', provider.full_name)
    formData.append('profession', provider.profession)
    formData.append('email', provider.email)
    formData.append('avatar', fs.createReadStream(absolutePath))
    formData.append('language', provider.language)
    formData.append('password', provider.password)

    const response = await axios.post(
      process.env.SERVER_APP_URL + '/users/provider',
      formData,
      auth,
    )
    IdData.providers[provider._id] = response.data.user.id
    console.log(response.data, 'res')
  } catch (e) {
    console.log(e, 'error')
  }
}

async function sendClientsToServer(array) {
  for (const client of array) {
    await apiRequestsClients(client)
  }
}

async function apiRequestsClients(client) {
  try {
    const formData = new FormData()
    const absolutePath = path.resolve(__dirname, client.avatar)

    formData.append('full_name', client.full_name)
    formData.append('email', client.email)
    formData.append('avatar', fs.createReadStream(absolutePath))
    formData.append('language', client.language)
    formData.append('password', client.password)
    formData.append('birthdate', client.birthdate)
    formData.append('gender', client.gender)
    formData.append('address', client.address)

    const response = await axios.post(
      process.env.SERVER_APP_URL + '/users/client',
      formData,
      auth,
    )
    IdData.clients[client._id] = response.data.user.id
    console.log(response.data)
  } catch (e) {
    console.log(e)
  }
}

async function sendAppointmentsToServer(array) {
  for (const appointment of array) {
    await apiRequestsAppointments(appointment)
  }
}

async function apiRequestsAppointments(appointment) {
  try {
    const response = await axios.post(
      process.env.SERVER_APP_URL + '/appointments',
      {
        provider_id: IdData.providers[appointment.provider_id],
        client_id: IdData.clients[appointment.client_id],
        description: appointment.description,
      },
      auth,
    )
    IdData.appointments[appointment._id] = response.data._id
    console.log(response.data)
  } catch (e) {
    console.log(e)
  }
}

async function sendUpdateAppointmentsToServer(array) {
  for (const appointment of array) {
    await apiRequestsUpdateAppointments(appointment)
  }
}

async function apiRequestsUpdateAppointments(appointment) {
  try {
    const response = await axios.put(
      process.env.SERVER_APP_URL +
        `/appointments/${IdData.appointments[appointment._id]}`,
      {
        priority: appointment.priority,
        provider_id: IdData.providers[appointment.provider_id],
        description: appointment.description,
        notes: appointment.notes,
        conclusion: appointment.conclusion,
        date_end: appointment.date_end,
        language: appointment.language,
      },
      auth,
    )
    console.log(response.data)
  } catch (e) {
    console.log(e)
  }
}

async function sendRecordsToServer(array) {
  for (const record of array) {
    await apiRequestsRecordsAppointments(record)
  }
}

async function apiRequestsRecordsAppointments(record) {
  try {
    const formData = new FormData()
    const audioPath = path.resolve(__dirname, record.audio)
    const videoPath = path.resolve(__dirname, record.video)

    formData.append('audio', fs.createReadStream(audioPath))
    formData.append('video', fs.createReadStream(videoPath))

    const response = await axios.post(
      process.env.SERVER_APP_URL +
        `/appointments/${IdData.appointments[record._id]}/records`,
      formData,
      auth,
    )
    console.log(response.data)
  } catch (e) {
    console.log(e)
  }
}

async function initFunction() {
  await sendProvidersToServer(data.providers)
  await sendClientsToServer(data.clients)
  await sendAppointmentsToServer(data.appointments)
  await sendUpdateAppointmentsToServer(data.appointments)
  await sendRecordsToServer(data.records)
}
initFunction()
