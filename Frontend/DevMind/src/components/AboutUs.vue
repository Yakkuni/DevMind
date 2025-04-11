<template>
    <section
      id="about"
      class="about-section"
      :style="{ backgroundImage: `url(${aboutBackground})` }"
    >
      <div class="about-container">
        <div class="about-columns">
          <!-- Coluna Esquerda: Cabeçalho centralizado -->
          <div class="about-header">
            <h1>CONHEÇA O <br />DEVMIND</h1>
            <button class="play-btn" type="button">
              ▶
            </button>
          </div>
          <!-- Coluna Direita: Accordion com animação -->
          <div class="about-accordion">
            <div
              class="accordion-item"
              v-for="(item, index) in accordions"
              :key="index"
            >
              <button
                type="button"
                class="accordion-trigger"
                @click="toggleAccordion(index)"
              >
                {{ item.title }}
                <span class="icon">
                  {{ activeAccordion === index ? '-' : '+' }}
                </span>
              </button>
              <transition name="accordion">
                <div v-show="activeAccordion === index" class="accordion-content">
                  {{ item.content }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // URL da imagem de background da seção "Sobre" (substitua conforme necessário)
  const aboutBackground = '/2024/assets/Sobre-MNY0lldR.png';
  
  const activeAccordion = ref<number | null>(null);
  
  function toggleAccordion(index: number) {
    activeAccordion.value = activeAccordion.value === index ? null : index;
  }
  
  const accordions = [
    {
      title: 'O que é a DevMind?',
      content:
        'A DevMind é um evento que reúne profissionais, estudantes e entusiastas de tecnologia para promover networking, aprendizado e inovações.'
    },
    {
      title: 'Pra quem é a DevMind?',
      content:
        'O evento é voltado para estudantes, profissionais e apaixonados por tecnologia que buscam atualização e oportunidades no setor.'
    },
    {
      title: 'Por que ir na DevMind?',
      content:
        'Participar da DevMind permite trocar ideias, inspirar novas soluções e estar conectado com o que há de mais inovador no setor tecnológico.'
    }
  ];
  </script>
  
  <style scoped lang="scss">
  .about-section {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding: 2rem 1rem;
    color: #fff;
  }
  
  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* Layout em colunas para telas maiores */
  .about-columns {
    display: flex;
    gap: 2rem;
  }
  
  /* Coluna Esquerda: Cabeçalho centralizado */
  .about-header {
    flex: 1;
    text-align: center; /* Centraliza o título e o botão */
    
    h1 {
      font-size: 3rem;
      font-weight: bold;
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    .play-btn {
      font-size: 1.5rem;
      border: none;
      background: transparent;
      color: #fff;
      cursor: pointer;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  
  /* Coluna Direita: Accordion */
  .about-accordion {
    flex: 1;
    .accordion-item {
      margin-bottom: 1rem;
      
      .accordion-trigger {
        width: 100%;
        text-align: center;
        background: none;
        border: 1px solid #fff;
        color: #fff;
        padding: 1rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.125rem;
        transition: background 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      
      .accordion-content {
        background: rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border: 1px solid #fff;
        border-top: none;
        font-size: 1rem;
        line-height: 1.5;
      }
    }
  }
  
  /* Animação para o Accordion */
  .accordion-enter-active,
  .accordion-leave-active {
    transition: all 0.3s ease;
  }
  .accordion-enter-from,
  .accordion-leave-to {
    opacity: 0;
    max-height: 0;
  }
  .accordion-enter-to,
  .accordion-leave-from {
    opacity: 1;
    max-height: 500px;
  }
  
  /* Responsividade: empilha colunas em telas menores */
  @media (max-width: 600px) {
    .about-columns {
      flex-direction: column;
    }
    .about-header {
      h1 {
        font-size: 2.25rem;
      }
    }
    .about-accordion {
      .accordion-item {
        .accordion-trigger {
          font-size: 1rem;
          padding: 0.75rem;
        }
        .accordion-content {
          font-size: 0.9rem;
          padding: 1.75rem;
        }
      }
    }
  }
  </style>
  