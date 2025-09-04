import axios from 'axios'


const api = axios.create({
baseURL: import.meta.env.VITE_API_URL?.replace(/\/$/, '') + '/api',
timeout: 10000,
})


// attach token if present
api.interceptors.request.use((config) => {
const token = localStorage.getItem('token')
if (token) config.headers.Authorization = `Bearer ${token}`
return config
})


// basic error normalization
api.interceptors.response.use(
(res) => res,
(err) => {
const message = err?.response?.data?.message || err.message || 'Request failed'
return Promise.reject(new Error(message))
}
)


export default api