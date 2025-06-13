import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Importar componentes
import Dashboard from './components/Dashboard.vue'
import PolizasList from './components/PolizasList.vue'
import PolizaForm from './components/PolizaForm.vue'
import PolizaDetail from './components/PolizaDetail.vue'

// Configurar rutas
const routes = [
  { path: '/', component: Dashboard, name: 'dashboard' },
  { path: '/polizas', component: PolizasList, name: 'polizas' },
  { path: '/polizas/nueva', component: PolizaForm, name: 'nueva-poliza' },
  { path: '/polizas/:id', component: PolizaDetail, name: 'detalle-poliza' },
  { path: '/polizas/:id/editar', component: PolizaForm, name: 'editar-poliza' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')