<template>
  <div class="max-w-2xl mx-auto">
    <div class="space-y-6">
      <!-- Encabezado -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Póliza' : 'Nueva Póliza' }}
        </h1>
        <router-link to="/polizas" class="btn btn-secondary">
          Volver a la lista
        </router-link>
      </div>

      <!-- Formulario -->
      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Número de Póliza -->
            <div>
              <label for="numeroPoliza" class="block text-sm font-medium text-gray-700 mb-1">
                Número de Póliza *
              </label>
              <input
                id="numeroPoliza"
                v-model="poliza.numeroPoliza"
                type="text"
                placeholder="Ej: POL-001"
                class="form-input"
                :class="{ 'border-red-500': errors.numeroPoliza }"
                @blur="validateField('numeroPoliza')"
                @input="poliza.numeroPoliza = $event.target.value.toUpperCase()"
              >
              <p v-if="errors.numeroPoliza" class="mt-1 text-sm text-red-600">
                {{ errors.numeroPoliza }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Solo letras mayúsculas, números y guiones. Ejemplo: POL-001
              </p>
            </div>

            <!-- Tipo de Seguro -->
            <div>
              <label for="tipoSeguro" class="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Seguro *
              </label>
              <select
                id="tipoSeguro"
                v-model="poliza.TipoSeguro"
                class="form-select"
                :class="{ 'border-red-500': errors.TipoSeguro }"
                @blur="validateField('TipoSeguro')"
              >
                <option value="">Seleccione un tipo</option>
                <option value="Auto">Auto</option>
                <option value="Vida">Vida</option>
                <option value="Hogar">Hogar</option>
                <option value="Salud">Salud</option>
              </select>
              <p v-if="errors.TipoSeguro" class="mt-1 text-sm text-red-600">
                {{ errors.TipoSeguro }}
              </p>
            </div>

            <!-- Titular -->
            <div>
              <label for="titular" class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Titular *
              </label>
              <input
                id="titular"
                v-model="poliza.Titular"
                type="text"
                placeholder="Nombre completo del titular"
                class="form-input"
                :class="{ 'border-red-500': errors.Titular }"
                @blur="validateField('Titular')"
              >
              <p v-if="errors.Titular" class="mt-1 text-sm text-red-600">
                {{ errors.Titular }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Solo letras y espacios. Entre 2 y 100 caracteres.
              </p>
            </div>

            <!-- Monto -->
            <div>
              <label for="monto" class="block text-sm font-medium text-gray-700 mb-1">
                Monto (Lempiras) *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">L.</span>
                <input
                  id="monto"
                  v-model="poliza.monto"
                  type="number"
                  step="0.01"
                  min="1"
                  max="250000000"
                  placeholder="0.00"
                  class="form-input pl-8"
                  :class="{ 'border-red-500': errors.monto }"
                  @blur="validateField('monto')"
                >
              </div>
              <p v-if="errors.monto" class="mt-1 text-sm text-red-600">
                {{ errors.monto }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                Monto entre L. 1 y L. 250,000,000
              </p>
            </div>

            <!-- Estado (solo en edición) -->
            <div v-if="isEditing">
              <label for="estado" class="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                v-model="poliza.estado"
                class="form-select"
                :class="{ 'border-red-500': errors.estado }"
              >
                <option value="Activa">Activa</option>
                <option value="Suspendida">Suspendida</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              <p v-if="errors.estado" class="mt-1 text-sm text-red-600">
                {{ errors.estado }}
              </p>
            </div>

            <!-- Errores generales -->
            <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-4">
              <div class="flex">
                <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error al procesar la póliza</h3>
                  <p class="mt-2 text-sm text-red-700">{{ generalError }}</p>
                </div>
              </div>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-4 pt-4">
              <router-link to="/polizas" class="btn btn-secondary">
                Cancelar
              </router-link>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="loading || !isFormValid"
              >
                {{ loading ? 'Procesando...' : (isEditing ? 'Actualizar Póliza' : 'Crear Póliza') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { polizasService } from '../services/api'

export default {
  name: 'PolizaForm',
  props: {
    isEditing: {
      type: Boolean,
      default: false
    },
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const showNotification = inject('showNotification')
    
    const loading = ref(false)
    const generalError = ref('')
    const isEditing = computed(() => !!route.params.id)
    
    const poliza = ref({
      numeroPoliza: '',
      TipoSeguro: '',
      Titular: '',
      monto: '',
      estado: 'Activa',
      ...props.initialData
    })

    const errors = ref({})

    const validationRules = {
      numeroPoliza: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[A-Z0-9\-]+$/,
        message: 'El número de póliza debe tener entre 3 y 20 caracteres y solo contener letras mayúsculas, números y guiones'
      },
      TipoSeguro: {
        required: true,
        options: ['Auto', 'Vida', 'Hogar', 'Salud'],
        message: 'Debe seleccionar un tipo de seguro válido'
      },
      Titular: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/,
        message: 'El nombre del titular debe tener entre 2 y 100 caracteres y solo contener letras y espacios'
      },
      monto: {
        required: true,
        min: 1,
        max: 250000000,
        message: 'El monto debe estar entre L. 1 y L. 250,000,000'
      }
    }

    const validateField = (fieldName) => {
      const value = poliza.value[fieldName]
      const rules = validationRules[fieldName]
      
      if (!rules) return true

      // Validar requerido
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.value[fieldName] = `${fieldName} es obligatorio`
        return false
      }

      // Validar longitud mínima
      if (rules.minLength && value.toString().length < rules.minLength) {
        errors.value[fieldName] = rules.message
        return false
      }

      // Validar longitud máxima
      if (rules.maxLength && value.toString().length > rules.maxLength) {
        errors.value[fieldName] = rules.message
        return false
      }

      // Validar patrón
      if (rules.pattern && !rules.pattern.test(value.toString())) {
        errors.value[fieldName] = rules.message
        return false
      }

      // Validar opciones
      if (rules.options && !rules.options.includes(value)) {
        errors.value[fieldName] = rules.message
        return false
      }

      // Validar rango numérico
      if (rules.min !== undefined && parseFloat(value) < rules.min) {
        errors.value[fieldName] = rules.message
        return false
      }

      if (rules.max !== undefined && parseFloat(value) > rules.max) {
        errors.value[fieldName] = rules.message
        return false
      }

      // Si pasa todas las validaciones, limpiar el error
      delete errors.value[fieldName]
      return true
    }

    const validateForm = () => {
      let isValid = true
      Object.keys(validationRules).forEach(field => {
        if (!validateField(field)) {
          isValid = false
        }
      })
      return isValid
    }

    const isFormValid = computed(() => {
      return Object.keys(errors.value).length === 0 && 
             poliza.value.numeroPoliza && 
             poliza.value.TipoSeguro && 
             poliza.value.Titular && 
             poliza.value.monto
    })

    const loadPoliza = async () => {
      if (!isEditing.value) return

      try {
        loading.value = true
        const response = await polizasService.getById(route.params.id)
        
        if (response.success) {
          const poliza = response.data
          poliza.value = {
            numeroPoliza: poliza.numeroPoliza,
            TipoSeguro: poliza.TipoSeguro,
            Titular: poliza.Titular,
            monto: poliza.monto,
            estado: poliza.estado
          }
        }
      } catch (error) {
        console.error('Error al cargar póliza:', error)
        showNotification('Error al cargar la póliza', 'error')
        router.push('/polizas')
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      generalError.value = ''
      
      if (!validateForm()) {
        generalError.value = 'Por favor, corrige los errores en el formulario'
        return
      }

      try {
        loading.value = true
        
        const polizaData = {
          numeroPoliza: poliza.value.numeroPoliza.trim().toUpperCase(),
          TipoSeguro: poliza.value.TipoSeguro,
          Titular: poliza.value.Titular.trim(),
          monto: parseFloat(poliza.value.monto)
        }

        let response
        if (isEditing.value) {
          response = await polizasService.update(route.params.id, polizaData)
          
          // Si cambió el estado, hacer una llamada adicional
          if (poliza.value.estado !== 'Activa') {
            await polizasService.updateStatus(route.params.id, poliza.value.estado)
          }
        } else {
          response = await polizasService.create(polizaData)
        }

        if (response.success) {
          showNotification(
            isEditing.value ? 'Póliza actualizada exitosamente' : 'Póliza creada exitosamente'
          )
          router.push('/polizas')
        }
      } catch (error) {
        console.error('Error al procesar póliza:', error)
        
        if (error.response?.data?.errors) {
          // Manejar errores de validación del servidor
          error.response.data.errors.forEach(err => {
            errors.value[err.field] = err.message
          })
        } else if (error.response?.data?.message) {
          generalError.value = error.response.data.message
        } else {
          generalError.value = 'Error al procesar la póliza. Inténtalo de nuevo.'
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (isEditing.value) {
        loadPoliza()
      }
    })

    return {
      loading,
      generalError,
      isEditing,
      poliza,
      errors,
      isFormValid,
      validateField,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-2 border border-warm-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200;
}

.form-select {
  @apply w-full px-4 py-2 border border-warm-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200;
}

.btn {
  @apply px-6 py-2 rounded-xl font-medium transition-all duration-200;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-warm-100 text-warm-700 hover:bg-warm-200 focus:ring-2 focus:ring-warm-500 focus:ring-offset-2;
}
</style>