<template>
  <section class="sponsors-section">
    <h2 class="section-title">Patrocinadores</h2>
    <div class="sponsor-category" v-for="(sponsors, category) in categorizedSponsors" :key="category">
      <h3 class="category-title">{{ category }}</h3>
      <div class="sponsor-logos">
        <a
          v-for="sponsor in sponsors"
          :key="sponsor.name"
          :href="sponsor.link"
          class="sponsor-logo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="sponsor.logo" :alt="sponsor.name" />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Sponsor {
  name: string;
  logo: string;
  link: string;
  category: 'Ouro' | 'Prata' | 'Bronze';
}

const sponsors = ref<Sponsor[]>([
  {
    name: 'Patrocinador Ouro',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpbyr9AlomgqtwM5z4VPBIi3yEcBTR-c9beg&s',
    link: 'https://www.instagram.com/projetodevup/',
    category: 'Ouro',
  },
  {
    name: 'Patrocinador Prata',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpbyr9AlomgqtwM5z4VPBIi3yEcBTR-c9beg&s',
    link: 'https://www.instagram.com/projetodevup/',
    category: 'Prata',
  },
  {
    name: 'Patrocinador Bronze',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpbyr9AlomgqtwM5z4VPBIi3yEcBTR-c9beg&s',
    link: 'https://www.instagram.com/projetodevup/',
    category: 'Bronze',
  },
]);

const categorizedSponsors = computed(() => {
  const categories: { [key: string]: Sponsor[] } = {
    Ouro: [],
    Prata: [],
    Bronze: [],
  };
  sponsors.value.forEach((sponsor) => {
    categories[sponsor.category].push(sponsor);
  });
  return categories;
});
</script>

<style scoped>
.sponsors-section {
  padding: 2rem 1rem;
  text-align: center;
}

.section-title {
  font-size: 4.5rem;
  margin-bottom: 2rem;
}

.sponsor-category {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
}

.sponsor-logos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.sponsor-logo img {
  max-height: 100px;
  transition: transform 0.3s ease;
}

.sponsor-logo img:hover {
  transform: scale(1.05);
}
</style>
