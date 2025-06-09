<template>
  <div v-if="hasData" class="carousel-ticker-container">
    <div class="carousel-ticker-track" :style="{ animationDuration: animationDuration }">
      <template v-for="i in 2" :key="i">
        <div class="carousel-ticker-item" v-for="n in repetitions" :key="`item-${i}-${n}`" :aria-hidden="i > 1">
          <span class="ticker-text main-text">{{ textoIngressos }}</span>
          <span class="separator-dot"></span>
          <span class="ticker-text accent-text">{{ dataDoEvento }}</span>
          <span class="separator-dot"></span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import api from '../../src/services/api';

const props = defineProps({
  textoIngressos: { type: String, default: 'INGRESSOS – GRATUITOS' },
  repetitions: { type: Number, default: 5 },
  animationDuration: { type: String, default: '40s' }
});

const dataDoEvento = ref<string>('');
const hasData = ref(false);

async function fetchTickerData() {
  try {
    const response = await api.get<{ textoData: string }>('/api/configuracoes/ticker');
    if (response.data && response.data.textoData) {
      dataDoEvento.value = response.data.textoData;
      hasData.value = true;
    } else {
      hasData.value = false;
    }
  } catch (error) {
    hasData.value = false;
  }
}

onMounted(fetchTickerData);
</script>

<style scoped lang="scss">
$principal: #2C2966;
$destaque: #FFA051;
$branco: #ffffff;

.carousel-ticker-container{background-color:$destaque;border-top:2px solid darken($destaque,10%);border-bottom:2px solid darken($destaque,10%);box-shadow:inset 0 3px 8px #0000001a,inset 0 -3px 8px #0000001a;overflow:hidden;width:100%;padding:.8rem 0;cursor:default;@media (max-width:768px){display:none}}.carousel-ticker-track{display:flex;align-items:center;white-space:nowrap;animation-name:scroll-left;animation-timing-function:linear;animation-iteration-count:infinite;&:hover{animation-play-state:paused}}.carousel-ticker-item{display:inline-flex;align-items:center;flex-shrink:0;margin-right:2rem}.separator-dot{width:6px;height:6px;background-color:#2c296680;border-radius:50%;margin:0 2rem}.ticker-text{font-size:1.1rem;font-weight:600;color:$principal;text-transform:uppercase;letter-spacing:.8px;text-shadow:1px 1px 2px #ffffff33;&.accent-text{font-weight:700}}@keyframes scroll-left{0%{transform:translateX(0)}to{transform:translateX(-50%)}}
</style>