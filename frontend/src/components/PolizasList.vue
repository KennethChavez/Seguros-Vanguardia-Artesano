<template>
  <div class="space-y-6">
    <!-- Encabezado -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Gestión de Pólizas</h1>
      <router-link to="/polizas/nueva" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nueva Póliza
      </router-link>
    </div>

    <!-- Filtros -->
    <div class="card">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Seguro</label>
            <select v-model="filters.tipo" @change="loadPolizas" class="form-select">
              <option value="">Todos</option>
              <option value="Auto">Auto</option>
              <option value="Vida">Vida</option>
              <option value="Hogar">Hogar</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="filters.estado" @change="loadPolizas" class="form-select">
              <option value="">Todos</option>
              <option value="Activa">Activa</option>
              <option value="Suspendida">Suspendida</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Registros por página</label>
            <select v-model="filters.limit" @change="loadPolizas" class="form-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input 
              v-model="searchQuery" 
              @input="handleSearch"
              type="text" 
              placeholder="Buscar por número o titular..." 
              class="form-input"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de pólizas -->
    <div class="card">
      <div class="card-header">
        <h3 class="text-lg font-medium text-gray-900">
          Lista de Pólizas 
          <span class="text-sm font-normal text-gray-500">
            ({{ pagination.totalRecords }} registros)
          </span>
        </h3>
      </div>
      
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-600">Cargando pólizas...</p>
        </div>
        
        <div v-else-if="polizas.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay pólizas</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza creando una nueva póliza.</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Póliza</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="poliza in polizas" :key="poliza._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ poliza.numeroPoliza }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ poliza.TipoSeguro }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ poliza.Titular }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 font-medium">L. {{ formatNumber(poliza.monto) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="badge"
                    :class="getBadgeClass(poliza.estado)"
                  >
                    {{ poliza.estado }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(poliza.fechaCreacion) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <router-link 
                      :to="`/polizas/${poliza._id}`"
                      class="text-primary-600 hover:text-primary-900 text-sm"
                    >
                      Ver
                    </router-link>
                    <router-link 
                      :to="`/polizas/${poliza._id}/editar`"
                      class="text-yellow-600 hover:text-yellow-900 text-sm"
                    >
                      Editar
                    </router-link>
                    <button 
                      @click="confirmarEliminacion(poliza)"
                      class="text-red-600 hover:text-red-900 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="pagination.totalPages > 1" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Mostrando 
        <span class="font-medium">{{ (pagination.currentPage - 1) * filters.limit + 1 }}</span>
        a 
        <span class="font-medium">{{ Math.min(pagination.currentPage * filters.limit, pagination.totalRecords) }}</span>
        de 
        <span class="font-medium">{{ pagination.totalRecords }}</span>
        resultados
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="changePage(pagination.currentPage - 1)"
          :disabled="!pagination.hasPrev"
          class="btn btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasPrev }"
        >
          Anterior
        </button>
        
        <button 
          v-for="page in getVisiblePages()"
          :key="page"
          @click="changePage(page)"
          class="btn"
          :class="page === pagination.currentPage ? 'btn-primary' : 'btn-secondary'"
        >
          {{ page }}
        </button>
        
        <button 
          @click="changePage(pagination.currentPage + 1)"
          :disabled="!pagination.hasNext"
          class="btn btn-secondary"
          :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasNext }"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <svg class="mx-auto mb-4 w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              ¿Estás seguro de que quieres eliminar la póliza 
              <strong>{{ polizaAEliminar?.numeroPoliza }}</strong>?
              Esta acción no se puede deshacer.
            </p>
          </div>
          <div class="flex justify-center space-x-4 mt-4">
            <button @click="cancelarEliminacion" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="eliminarPoliza" class="btn btn-danger" :disabled="deleting">
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject, watch } from 'vue'
import { polizasService } from '../services/api'

export default {
  name: 'PolizasList',
  setup() {
    const loading = ref(false)
    const deleting = ref(false)
    const polizas = ref([])
    const pagination = ref({})
    const showDeleteModal = ref(false)
    const polizaAEliminar = ref(null)
    const searchQuery = ref('')
    const showNotification = inject('showNotification')

    const filters = ref({
      tipo: '',
      estado: '',
      limit: 10,
      page: 1
    })

    const loadPolizas = async () => {
      try {
        loading.value = true
        const response = await polizasService.getAll(filters.value)
        
        if (response.success) {
          polizas.value = response.data.polizas
          pagination.value = response.data.pagination
        }
      } catch (error) {
        console.error('Error al cargar pólizas:', error)
        showNotification('Error al cargar las pólizas', 'error')
      } finally {
        loading.value = false
      }
    }

    const changePage = (page) => {
      filters.value.page = page
      loadPolizas()
    }

    const getVisiblePages = () => {
      const current = pagination.value.currentPage
      const total = pagination.value.totalPages
      const pages = []
      
      let start = Math.max(1, current - 2)
      let end = Math.min(total, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }

    const handleSearch = () => {
      // Implementar búsqueda en el futuro
      console.log('Buscar:', searchQuery.value)
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat('es-ES').format(num)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('es-ES')
    }

    const getBadgeClass = (estado) => {
      const classes = {
        'Activa': 'badge-success',
        'Suspendida': 'badge-warning',
        'Cancelada': 'badge-danger'
      }
      return classes[estado] || 'badge-secondary'
    }

    const confirmarEliminacion = (poliza) => {
      polizaAEliminar.value = poliza
      showDeleteModal.value = true
    }

    const cancelarEliminacion = () => {
      polizaAEliminar.value = null
      showDeleteModal.value = false
    }

    const eliminarPoliza = async () => {
      try {
        deleting.value = true
        const response = await polizasService.delete(polizaAEliminar.value._id)
        
        if (response.success) {
          showNotification('Póliza eliminada exitosamente')
          cancelarEliminacion()
          loadPolizas()
        }
      } catch (error) {
        console.error('Error al eliminar póliza:', error)
        showNotification('Error al eliminar la póliza', 'error')
      } finally {
        deleting.value = false
      }
    }

    // Watchers para recargar cuando cambien los filtros
    watch(() => filters.value.tipo, () => {
      filters.value.page = 1
    })

    watch(() => filters.value.estado, () => {
      filters.value.page = 1
    })

    onMounted(() => {
      loadPolizas()
    })

    return {
      loading,
      deleting,
      polizas,
      pagination,
      filters,
      searchQuery,
      showDeleteModal,
      polizaAEliminar,
      loadPolizas,
      changePage,
      getVisiblePages,
      handleSearch,
      formatNumber,
      formatDate,
      getBadgeClass,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarPoliza
    }
  }
}
</script>