<template>
  <div class="max-w-4xl mx-auto">
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Detalle de Póliza</h1>
        <div class="flex space-x-3">
          <router-link to="/polizas" class="btn btn-secondary">
            Volver a la lista
          </router-link>
          <router-link 
            :to="`/polizas/${poliza._id}/editar`" 
            class="btn btn-primary"
            v-if="poliza._id"
          >
            Editar
          </router-link>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <p class="mt-2 text-gray-600">Cargando información de la póliza...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="mt-2 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Información principal -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Información de la Póliza</h3>
            </div>
            <div class="card-body">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Número de Póliza</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                    {{ poliza.numeroPoliza }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tipo de Seguro</dt>
                  <dd class="mt-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ poliza.TipoSeguro }}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Titular</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ poliza.Titular }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Monto</dt>
                  <dd class="mt-1 text-lg font-semibold text-gray-900">
                    L. {{ poliza.monto.toLocaleString('es-HN') }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Estado</dt>
                  <dd class="mt-1">
                    <span 
                      class="badge"
                      :class="getBadgeClass(poliza.estado)"
                    >
                      {{ poliza.estado }}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(poliza.fechaCreacion) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Última Actualización</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(poliza.fechaActualizacion) }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="space-y-6">
          <!-- Acciones rápidas -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Acciones</h3>
            </div>
            <div class="card-body">
              <div class="space-y-3">
                <router-link 
                  :to="`/polizas/${poliza._id}/editar`"
                  class="btn btn-primary w-full"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Póliza
                </router-link>
                
                <div class="relative">
                  <button 
                    @click="showStatusMenu = !showStatusMenu"
                    class="btn btn-secondary w-full"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Cambiar Estado
                  </button>
                  
                  <div v-if="showStatusMenu" class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button 
                      v-for="estado in estadosDisponibles"
                      :key="estado"
                      @click="cambiarEstado(estado)"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      :class="{ 'bg-gray-50': estado === poliza.estado }"
                    >
                      {{ estado }}
                    </button>
                  </div>
                </div>
                
                <button 
                  @click="confirmarEliminacion"
                  class="btn btn-danger w-full"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Póliza
                </button>
              </div>
            </div>
          </div>

          <!-- Información adicional -->
          <div class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium text-gray-900">Información Técnica</h3>
            </div>
            <div class="card-body">
              <dl class="space-y-3">
                <div>
                  <dt class="text-sm font-medium text-gray-500">ID del Sistema</dt>
                  <dd class="mt-1 text-xs text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded break-all">
                    {{ poliza._id }}
                  </dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Creado</dt>
                  <dd class="mt-1 text-xs text-gray-900">{{ formatDateTime(poliza.createdAt) }}</dd>
                </div>
                
                <div>
                  <dt class="text-sm font-medium text-gray-500">Actualizado</dt>
                  <dd class="mt-1 text-xs text-gray-900">{{ formatDateTime(poliza.updatedAt) }}</dd>
                </div>
              </dl>
            </div>
          </div>
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
                <strong>{{ poliza.numeroPoliza }}</strong>?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div class="flex justify-center space-x-4 mt-4">
              <button @click="showDeleteModal = false" class="btn btn-secondary">
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
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { polizasService } from '../services/api'

export default {
  name: 'PolizaDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const showNotification = inject('showNotification')
    
    const loading = ref(false)
    const deleting = ref(false)
    const error = ref('')
    const poliza = ref({})
    const showDeleteModal = ref(false)
    const showStatusMenu = ref(false)
    
    const estadosDisponibles = ['Activa', 'Suspendida', 'Cancelada']

    const loadPoliza = async () => {
      try {
        loading.value = true
        error.value = ''
        
        const response = await polizasService.getById(route.params.id)
        
        if (response.success) {
          poliza.value = response.data
        }
      } catch (err) {
        console.error('Error al cargar póliza:', err)
        if (err.response?.status === 404) {
          error.value = 'Póliza no encontrada'
        } else {
          error.value = 'Error al cargar la información de la póliza'
        }
      } finally {
        loading.value = false
      }
    }

    const cambiarEstado = async (nuevoEstado) => {
      try {
        showStatusMenu.value = false
        
        const response = await polizasService.updateStatus(poliza.value._id, nuevoEstado)
        
        if (response.success) {
          poliza.value.estado = nuevoEstado
          poliza.value.fechaActualizacion = new Date().toISOString()
          showNotification(`Estado cambiado a '${nuevoEstado}' exitosamente`)
        }
      } catch (error) {
        console.error('Error al cambiar estado:', error)
        showNotification('Error al cambiar el estado de la póliza', 'error')
      }
    }

    const confirmarEliminacion = () => {
      showDeleteModal.value = true
    }

    const eliminarPoliza = async () => {
      try {
        deleting.value = true
        
        const response = await polizasService.delete(poliza.value._id)
        
        if (response.success) {
          showNotification('Póliza eliminada exitosamente')
          router.push('/polizas')
        }
      } catch (error) {
        console.error('Error al eliminar póliza:', error)
        showNotification('Error al eliminar la póliza', 'error')
      } finally {
        deleting.value = false
        showDeleteModal.value = false
      }
    }

    const formatNumber = (num) => {
      return new Intl.NumberFormat('es-ES').format(num)
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-HN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('es-ES')
    }

    const getBadgeClass = (estado) => {
      const classes = {
        'Activa': 'badge-success',
        'Suspendida': 'badge-warning',
        'Cancelada': 'badge-danger'
      }
      return classes[estado] || 'badge-secondary'
    }

    onMounted(() => {
      loadPoliza()
    })

    return {
      loading,
      deleting,
      error,
      poliza,
      showDeleteModal,
      showStatusMenu,
      estadosDisponibles,
      cambiarEstado,
      confirmarEliminacion,
      eliminarPoliza,
      formatNumber,
      formatDate,
      formatDateTime,
      getBadgeClass
    }
  }
}
</script>