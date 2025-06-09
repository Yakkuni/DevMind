<template>
  <div class="gold-sponsors-wrapper">
    <div class="container">
      <h2 class="section-title">Nossos Parceiros Ouro</h2>
      <p class="section-subtitle">Agradecemos o apoio fundamental que torna nosso evento possível.</p>
      
      <div v-if="isLoading" class="loading-state"></div>
      <div v-else-if="error" class="error-state"></div>
      <div v-else-if="goldSponsors.length === 0" class="empty-state"></div>

      <div v-else class="marquee-container">
        <div class="marquee-track" :style="{ animationDuration: animationDuration }">
          <a v-for="(sponsor, index) in duplicatedSponsors" :key="`${sponsor.id}-${index}`" :href="sponsor.redeSocial" target="_blank" rel="noopener noreferrer" class="sponsor-item" :title="`Visitar ${sponsor.nome}`">
            <img :src="getFullImageUrl(sponsor.logo)" :alt="`Logo de ${sponsor.nome}`" class="sponsor-logo" />
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
function getFullImageUrl(relativeUrl: string | undefined): string { if (!relativeUrl || relativeUrl.startsWith('http')) { return relativeUrl || ''; } const baseUrl = import.meta.env.VITE_API_BASE_URL; return `${baseUrl}${relativeUrl}`; }
const goldSponsors = ref<Sponsor[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const duplicatedSponsors = computed(() => { if (goldSponsors.value.length > 0 && goldSponsors.value.length < 6) { return [...goldSponsors.value, ...goldSponsors.value, ...goldSponsors.value, ...goldSponsors.value]; } return [...goldSponsors.value, ...goldSponsors.value]; });
const animationDuration = computed(() => { const count = goldSponsors.value.length; if (count === 0) return '0s'; const duration = count * 6; return `${Math.max(duration, 40)}s`; });
async function fetchSponsors() { isLoading.value = true; error.value = null; try { const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/patrocinador`; const response = await api.get<Sponsor[]>(apiUrl); if (response.data && Array.isArray(response.data)) { goldSponsors.value = response.data.filter(sponsor => sponsor.categoria.toLowerCase() === 'ouro'); } else { goldSponsors.value = []; } } catch (err) { error.value = "Não foi possível carregar os patrocinadores."; } finally { isLoading.value = false; } }
onMounted(fetchSponsors);
</script>

<style scoped lang="scss">
$principal: #2C2966;
$destaque: #FFA051;
$branco: #ffffff;

.gold-sponsors-wrapper {
  padding: 5rem 1rem;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0;
  color: $branco;
  text-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.1rem);
  color: lighten($principal, 50%);
  margin-top: 0.5rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.marquee-container {
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
.marquee-track {
  display: flex;
  align-items: center;
  width: max-content;
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
  align-items: center;
  justify-content: center;
  padding: 0 4rem;
  flex-shrink: 0;
}
.sponsor-logo {
  max-height: 90px;
  width: auto;
  max-width: 220px;
  filter: none;
  opacity: 0.8;
  transition: all 0.4s ease;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}
</style>