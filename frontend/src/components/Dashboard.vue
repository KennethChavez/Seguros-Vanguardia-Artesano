<template>
  <div class="space-y-8">
    <!-- Encabezado con gradiente cálido -->
    <div class="bg-gradient-to-r from-primary-500 via-primary-600 to-warm-500 rounded-3xl p-8 text-white shadow-2xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold font-display mb-3">Dashboard - Seguros el Artesano</h1>
          <p class="text-primary-100 text-lg">Resumen general del sistema de gestión de pólizas</p>
        </div>
        <div class="hidden md:block">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadísticas principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card hover-lift">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-warm-600 truncate">Total Pólizas</dt>
                <dd class="text-2xl font-bold text-warm-900">{{ stats.totalPolizas }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-warm-600 truncate">Monto Total</dt>
                <dd class="text-2xl font-bold text-warm-900">L. {{ stats.montoTotal.toLocaleString('es-HN') }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-warm-600 truncate">Promedio</dt>
                <dd class="text-2xl font-bold text-warm-900">${{ formatNumber(stats.montoPromedio) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="card hover-lift">
        <div class="card-body">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-warm-600 truncate">Máximo</dt>
                <dd class="text-2xl font-bold text-warm-900">${{ formatNumber(stats.montoMaximo) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y tablas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Distribución por tipo de seguro -->
      <div class="card hover-lift">
        <div class="card-header">
          <h3 class="text-xl font-semibold font-display text-warm-900">Distribución por Tipo de Seguro</h3>
        </div>
        <div class="card-body">
          <div class="space-y-6">
            <div v-for="tipo in estadisticasPorTipo" :key="tipo._id" class="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
              <div class="flex items-center">
                <div class="w-4 h-4 rounded-full mr-4" :class="getColorForTipo(tipo._id)"></div>
                <span class="text-base font-medium text-warm-800">{{ tipo._id }}</span>
              </div>
              <div class="text-right">
                <div class="text-base font-semibold text-warm-900">{{ tipo.cantidad }} pólizas</div>
                <div class="text-sm text-warm-600">${{ formatNumber(tipo.montoTotal) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de pólizas -->
      <div class="card hover-lift">
        <div class="card-header">
          <h3 class="text-xl font-semibold font-display text-warm-900">Estado de Pólizas</h3>
        </div>
        <div class="card-body">
          <div class="space-y-6">
            <div v-for="estado in estadisticasPorEstado" :key="estado._id" class="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
              <div class="flex items-center">
                <span 
                  class="badge text-sm font-medium"
                  :class="getBadgeClass(estado._id)"
                >
                  {{ estado._id }}
                </span>
              </div>
              <div class="text-base font-semibold text-warm-900">{{ estado.cantidad }} pólizas</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="card hover-lift">
      <div class="card-header">
        <h3 class="text-xl font-semibold font-display text-warm-900">Acciones Rápidas</h3>
      </div>
      <div class="card-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link to="/polizas/nueva" class="btn btn-primary text-center hover-lift">
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nueva Póliza
          </router-link>
          
          <router-link to="/polizas" class="btn btn-secondary text-center hover-lift">
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Ver Todas las Pólizas
          </router-link>
          
          <button @click="refreshStats" class="btn btn-secondary text-center hover-lift" :disabled="loading">
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ loading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, inject } from 'vue'
import { polizasService } from '../services/api'

export default {
  name: 'Dashboard',
  setup() {
    const loading = ref(false)
    const stats = ref({})
    const estadisticasPorTipo = ref([])
    const estadisticasPorEstado = ref([])
    const showNotification = inject('showNotification')

    const loadStats = async () => {
      try {
        loading.value = true
        const response = await polizasService.getStats()
        
        if (response.success) {
          stats.value = response.data.resumenGeneral
          estadisticasPorTipo.value = response.data.porTipoSeguro
          estadisticasPorEstado.value = response.data.porEstado
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        showNotification('Error al cargar las estadísticas', 'error')
      } finally {
        loading.value = false
      }
    }

    const refreshStats = () => {
      loadStats()
      showNotification('Estadísticas actualizadas correctamente')
    }

    const formatNumber = (num) => {
      if (!num) return '0'
      return new Intl.NumberFormat('es-ES').format(num)
    }

    const getColorForTipo = (tipo) => {
      const colors = {
        'Auto': 'bg-blue-500',
        'Vida': 'bg-green-500',
        'Hogar': 'bg-yellow-500',
        'Salud': 'bg-red-500'
      }
      return colors[tipo] || 'bg-warm-500'
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
      loadStats()
    })

    return {
      loading,
      stats,
      estadisticasPorTipo,
      estadisticasPorEstado,
      refreshStats,
      formatNumber,
      getColorForTipo,
      getBadgeClass
    }
  }
}
</script>