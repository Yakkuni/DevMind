<template>
  <div class="page-container">

    <section class="sponsors-section">
      <div class="sponsors-container">
        <h2 class="section-title">Nossos Parceiros</h2>
        <p class="section-subtitle">
          Agradecemos a todos os patrocinadores que tornam o DevMind possível e ajudam a impulsionar a comunidade de tecnologia.
        </p>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Carregando patrocinadores...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button class="btn btn-primary" @click="fetchSponsors">Tentar Novamente</button>
        </div>
        
        <template v-else-if="sponsors.length > 0">
          <div
            class="sponsor-category"
            v-for="(categorySponsors, categoryName) in categorizedSponsors"
            :key="categoryName"
            :class="`category-wrapper-${String(categoryName).toLowerCase()}`"
            v-show="categorySponsors.length > 0"
          >
            <h3 class="category-title">{{ categoryName }}</h3>
            <div class="sponsor-logos-grid" :class="`category-grid-${String(categoryName).toLowerCase()}`">
              <a
                v-for="sponsor in categorySponsors"
                :key="sponsor.id"
                :href="sponsor.link"
                class="sponsor-logo-card"
                target="_blank"
                rel="noopener noreferrer"
                :title="`Visitar ${sponsor.name}`"
              >
                <div class="logo-background">
                  <img :src="sponsor.logoUrl" :alt="`Logo ${sponsor.name}`" class="sponsor-image" />
                </div>
              </a>
            </div>
          </div>
        </template>
        
        <div v-else class="empty-state">
          <p>Ainda não temos patrocinadores para esta edição. Fique de olho para novidades!</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../services/api'; 

// Interface que define como o nosso componente QUER ver os dados
interface Sponsor {
  id: string | number;
  name: string;
  logoUrl: string;
  link: string;
  category: 'Ouro' | 'Prata' | 'Bronze' | 'Apoio';
}

// Interface que representa os dados como eles VÊM da sua API
interface SponsorFromAPI {
  id: string | number;
  nome: string;
  logo: string;
  categoria: string;
  redeSocial: string;
}

const sponsors = ref<Sponsor[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

function capitalizeFirstLetter(str: string): string {
  if (!str) return 'Apoio';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchSponsors() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get<SponsorFromAPI[]>('/patrocinador');
    
    if (Array.isArray(response.data)) {
      sponsors.value = response.data.map(apiSponsor => {
        return {
          id: apiSponsor.id,
          name: apiSponsor.nome,
          logoUrl: apiSponsor.logo,
          link: apiSponsor.redeSocial,
          category: capitalizeFirstLetter(apiSponsor.categoria) as Sponsor['category'],
        };
      });
    } else {
      console.warn("A API /patrocinador não retornou um array esperado:", response.data);
      sponsors.value = [];
    }
  } catch (err) {
    console.error("Erro ao carregar patrocinadores:", err);
    error.value = "Não foi possível carregar a lista de patrocinadores. Por favor, tente novamente mais tarde.";
    sponsors.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchSponsors();
});

const categorizedSponsors = computed(() => {
  const categoryOrder: Sponsor['category'][] = ['Ouro', 'Prata', 'Bronze', 'Apoio'];
  const categories: { [key: string]: Sponsor[] } = {};

  categoryOrder.forEach(cat => {
    categories[cat] = [];
  });

  sponsors.value.forEach((sponsor) => {
    const categoryKey = sponsor.category || 'Apoio';
    if (categories[categoryKey]) {
      categories[categoryKey].push(sponsor);
    }
  });
  
  const filteredCategories: { [key: string]: Sponsor[] } = {};
  for (const category of categoryOrder) {
    if (categories[category] && categories[category].length > 0) {
      filteredCategories[category] = categories[category];
    }
  }
  return filteredCategories;
});
</script>

<style scoped lang="scss">
// --- Variáveis de Tema ---
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$texto-claro: rgba($branco, 0.85);

// Cores para as categorias
$ouro: #FFD700;
$prata: #C0C0C0;
$bronze: #CD7F32;
$apoio-borda: #6C6C94;


// --- Estilos da Página e Cabeçalho ---
.page-container {
  background-color: $complemento;
}

