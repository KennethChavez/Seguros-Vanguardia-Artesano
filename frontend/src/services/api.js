import axios from 'axios'

// Configurar la base URL de la API
const API_BASE_URL = 'http://localhost:3000/api/v1'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la API:', error)
    return Promise.reject(error)
  }
)

// Servicios para pólizas
export const polizasService = {
  // Obtener todas las pólizas
  async getAll(params = {}) {
    const response = await api.get('/polizas', { params })
    return response.data
  },

  // Obtener póliza por ID
  async getById(id) {
    const response = await api.get(`/polizas/${id}`)
    return response.data
  },

  // Buscar póliza por número
  async getByNumber(numeroPoliza) {
    const response = await api.get(`/polizas/numero/${numeroPoliza}`)
    return response.data
  },

  // Crear nueva póliza
  async create(polizaData) {
    const response = await api.post('/polizas', polizaData)
    return response.data
  },

  // Actualizar póliza
  async update(id, polizaData) {
    const response = await api.put(`/polizas/${id}`, polizaData)
    return response.data
  },

  // Cambiar estado de póliza
  async updateStatus(id, estado) {
    const response = await api.patch(`/polizas/${id}/estado`, { estado })
    return response.data
  },

  // Eliminar póliza
  async delete(id) {
    const response = await api.delete(`/polizas/${id}`)
    return response.data
  },

  // Obtener estadísticas
  async getStats() {
    const response = await api.get('/polizas/estadisticas/resumen')
    return response.data
  }
}

export default api