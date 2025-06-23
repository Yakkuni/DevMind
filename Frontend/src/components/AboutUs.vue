<template>
  <section
    id="about"
    class="about-section"
    :style="{ backgroundImage: `url(${aboutBackground})` }"
  >
    <div class="section-overlay"></div> <div class="about-container">
      <div class="about-columns">
        <div class="about-header">
          <h1>CONHEÇA O <br /><span>DEVMIND</span></h1>
          <button class="play-btn" type="button" aria-label="Assistir vídeo sobre o DevMind">
            <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <p class="play-text">Assista ao vídeo</p>
        </div>

        <div class="about-accordion">
          <div
            class="accordion-item"
            v-for="(item, index) in accordions"
            :key="index"
            :class="{ 'is-active': activeAccordion === index }"
          >
            <button
              type="button"
              class="accordion-trigger"
              @click="toggleAccordion(index)"
              :aria-expanded="activeAccordion === index"
              :aria-controls="`accordion-content-${index}`"
              :id="`accordion-trigger-${index}`"
            >
              {{ item.title }}
              <span class="icon" aria-hidden="true">
                <svg v-if="activeAccordion === index" class="accordion-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>
                <svg v-else class="accordion-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </span>
            </button>
            <transition name="accordion">
              <div
                v-show="activeAccordion === index"
                class="accordion-content"
                role="region"
                :id="`accordion-content-${index}`"
                :aria-labelledby="`accordion-trigger-${index}`"
              >
                <p>{{ item.content }}</p>
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

// URL da imagem de background da seção "Sobre"
// Certifique-se que este caminho está correto. Se estiver em 'src/assets', importe-o:
// import aboutBackground from '@/assets/Sobre-MNY0lldR.png';
const aboutBackground = '/2024/assets/Sobre-MNY0lldR.png';

const activeAccordion = ref<number | null>(null);

function toggleAccordion(index: number) {
  activeAccordion.value = activeAccordion.value === index ? null : index;
}

const accordions = [
  {
    title: 'O que é o DevMind?',
    content:
      'O DevMind é o principal ponto de encontro da comunidade de tecnologia no Norte. Um evento imersivo com palestras de alto nível, workshops práticos e painéis de discussão que conectam as mentes mais brilhantes do setor para compartilhar conhecimento, criar soluções e definir o futuro da tecnologia na nossa região.'
  },
  {
    title: 'Pra quem é o DevMind?',
    content:
      'Para todos que respiram tecnologia. Seja você um(a) desenvolvedor(a) experiente em busca de novas stacks, um(a) estudante ansioso(a) pelo primeiro contato com o mercado, um(a) gestor(a) de tecnologia mapeando tendências ou simplesmente um(a) entusiasta apaixonado(a) por inovação, o DevMind é o seu lugar.'
  },
  {
    title: 'Por que ir no DevMind?',
    content:
      'Para acelerar sua carreira e expandir sua visão. No DevMind você terá acesso a: \n • Conhecimento Aplicável: Aprenda com casos reais e ferramentas que você poderá usar no dia seguinte. \n • Networking de Valor: Conecte-se com recrutadores, líderes técnicos e futuros parceiros de negócios. \n • Inspiração e Novas Perspectivas: Volte para casa com a mente fervilhando de novas ideias e a energia renovada para seus projetos.'
  },
  {
    title: 'O que nos torna diferentes?',
    content:
      'Nosso foco é a comunidade local. Mais do que um evento, somos um movimento para fortalecer o ecossistema de tecnologia de Tabuleiro do Norte e região. Cada palestra, cada conexão e cada patrocínio são pensados para gerar valor e oportunidades reais aqui, para a nossa gente.'
  }
];
</script>

<style scoped lang="scss">
// Suas variáveis globais
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

