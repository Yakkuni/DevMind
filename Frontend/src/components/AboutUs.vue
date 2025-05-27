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
      'O DevMind é um evento que reúne profissionais, estudantes e entusiastas de tecnologia para promover networking, aprendizado e inovações.'
  },
  {
    title: 'Pra quem é o DevMind?',
    content:
      'O evento é voltado para estudantes, profissionais e apaixonados por tecnologia que buscam atualização e oportunidades no setor.'
  },
  {
    title: 'Por que ir no DevMind?',
    content:
      'Participar do DevMind permite trocar ideias, inspirar novas soluções e estar conectado com o que há de mais inovador no setor tecnológico.'
  }
];
</script>

<style scoped lang="scss">
// Suas variáveis globais (assumindo que estão disponíveis ou importe-as)
// Ex: @import '@/styles/variables.scss';
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

.about-section {
  position: relative; // Para o overlay
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  padding: 5rem 1rem; // Aumenta o padding vertical da seção
  color: $branco;

  .section-overlay {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($complemento, 0.8); // Overlay mais escuro para melhor contraste
    z-index: 1;
  }
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem; // Padding lateral consistente
  position: relative;
  z-index: 2;
}

.about-columns {
  display: flex;
  gap: 1.5rem; // Reduzido de 2rem
  align-items: center;
}

.about-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-right: 1rem; // Pequeno espaçamento se o accordion crescer muito

  h1 {
    font-size: clamp(2.2rem, 5vw, 3.2rem); // Tamanho de fonte responsivo
    font-weight: 700;
    line-height: 1.25;
    margin-bottom: 2rem; // Mais espaço abaixo do título
    text-shadow: 0 2px 5px rgba($preto, 0.35);

    span {
      color: $destaque;
      display: block;
    }
  }

  .play-btn {
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 3px solid $destaque;
    background-color: rgba($destaque, 0.15);
    color: $branco;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;

    .play-icon {
      width: 30px;
      height: 30px;
      margin-left: 4px; // Ajuste para centralizar visualmente o ícone de play
    }

    &:hover {
      background-color: $destaque;
      color: $principal;
      transform: scale(1.08);
      box-shadow: 0 0 25px rgba($destaque, 0.6);
    }
  }
  .play-text {
    font-size: 0.95rem;
    color: lighten($complementoCLaro, 20%);
    font-weight: 500;
  }
}

.about-accordion {
  flex: 1.2;
  max-width: 620px;

  .accordion-item {
    margin-bottom: 1rem;
    border: 1px solid rgba($branco, 0.25);
    border-radius: 8px;
    background-color: rgba($principal, 0.4); // Fundo com cor principal e opacidade
    overflow: hidden;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:hover, &.is-active {
      border-color: rgba($destaque, 0.8);
      background-color: rgba($principal, 0.6);
    }
    
    &.is-active { // Estilo adicional para quando o item está ativo
        border-left: 4px solid $destaque; // Borda lateral de destaque
    }

    .accordion-trigger {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      color: $branco;
      padding: 1.2rem 1.5rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1rem;
      font-weight: 600;
      transition: color 0.3s ease;

      &:hover {
        color: $destaque;
      }

      .icon {
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        .accordion-icon {
            width: 20px;
            height: 20px;
        }
      }
      // Opcional: Animar o ícone se for um único ícone que rotaciona
      // &[aria-expanded="true"] .icon {
      //   transform: rotate(45deg);
      // }
    }

    .accordion-content {
      padding: 0 1.5rem 1.2rem 1.5rem; // Ajustado para não ter padding-top, pois o trigger já tem bottom padding visual
      font-size: 0.95rem;
      line-height: 1.65;
      color: lighten($complementoCLaro, 30%); // Cor de texto mais clara e suave

      p {
        margin: 0;
      }
    }
  }
}

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding-top 0.35s ease-in-out, padding-bottom 0.35s ease-in-out;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0 !important; // Força o padding a 0 durante a animação de fechamento
  padding-bottom: 0 !important;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px; // Ajuste para a altura máxima esperada do conteúdo
  // O padding é restaurado pelo estilo normal da classe .accordion-content
}

// Responsividade
@media (max-width: 820px) { // Ajustado breakpoint para tablet
  .about-columns {
    flex-direction: column;
    gap: 3rem; // Espaço entre header e accordion empilhados
    align-items: center; // Centraliza os itens empilhados
  }
  .about-header {
    padding-right: 0; // Remove padding quando empilhado
    margin-bottom: 1rem; // Espaço abaixo do header antes do accordion
    h1 {
      font-size: clamp(2rem, 6vw, 2.8rem);
    }
  }
  .about-accordion {
    width: 100%;
    max-width: 600px; // Mantém uma largura máxima agradável mesmo em mobile
  }
}

@media (max-width: 480px) {
  .about-section {
    padding: 3rem 0.5rem; // Menos padding lateral em telas muito pequenas
  }
  .about-container {
    padding: 1rem 0.5rem;
  }
  .about-header h1 {
    font-size: clamp(1.8rem, 7vw, 2.2rem);
  }
  .about-accordion .accordion-item {
    .accordion-trigger {
      font-size: 1rem;
      padding: 1rem;
    }
    .accordion-content {
      font-size: 0.9rem;
      padding: 0 1rem 1rem 1rem;
    }
  }
}
</style>