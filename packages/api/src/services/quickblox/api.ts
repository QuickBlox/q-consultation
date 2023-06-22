import axios from 'axios'
import QB from 'quickblox'

const qbApi = axios.create()

qbApi.interceptors.request.use((config) => {
  const {
    session,
    config: { endpoints },
  } = QB.service.qbInst
  const qbApiConfig = { ...config }

  qbApiConfig.baseURL = `https://${endpoints.api}`

  if (session?.token) {
    qbApiConfig.headers = {
      ...qbApiConfig.headers,
      'QB-Token': session.token,
    }
  }

  return qbApiConfig
})

export default qbApi