.about-section {
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  // MUDANÇA: Aumentamos o padding vertical para a seção ocupar mais espaço
  padding: 7rem 1.5rem; 
  color: $branco;
  border-bottom: 3px solid $destaque; 
  border-top: 3px solid $destaque; 

  .section-overlay {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: $complemento; 
    z-index: 1;
  }
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 2;
}

.about-columns {
  display: grid; // MUDANÇA: Usando grid para um controle mais preciso
  grid-template-columns: 1fr 1.2fr; // Dando um pouco mais de espaço para o accordion
  gap: 4rem; // MUDANÇA: Aumentamos o espaço entre as colunas
  align-items: center;
}

.about-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-right: 1rem;

  h1 {
    // MUDANÇA: Título principal maior e mais imponente
    font-size: clamp(2.8rem, 5vw, 4rem); 
    font-weight: 800; // Mais peso na fonte
    line-height: 1.2;
    margin-bottom: 2.5rem; // Mais espaço abaixo
    text-shadow: 0 3px 10px rgba($preto, 0.4);

    span {
      color: $destaque;
      display: block;
    }
  }

  .play-btn {
    // MUDANÇA: Botão de play um pouco maior
    width: 85px;
    height: 85px;
    border-radius: 50%;
    border: 3px solid $destaque;
    background-color: rgba($destaque, 0.15);
    color: $branco;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    .play-icon {
      width: 35px; // Ícone maior
      height: 35px;
      margin-left: 5px;
    }

    &:hover {
      background-color: $destaque;
      color: $principal;
      transform: scale(1.08);
      box-shadow: 0 0 25px rgba($destaque, 0.6);
    }
  }
  .play-text {
    font-size: 1rem;
    color: lighten($complementoCLaro, 20%);
    font-weight: 500;
  }
}

.about-accordion {
  flex: 1.2;
  max-width: 650px; // Um pouco mais largo

  .accordion-item {
    margin-bottom: 1.2rem; // Mais espaço entre os itens
    border: 1px solid rgba($branco, 0.25);
    border-radius: 12px; // Bordas mais arredondadas
    background-color: rgba($principal, 0.4);
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover, &.is-active {
      border-color: rgba($destaque, 0.8);
      background-color: rgba($principal, 0.6);
    }
    
    &.is-active {
        border-left: 4px solid $destaque;
    }

    .accordion-trigger {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      color: $branco;
      // MUDANÇA: Mais padding para um toque maior
      padding: 1.5rem 1.8rem; 
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2rem; // Fonte maior
      font-weight: 600;
      transition: color 0.3s ease;

      &:hover {
        color: $destaque;
      }

      .icon .accordion-icon {
        width: 22px; // Ícone + e - maiores
        height: 22px;
      }
    }

    .accordion-content {
      // MUDANÇA: Mais padding e texto maior
      padding: 0 1.8rem 1.5rem 1.8rem; 
      font-size: 1rem;
      line-height: 1.7;
      color: lighten($complementoCLaro, 30%);
      white-space: pre-line; // Interpreta as quebras de linha (\n) do texto

      p {
        margin: 0;
      }
    }
  }
}

// Animação do Accordion (sem alterações)
.accordion-enter-active, .accordion-leave-active { transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out; overflow: hidden; }
.accordion-enter-from, .accordion-leave-to { opacity: 0; max-height: 0; }
.accordion-enter-to, .accordion-leave-from { opacity: 1; max-height: 500px; }


// Responsividade
@media (max-width: 900px) { // Ajustado breakpoint
  .about-columns {
    grid-template-columns: 1fr; // Coluna única
    gap: 3rem;
  }
  .about-header {
    padding-right: 0;
    margin-bottom: 1rem;
    h1 {
      font-size: clamp(2.4rem, 8vw, 3rem);
    }
  }
  .about-accordion {
    width: 100%;
    max-width: 650px;
  }
}

@media (max-width: 480px) {
  .about-section {
    padding: 5rem 1rem;
  }
}
</style>