<template>
  <div class="about-us-page">
    <main>
      <section class="hero-section">
        <div class="container">
          <h1 class="hero-title">Conectando desenvolvedores e ideias inovadoras.</h1>
          <p class="hero-subtitle">Venha se reinventar | O seu futuro é agora!</p>
        </div>
      </section>

      <section class="intro-section">
        <div class="container grid-2-cols">
          <div class="intro-text">
            <h2 class="section-title">O Maior Evento de Tecnologia de Tabuleiro do Norte</h2>
            <p>
              O DevMind nasceu para ser o ponto de encontro da comunidade de tecnologia da nossa região. Um evento para profissionais, estudantes e entusiastas que buscam atualização, networking e oportunidades inovadoras.
            </p>
            <blockquote class="mission-quote">
              Nossa missão é impulsionar a comunidade, acreditando no poder da colaboração para fortalecer o ecossistema de tecnologia local.
            </blockquote>
          </div>
          <div class="intro-visual">
            <svg class="decorative-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFA051" d="M49.5,-67.9C62.7,-60.1,75.9,-46.8,80.1,-31.8C84.3,-16.8,79.5,0,72,14.8C64.5,29.6,54.3,42.4,41.9,52.3C29.6,62.2,14.8,69.2,0.4,68.8C-14,68.4,-28.1,60.6,-41.8,51C-55.5,41.4,-68.8,29.9,-75.3,15.1C-81.8,0.3,-81.4,-17.7,-73.4,-32.9C-65.4,-48.1,-49.8,-60.5,-34.4,-68.8C-19,-77.1,-3.8,-81.3,11.2,-81.7C26.1,-82.1,52.2,-78.3,49.5,-67.9Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="container">
          <h2 class="section-title text-center">Uma Experiência Completa</h2>
          <p class="section-subtitle text-center">Nossa programação é planejada para oferecer conhecimento, prática e conexões valiosas.</p>
          <div class="features-grid">
            <div v-for="feature in features" :key="feature.title" class="feature-card">
              <div class="feature-icon" v-html="feature.icon"></div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="final-cta-section">
        <div class="container text-center">
          <h2 class="section-title">Pronto para o Próximo Nível?</h2>
          <p class="section-subtitle">Garanta sua vaga e faça parte da transformação.</p>
          <a href="#" class="btn-cta">
            <span>Participar do Evento</span>
            <svg class="cta-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const features = ref([
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H4z" opacity=".3"/><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12zM6 10h2v2H6zm0-3h2v2H6zm0-3h2v2H6zm4 6h8v2H10zm0-3h8v2H10zm0-3h8v2H10z"/></svg>`,
    title: "Palestras Inspiradoras",
    description: "Aprenda com especialistas renomados que estão na vanguarda do mercado e descubra as últimas tendências."
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
    title: "Workshops Práticos",
    description: "Coloque a mão na massa e desenvolva novas habilidades em sessões práticas com ferramentas e tecnologias atuais."
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>`,
    title: "Painéis de Discussão",
    description: "Participe de debates ricos sobre o futuro da tecnologia, carreira e os desafios do setor com múltiplos especialistas."
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
    title: "Networking Estratégico",
    description: "Amplie sua rede de contatos, conheça recrutadores, encontre parceiros de negócios e faça parte de uma comunidade vibrante."
  }
]);
</script>

<style scoped lang="scss">
// --- Variáveis de Tema ---
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$cinza-fundo: #f8f9fa;
$texto-escuro: #2d3748;
$texto-claro: #5a667a;

// --- Estilos Gerais ---
.about-us-page {
  background-color: $branco;
  font-family: 'Inter', sans-serif; // Sugestão de uma fonte moderna
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.text-center { text-align: center; }

.section-title {
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 800;
  color: $complemento;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: $texto-claro;
  max-width: 700px;
  margin: 0 auto 3.5rem auto;
  line-height: 1.7;
}

// --- Seção Hero ---
.hero-section {
  background: linear-gradient(145deg, $principal, $complemento);
  color: $branco;
  text-align: center;
  padding: 7rem 1.5rem;
  .hero-title {
    color: $branco;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    max-width: 850px;
    margin: 0 auto 1rem auto;
    line-height: 1.2;
  }
  .hero-subtitle {
    color: $destaque;
    font-size: 1.2rem;
    font-weight: 500;
  }
}

// --- Seção de Introdução (com Missão integrada) ---
.intro-section {
  padding: 6rem 0;
  .grid-2-cols {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    align-items: center;
    gap: 5rem;
  }
  .intro-text p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: $texto-claro;
  }
  .mission-quote {
    margin-top: 2rem;
    padding-left: 1.5rem;
    border-left: 4px solid $destaque;
    font-size: 1.2rem;
    font-weight: 500;
    color: $principal;
    line-height: 1.6;
  }
  .intro-visual {
    display: flex;
    justify-content: center;
    .decorative-svg path {
      animation: morph 12s ease-in-out infinite alternate;
    }
  }
}

// --- Seção de Features (Cards Redesenhados) ---
.features-section {
  padding: 6rem 0;
  background-color: $cinza-fundo;
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
  }
  .feature-card {
    background-color: $branco;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px -15px rgba(45, 55, 72, 0.2);
    }
  }
  .feature-icon svg {
    width: 40px;
    height: 40px;
    color: $destaque;
  }
  .feature-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: $complemento;
    margin: 0;
  }
  .feature-description {
    font-size: 1rem;
    line-height: 1.6;
    color: $texto-claro;
    margin: 0;
  }
}

// --- Seção CTA Final (Botão Melhorado) ---
.final-cta-section {
  padding: 6rem 1.5rem;
  background-color: $branco;
  .btn-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(45deg, $destaque, darken($destaque, 15%));
    color: $branco;
    padding: 1rem 2.5rem;
    border-radius: 50px; // Bordas arredondadas
    text-decoration: none;
    font-size: 1.15rem;
    font-weight: bold;
    box-shadow: 0 5px 20px -5px rgba($destaque, 0.6);
    transition: all 0.3s ease;
    .cta-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
    }
    &:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 10px 25px -5px rgba($destaque, 0.5);
      .cta-icon {
        transform: translateX(5px);
      }
    }
  }
}

// --- Animações e Responsividade ---
@keyframes morph {
  0% { transform: scale(1) rotate(0deg) translate(5px, -10px); }
  50% { transform: scale(1.1) rotate(5deg) translate(-5px, 10px); }
  100% { transform: scale(1) rotate(0deg) translate(5px, -10px); }
}

@media (max-width: 992px) {
  .intro-section .grid-2-cols {
    grid-template-columns: 1fr;
    gap: 3rem;
    .intro-visual { display: none; }
  }
}

@media (max-width: 768px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>