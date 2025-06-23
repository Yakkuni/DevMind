<template>
  <div v-if="hasData" class="carousel-ticker-container">
    <div class="carousel-ticker-track" :style="{ animationDuration: animationDuration }">
      <template v-for="i in 2" :key="i">
        <div class="carousel-ticker-item" v-for="n in repetitions" :key="`item-${i}-${n}`" :aria-hidden="i > 1">
          <span class="ticker-text main-text">{{ textoIngressos }}</span>
          <span class="separator-arrow"></span>
          <span class="ticker-text accent-text">{{ dataDoEvento }}</span>
          <span class="separator-arrow"></span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue';
import api from '../../src/services/api';

// --- Interfaces e Props ---
interface CronogramaItem {
  id: string; nome: string; descricao: string;
  horario: string; local: string; tipo: string; conduzidoPor: string;
}
const props = defineProps({
  textoIngressos: { type: String, default: 'INGRESSOS – GRATUITOS' },
  repetitions: { type: Number, default: 5 },
  animationDuration: { type: String, default: '40s' }
});

// --- Estado Reativo ---
const dataDoEvento = ref<string>('');
const hasData = ref(false);

// --- LÓGICA DE BUSCA DE DADOS (COM A REGRA CORRETA) ---
async function fetchTickerData() {
  try {
    const response = await api.get<CronogramaItem[]>('/cronograma', {
      params: { timestamp: new Date().getTime() }
    });
    
    const todosOsEventos = response.data;

    // MUDANÇA: Verificamos se há QUALQUER evento na lista.
    if (!todosOsEventos || todosOsEventos.length === 0) {
      // Se não houver nenhum evento cadastrado, exibe "EM BREVE".
      dataDoEvento.value = 'EM BREVE';
      hasData.value = true;
      return; 
    }

    // MUDANÇA: Removemos o filtro de eventos futuros. Agora ordenamos TODOS os eventos.
    todosOsEventos.sort((a, b) => new Date(a.horario).getTime() - new Date(b.horario).getTime());
    
    // Pegamos o primeiro evento da lista (o que ocorre cronologicamente primeiro).
    const primeiroEvento = todosOsEventos[0];
    
    const dataObj = new Date(primeiroEvento.horario);
    const formatador = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'long', timeZone: 'UTC'
    });

    dataDoEvento.value = formatador.format(dataObj).toUpperCase();
    hasData.value = true;

  } catch (error) {
    console.error("Erro ao buscar dados do cronograma:", error);
    hasData.value = false;
  }
}

// --- Lógica de Comunicação entre Abas ---
const channel = new BroadcastChannel('cronograma_updates');

onMounted(() => {
  fetchTickerData();
  channel.onmessage = (event) => {
    if (event.data === 'updated') {
      fetchTickerData();
    }
  };
});

onBeforeUnmount(() => {
  channel.close();
});
</script>

<style scoped lang="scss">
/* --- Variáveis de Cor --- */
$principal: #2C2966;
$destaque: #FFA051;
$branco: #ffffff;

/* Estilos (sem alterações) */
.carousel-ticker-container {
  background-color: $destaque;
  border-top: 2px solid darken($destaque, 10%);
  border-bottom: 2px solid darken($destaque, 10%);
  box-shadow: inset 0 3px 8px #0000001a, inset 0 -3px 8px #0000001a;
  overflow: hidden;
  width: 100%;
  padding: 0.8rem 0;
  cursor: default;
  @media (max-width: 768px) {
    display: none;
  }
}
.carousel-ticker-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation-name: scroll-left;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  &:hover {
    animation-play-state: paused;
  }
}
.carousel-ticker-item {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.separator-arrow {
  width: 0; 
  height: 0; 
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 7px solid #2c296680;
  margin: 0 2rem;
}
.ticker-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: $principal;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  text-shadow: 1px 1px 2px #ffffff33;
  &.accent-text {
    font-weight: 700;
  }
}
@keyframes scroll-left {
  0% { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>