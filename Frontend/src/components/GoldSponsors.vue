<template>
  <div class="gold-sponsors-wrapper">
    <div class="container">
      <div v-if="isLoading" class="loading-state"></div>
      <div v-else-if="error" class="error-state"></div>
      <div v-else-if="goldSponsors.length === 0" class="empty-state"></div>

      <div v-else class="marquee-container">
        <div class="marquee-track" :style="{ animationDuration: animationDuration }">
          <a v-for="(sponsor, index) in duplicatedSponsors" :key="`${sponsor.id}-${index}`" :href="sponsor.redeSocial" target="_blank" rel="noopener noreferrer" class="sponsor-item" :title="`Visitar ${sponsor.nome}`">
            <img :src="getFullImageUrl(sponsor.logo)" :alt="`Logo de ${sponsor.nome}`" class="sponsor-logo" />
            <span class="sponsor-name">{{ sponsor.nome }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';

interface Sponsor { id: string; nome: string; logo: string; redeSocial: string; categoria: string; }

function getFullImageUrl(relativeUrl: string | undefined): string {
  if (!relativeUrl || relativeUrl.startsWith('http')) {
    return relativeUrl || '';
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl}${relativeUrl}`;
}

const goldSponsors = ref<Sponsor[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const duplicatedSponsors = computed(() => {
  if (goldSponsors.value.length > 0 && goldSponsors.value.length < 6) {
    return [...goldSponsors.value, ...goldSponsors.value, ...goldSponsors.value, ...goldSponsors.value];
  }
  return [...goldSponsors.value, ...goldSponsors.value];
});

const animationDuration = computed(() => {
  const count = goldSponsors.value.length;
  if (count === 0) return '0s';
  const duration = count * 12; 
  return `${Math.max(duration, 150)}s`; 
});

async function fetchSponsors() {
  isLoading.value = true;
  error.value = null;
  try {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/patrocinador`;
    const response = await api.get<Sponsor[]>(apiUrl);
    if (response.data && Array.isArray(response.data)) {
      goldSponsors.value = response.data.filter(sponsor => sponsor.categoria.toLowerCase() === 'ouro');
    } else {
      goldSponsors.value = [];
    }
  } catch (err) {
    error.value = "Não foi possível carregar os patrocinadores.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchSponsors);
</script>

<style scoped lang="scss">
$principal: #2C2966;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-claro: #E0E0E0;

.gold-sponsors-wrapper {
  // O padding geral da seção foi mantido para dar respiro
  padding: 4rem 1rem; 
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  text-align: center;
}

// O seletor .section-title foi removido daqui

.marquee-container {
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-track {
  display: flex;
  align-items: center;
  width: max-content;
  gap: 8rem;

  animation-name: scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.sponsor-item {
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  gap: 1.5rem;
  text-decoration: none;
}

.sponsor-logo {
  max-height: 100px;
  width: auto;
  max-width: 220px;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.4s ease;

  .sponsor-item:hover & {
    filter: grayscale(0%);
    opacity: 1;
    transform: translateY(-5px);
  }
}

.sponsor-name {
  font-size: 1rem;
  font-weight: 600;
  color: $cinza-claro;
  transition: color 0.4s ease;
  
  .sponsor-item:hover & {
    color: $destaque;
  }
}
</style>