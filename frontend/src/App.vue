<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-warm-50 via-cream-50 to-primary-50">
    <!-- Navbar -->
    <nav class="bg-white/90 backdrop-blur-md shadow-lg border-b border-warm-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <div class="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-4">
                <h1 class="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Seguros el Artesano
                </h1>
                <p class="text-sm text-warm-600 font-medium">Sistema de Gestión</p>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <router-link 
              to="/" 
              class="text-warm-700 hover:text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary-50"
              :class="{ 'text-primary-600 bg-primary-50 shadow-sm': $route.name === 'dashboard' }"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0M8 5a2 2 0 012-2h2a2 2 0 012 2v0" />
              </svg>
              Dashboard
            </router-link>
            <router-link 
              to="/polizas" 
              class="text-warm-700 hover:text-primary-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-primary-50"
              :class="{ 'text-primary-600 bg-primary-50 shadow-sm': $route.name === 'polizas' }"
            >
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Pólizas
            </router-link>
            <router-link 
              to="/polizas/nueva" 
              class="btn btn-primary text-sm ml-4"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Póliza
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Notificaciones -->
    <div v-if="notification" class="fixed top-6 right-6 z-50">
      <div 
        :class="[
          'p-6 rounded-2xl shadow-2xl max-w-sm border-l-4 backdrop-blur-sm',
          notification.type === 'success' 
            ? 'bg-green-50/95 border-green-400 shadow-green-200' 
            : 'bg-red-50/95 border-red-400 shadow-red-200'
        ]"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <svg 
              v-if="notification.type === 'success'"
              class="h-6 w-6 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg 
              v-else
              class="h-6 w-6 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="ml-3">
            <p 
              :class="[
                'text-sm font-medium',
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              ]"
            >
              {{ notification.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, provide } from 'vue'

export default {
  name: 'App',
  setup() {
    const notification = ref(null)

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 5000)
    }

    // Proveer la función de notificación a todos los componentes hijos
    provide('showNotification', showNotification)

    return {
      notification
    }
  }
}
</script>