.site-header {
  background-color: $complemento;
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    color: $branco;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
  }

  .main-nav ul {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;

    a {
      color: $texto-claro;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
      position: relative;
      padding-bottom: 0.5rem;

      &.active, &:hover {
        color: $branco;
      }
      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: $destaque;
      }
    }
  }

  .btn-cta {
    background-color: $destaque;
    color: $principal;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: darken($destaque, 10%);
    }
  }
}

// --- Estilos da Seção de Patrocinadores ---
.sponsors-section {
  padding: 5rem 1.5rem;
  text-align: center;
  color: $branco;
}

.sponsors-container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title, .category-title {
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  color: $texto-claro;
  max-width: 750px;
  margin: 0 auto 4rem auto;
  line-height: 1.7;
}

.sponsor-category {
  margin-bottom: 4.5rem;
  &:last-child { margin-bottom: 0; }
}

.category-title {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 600;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.75rem;

  &::after {
    content: ''; position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%); width: 80px; height: 4px;
    background-color: $destaque; border-radius: 2px;
  }
}

// 2. LÓGICA DE CENTRALIZAÇÃO IMPLEMENTADA AQUI
.sponsor-logos-grid {
  display: flex;
  justify-content: center; // Centraliza os itens na linha
  align-items: center;
  flex-wrap: wrap; // Permite que os itens quebrem para a próxima linha
  gap: 1.5rem;
}

.sponsor-logo-card {
  display: flex;
  transition: transform 0.3s ease;
  text-decoration: none;
  
  // Largura definida para cada categoria
  &.cat-ouro { flex-basis: calc(33.33% - 1.5rem); }
  &.cat-prata { flex-basis: calc(20% - 1.5rem); }
  &.cat-bronze { flex-basis: calc(12.5% - 1.5rem); }
  &.cat-apoio { flex-basis: calc(12.5% - 1.5rem); }

  .logo-background {
    display: flex; align-items: center; justify-content: center;
    background-color: $branco;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    padding: 0.75rem;
    width: 100%;
    height: 120px;
    transition: background-color 0.3s ease;
  }
  
  &:hover { transform: translateY(-8px); }
  .sponsor-image {
    max-width: 100%; max-height: 90%;
    object-fit: contain;
    filter: grayscale(100%);
    transition: filter 0.3s ease;
  }
  &:hover .sponsor-image { filter: grayscale(0%); }
}

// Estilos de borda e altura por categoria
.category-wrapper-ouro .logo-background { border: 4px solid $ouro; height: 180px; }
.category-wrapper-prata .logo-background { border: 3px solid $prata; height: 140px; }
.category-wrapper-bronze .logo-background { border: 3px solid $bronze; height: 100px; }
.category-wrapper-apoio .logo-background { border: 2px solid $apoio-borda; height: 100px; }

// --- Responsividade ---
@media (max-width: 1024px) {
  .sponsor-logo-card {
    &.cat-ouro { flex-basis: calc(50% - 1.5rem); }
    &.cat-prata { flex-basis: calc(33.33% - 1.5rem); }
    &.cat-bronze { flex-basis: calc(25% - 1.5rem); }
    &.cat-apoio { flex-basis: calc(25% - 1.5rem); }
  }
}

@media (max-width: 768px) {
  .site-header {
    flex-direction: column;
    gap: 1rem;
    .main-nav { display: none; } // Esconde a navegação principal, idealmente seria um menu hambúrguer
  }
  .sponsor-logo-card {
    &.cat-ouro { flex-basis: calc(50% - 1rem); }
    &.cat-prata { flex-basis: calc(50% - 1rem); }
    &.cat-bronze { flex-basis: calc(33.33% - 1rem); }
    &.cat-apoio { flex-basis: calc(33.33% - 1rem); }
  }
}

@media (max-width: 480px) {
    .sponsor-logo-card {
    &.cat-ouro { flex-basis: 100%; }
    &.cat-prata { flex-basis: calc(50% - 1rem); }
    &.cat-bronze { flex-basis: calc(50% - 1rem); }
    &.cat-apoio { flex-basis: calc(50% - 1rem); }
  }
}
</style>