import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importa Vuetify e estilos
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// Cria instância do Vuetify
const vuetify = createVuetify({
  // Configurações e personalizações aqui
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
