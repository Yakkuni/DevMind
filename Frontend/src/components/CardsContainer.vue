<template>
  <div class="cards-container">
    <CardItem
      v-for="(card, idx) in cards"
      :key="idx"
      :title="card.title"
      :description="card.description"
      :image="card.image"
      :bgColor="card.bgColor"
      :borderColor="card.borderColor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CardItem from './CardItem.vue'

// O script permanece o mesmo, com o conteúdo e os ícones que melhoramos.
const cards = ref([
  {
    title: 'Conteúdo de Ponta',
    description: 'Mergulhe em um universo de conhecimento com palestras de alto nível, workshops práticos e painéis sobre as tecnologias que estão definindo o futuro do desenvolvimento.',
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>`,
    bgColor: '#2C2966',
    borderColor: '#FFA051'
  },
  {
    title: 'Entretenimento Épico',
    description: 'Desafie seus amigos em campeonatos de e-sports, teste seus conhecimentos em nosso Quiz Nerd com prêmios incríveis e relaxe em uma área de jogos totalmente equipada.',
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12M3.75 17.25h16.5M3.75 6.75h16.5m-16.5 5.25h16.5" /> <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5" /></svg>`,
    bgColor: '#131047',
    borderColor: '#FFA051'
  },
  {
    title: 'Conexão & Descanso',
    description: 'Recarregue suas energias em nossos lounges climatizados, aproveite o café e os snacks para conversar com outros devs e amplie seu networking em um ambiente pensado para a colaboração.',
    image: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25a9.75 9.75 0 018.667 12.016a9.75 9.75 0 01-17.333 0A9.75 9.75 0 0112 2.25z" /></svg>`,
    bgColor: '#6C6C94',
    borderColor: '#FFA051'
  }
])
</script>

<style scoped lang="scss">
// MUDANÇA: A regra para .expect-section foi removida.
// Agora o estilo controla apenas o container dos cards.
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%; // Garante que o container ocupe o espaço disponível
}
</style>