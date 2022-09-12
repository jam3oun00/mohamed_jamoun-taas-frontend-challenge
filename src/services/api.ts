import axios from 'axios'

const accessToken = localStorage.getItem('accessToken')
const api = axios.create({
  baseURL: 'https://api.github.com'
})
if (accessToken) api.defaults.headers.common['Authorization'] = `bearer ${accessToken}`

export default api
