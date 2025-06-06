import axios from 'axios'
import config from '../config'

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const saveMilkingSession = async (sessionData) => {
  try {
    const response = await api.post(config.API_ENDPOINTS.SESSIONS, sessionData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save milking session')
  }
}

export const fetchMilkingSessions = async () => {
  try {
    const response = await api.get(config.API_ENDPOINTS.SESSIONS)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch milking sessions')
  }
}

export default api