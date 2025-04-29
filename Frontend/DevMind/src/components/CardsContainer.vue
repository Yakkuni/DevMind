<template>
    <section class="expect-section">
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
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import CardItem from './/CardItem.vue'
  
  const cards = ref([
    {
      title: 'Conteúdo',
      description: 'O evento tem minicursos, palestras, oficinas de programação e montagem de robôs, debates sobre tecnologia e mercado tecnologico.',
      image: 'https://thumbs.dreamstime.com/b/selo-do-exemplo-28420393.jpg',
      bgColor: '#360591',
      borderColor: '#000'
    },
    {
      title: 'Entretenimento',
      description: 'Competições de jogos digitais, decoração tématica, quiz nerd e sala com computadores.',
      image: 'https://thumbs.dreamstime.com/b/selo-do-exemplo-28420393.jpg',
      bgColor: '#6C3BAA',
      borderColor: '#000'
    },
    {
      title: 'Descanso',
      description: 'Espaço para você sair da correria, se sentar e descansar em salas climatizadas para retomar o folego e aproveitar o evento.',
      image: 'https://thumbs.dreamstime.com/b/selo-do-exemplo-28420393.jpg',
      bgColor: '#B69CD0',
      borderColor: '#000'
    }
  ])
  </script>
  
  <style scoped lang="scss">
  .expect-section {
    padding: 2rem 1rem;
    text-align: center;
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .detail-button {
      margin-bottom: 2rem;
      padding: 0.75rem 1.5rem;
      border: 2px solid #333;
      background: transparent;
      cursor: pointer;
      transition: background 0.3s, color 0.3s;
      &:hover {
        background: #333;
        color: #fff;
      }
    }
    .cards-container {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  @media (max-width: 768px) {
    .expect-section {
      .cards-container {
        flex-direction: column;
        align-items: center;
      }
    }
  }
  </style>
  