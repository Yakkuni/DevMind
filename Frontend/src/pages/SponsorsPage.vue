<template>
  <section class="sponsors-section">
    <div class="sponsors-container">
      <h2 class="section-title">Nossos Parceiros</h2>
      <p class="section-subtitle">
        Agradecemos a todos os patrocinadores que tornam o DevMind possível e ajudam a impulsionar a comunidade de tecnologia.
      </p>

      <div
        class="sponsor-category"
        v-for="(categorySponsors, categoryName) in categorizedSponsors"
        :key="categoryName"
        :class="`category-${String(categoryName).toLowerCase()}`"
        v-show="categorySponsors.length > 0"
      >
        <h3 class="category-title">{{ categoryName }}</h3>
        <div class="sponsor-logos-grid">
          <a
            v-for="sponsor in categorySponsors"
            :key="sponsor.id"
            :href="sponsor.link"
            class="sponsor-logo-card"
            target="_blank"
            rel="noopener noreferrer"
            :title="`Visitar ${sponsor.name}`"
          >
            <img :src="sponsor.logo" :alt="`Logo ${sponsor.name}`" class="sponsor-image" />
            </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// import axios from 'axios'; // Descomente quando for buscar dados da API

interface Sponsor {
  id: string | number;
  name: string;
  logo: string;
  link: string;
  category: 'Ouro' | 'Prata' | 'Bronze' | 'Apoio';
}

const sponsors = ref<Sponsor[]>([
  { id: 1, name: 'Empresa Ouro Max', logo: 'https://via.placeholder.com/280x160/FFD700/000000?text=Ouro+MAX', link: '#', category: 'Ouro' },
  { id: 2, name: 'Tech Gold Solutions', logo: 'https://via.placeholder.com/260x150/FFD700/000000?text=Ouro+Tech', link: '#', category: 'Ouro' },
  { id: 3, name: 'Silver Systems', logo: 'https://via.placeholder.com/240x140/C0C0C0/000000?text=Prata+Systems', link: '#', category: 'Prata' },
  { id: 4, name: 'Conect Prata', logo: 'https://via.placeholder.com/220x130/C0C0C0/000000?text=Prata+Conect', link: '#', category: 'Prata' },
  { id: 5, name: 'Bronze Bits', logo: 'https://via.placeholder.com/200x120/CD7F32/FFFFFF?text=Bronze+Bits', link: '#', category: 'Bronze' },
  { id: 6, name: 'Dev Bronze Co.', logo: 'https://via.placeholder.com/180x110/CD7F32/FFFFFF?text=Bronze+Dev', link: '#', category: 'Bronze' },
  { id: 7, name: 'Apoio Inovador', logo: 'https://via.placeholder.com/160x100/D3D3D3/000000?text=Apoio', link: '#', category: 'Apoio' },
]);

// Lógica para buscar patrocinadores da API (exemplo)
// async function fetchSponsors() { /* ... */ }
// onMounted(() => { fetchSponsors(); });

const categorizedSponsors = computed(() => {
  const categoryOrder: Sponsor['category'][] = ['Ouro', 'Prata', 'Bronze', 'Apoio'];
  const categories: { [key in Sponsor['category']]?: Sponsor[] } = {};
  categoryOrder.forEach(cat => { categories[cat] = []; });

  sponsors.value.forEach((sponsor) => {
    if (categories[sponsor.category]) {
      categories[sponsor.category]?.push(sponsor);
    } else {
      if (!categories['Apoio']) categories['Apoio'] = [];
      categories['Apoio']?.push(sponsor);
    }
  });

  const filteredCategories: { [key: string]: Sponsor[] } = {};
  for (const category of categoryOrder) {
    if (categories[category] && categories[category]!.length > 0) {
      filteredCategories[category] = categories[category]!;
    }
  }
  return filteredCategories;
});
</script>

<style scoped lang="scss">
// Suas variáveis globais
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
// $cinza-borda-suave: #e0e0e0; // Pode não ser necessário com fundo escuro
// $cinza-fundo-secao: #f4f6f8; // Não será mais usado para o fundo principal desta seção

.sponsors-section {
  padding: 4rem 1.5rem;
  // ANTERIOR: background-color: $cinza-fundo-secao;
  background-color: $complemento; // NOVO: Fundo escuro para a seção
  color: $branco; // Cor de texto padrão para a seção agora é branca
  text-align: center;
  // Adiciona padding-top para compensar a altura da navbar se ela for fixa e transparente.
  // Se a navbar não for fixa, ou se ela já tiver seu próprio fundo sólido, este padding pode não ser necessário
  // ou precisará ser ajustado. Assumindo que a Navbar tem ~70px de altura:
  // padding-top: calc(70px + 4rem); // Exemplo se navbar for fixa e transparente
}

.sponsors-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  // ANTERIOR: color: $principal;
  color: $branco; // NOVO: Título claro sobre fundo escuro
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  // ANTERIOR: color: $complementoCLaro;
  color: lighten($complementoCLaro, 25%); // Mantém um tom claro, mas ajustado para fundo escuro
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
}

.sponsor-category {
  margin-bottom: 3.5rem;
  &:last-child {
    margin-bottom: 0;
  }
}

.category-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  // ANTERIOR: color: $complemento;
  color: $branco; // NOVO: Título da categoria claro
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: $destaque; // Destaque mantém bem
    border-radius: 2px;
  }
}

.sponsor-logos-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
}

.sponsor-logo-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: $branco; // Cards dos logos continuam brancos para destaque
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba($preto, 0.15); // Sombra um pouco mais forte sobre fundo escuro
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  text-decoration: none;
  min-height: 120px;

  &:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 10px 25px rgba($preto, 0.2);
  }

  .sponsor-image {
    max-width: 100%;
    object-fit: contain;
  }
}

// Estilos específicos por categoria para tamanho dos logos
.category-ouro {
  .sponsor-logo-card {
    padding: 2rem;
    min-width: 220px;
    .sponsor-image { max-height: 120px; }
  }
}
.category-prata {
  .sponsor-logo-card {
    min-width: 180px;
    .sponsor-image { max-height: 100px; }
  }
}
.category-bronze {
  .sponsor-logo-card {
    min-width: 150px;
    padding: 1.25rem;
    .sponsor-image { max-height: 80px; }
  }
}
.category-apoio {
  .sponsor-logo-card {
    min-width: 120px;
    padding: 1rem;
    .sponsor-image { max-height: 70px; }
  }
}

// Ajustes responsivos adicionais
@media (max-width: 768px) {
  .sponsors-section {
    // Se a navbar for fixa, o padding-top da seção pode precisar de ajuste aqui também
    // padding-top: calc(60px + 2rem); // Exemplo de altura de navbar mobile + padding da seção
  }
  .section-title {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
  .section-subtitle {
     margin-bottom: 2rem;
  }
  .category-title {
    font-size: clamp(1.3rem, 5vw, 1.7rem);
    margin-bottom: 1.5rem;
  }
  .category-ouro .sponsor-logo-card .sponsor-image,
  .category-prata .sponsor-logo-card .sponsor-image,
  .category-bronze .sponsor-logo-card .sponsor-image,
  .category-apoio .sponsor-logo-card .sponsor-image {
    max-height: 70px;
  }
   .category-ouro .sponsor-logo-card { padding: 1.5rem; min-width: 150px; }
   .category-prata .sponsor-logo-card { padding: 1.25rem; min-width: 130px; }
   .category-bronze .sponsor-logo-card, .category-apoio .sponsor-logo-card { padding: 1rem; min-width: 100px; }
}
</style>