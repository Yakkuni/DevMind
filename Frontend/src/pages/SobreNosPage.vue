<template>
  <div class="about-us-page">

    <main>
      <section class="hero-section">
        <div class="container">
          <h1 class="hero-title">Conectando desenvolvedores e ideias inovadoras em um só lugar.</h1>
          <p class="hero-subtitle">Venha se reinventar | O seu futuro é agora!</p>
        </div>
      </section>

      <section class="intro-section">
        <div class="container grid-2-cols">
          <div class="intro-text">
            <h2 class="section-title">O Maior Evento de Tecnologia de Tabuleiro do Norte</h2>
            <p>
              O DevMind nasceu com o propósito de ser o ponto de encontro para a comunidade de tecnologia da nossa região. Somos um evento para profissionais, estudantes e entusiastas apaixonados que buscam atualização, networking de qualidade e oportunidades inovadoras no setor.
            </p>
            <p>
              Aqui, você tem a chance de trocar ideias com grandes nomes do mercado, inspirar novas soluções para seus desafios e se conectar com o que há de mais relevante no universo da tecnologia.
            </p>
          </div>
          <div class="intro-visual">
            <svg class="decorative-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFA051" d="M38.1,-49.5C52.4,-39.7,69.2,-29.4,75.2,-13.8C81.2,1.8,76.4,22.7,65.3,37.3C54.2,52,36.8,60.4,19.9,65.1C3,69.8,-13.4,70.9,-29.2,65.2C-45,59.5,-60.2,47,-69.1,31.2C-78.1,15.4,-80.7,-3.6,-74.6,-19.5C-68.5,-35.4,-53.7,-48.2,-39.1,-58.1C-24.5,-68,-10.2,-75,4.7,-77.3C19.6,-79.6,39.2,-77.2,49.5,-67.9L38.1,-49.5Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
      </section>

      <section class="features-section">
        <div class="container">
          <h2 class="section-title text-center">Uma Experiência Completa</h2>
          <p class="section-subtitle text-center">Nossa programação é cuidadosamente planejada para oferecer conhecimento, prática e conexões valiosas.</p>
          <div class="features-grid">
            <div v-for="feature in features" :key="feature.title" class="feature-card">
              <div class="feature-icon" v-html="feature.icon"></div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="mission-section">
        <div class="container text-center">
           <h2 class="section-title">Nossa Missão é Impulsionar a Comunidade</h2>
           <p class="section-subtitle">
            Acreditamos no poder da colaboração para fortalecer o ecossistema de tecnologia local. O DevMind é uma plataforma para o crescimento coletivo, viabilizado pelo apoio fundamental de nossos parceiros e pela energia de cada participante.
           </p>
        </div>
      </section>

      <section class="final-cta-section">
        <div class="container text-center">
          <h2 class="section-title">Pronto para o Próximo Nível?</h2>
          <p class="section-subtitle">Garanta sua vaga e faça parte da transformação.</p>
          <a href="#" class="btn btn-cta large-cta">Participar do Evento</a>
        </div>
      </section>
    </main>

    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-col">
                <h4>DevMind</h4>
                <p>Conectando desenvolvedores e ideias inovadoras em um só lugar. O maior evento de tecnologia de Tabuleiro do Norte.</p>
            </div>
            <div class="footer-col">
                <h4>Links Rápidos</h4>
                <ul>
                    <li><a href="#">Início</a></li>
                    <li><a href="#">Programação</a></li>
                    <li><a href="#">Patrocinadores</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contato & Redes</h4>
                <ul>
                    <li>Email: contato@devmind.com</li>
                    <li>Instagram: @devmind.evento</li>
                </ul>
            </div>
        </div>
    </footer>
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
$texto-branco-secundario: rgba($branco, 0.85);

// --- Estilos Gerais da Página ---
.about-us-page {
  background-color: $branco;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.text-center { text-align: center; }

.section-title {
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 700;
  color: $complemento;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.15rem;
  color: $texto-claro;
  max-width: 700px;
  margin: 0 auto 3.5rem auto;
  line-height: 1.7;
}

// --- Cabeçalho (copiado e adaptado) ---
.site-header {
  background-color: $complemento;
  padding: 1rem 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  position: sticky; top: 0; z-index: 1000;
  .header-container {
    max-width: 1200px; margin: 0 auto; display: flex;
    justify-content: space-between; align-items: center;
  }
  .logo { color: $branco; font-size: 1.5rem; font-weight: bold; text-decoration: none; }
  .main-nav ul {
    list-style: none; display: flex; gap: 2rem; margin: 0; padding: 0;
    a {
      color: $texto-branco-secundario; text-decoration: none; font-weight: 500;
      transition: color 0.2s ease; position: relative; padding-bottom: 0.5rem;
      &.active, &:hover { color: $branco; }
      &.active::after {
        content: ''; position: absolute; bottom: 0; left: 0;
        width: 100%; height: 2px; background-color: $destaque;
      }
    }
  }
  .btn-cta {
    background-color: $destaque; color: $principal; padding: 0.6rem 1.2rem;
    border-radius: 8px; text-decoration: none; font-weight: bold;
    transition: background-color 0.2s ease;
    &:hover { background-color: darken($destaque, 10%); }
  }
}

// --- Seção Hero ---
.hero-section {
  background: linear-gradient(135deg, $principal, $complemento);
  color: $branco;
  text-align: center;
  padding: 6rem 1.5rem;

  .hero-title {
    color: $branco;
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 700;
    max-width: 800px;
    margin: 0 auto 1rem auto;
    line-height: 1.2;
  }
  .hero-subtitle {
    color: $destaque;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 1px;
  }
}

// --- Seção de Introdução ---
.intro-section {
  padding: 5rem 0;
  background-color: $branco;
  .grid-2-cols {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    gap: 4rem;
  }
  .intro-text p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: $texto-claro;
    margin-bottom: 1.5rem;
  }
  .intro-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    .decorative-svg path {
      transform-origin: 100px 100px;
      animation: morph 8s ease-in-out infinite;
    }
  }
}

// --- Seção de Features ---
.features-section {
  padding: 5rem 0;
  background-color: $cinza-fundo;
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  .feature-card {
    background-color: $branco;
    padding: 2.5rem 2rem;
    text-align: center;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
  }
  .feature-icon {
    display: inline-flex;
    padding: 1rem;
    background-color: lighten($principal, 75%);
    border-radius: 50%;
    margin-bottom: 1.5rem;
    svg {
      width: 32px;
      height: 32px;
      color: $principal;
    }
  }
  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $complemento;
    margin-bottom: 0.75rem;
  }
  .feature-description {
    font-size: 1rem;
    line-height: 1.6;
    color: $texto-claro;
  }
}

// --- Seção Missão ---
.mission-section {
    padding: 6rem 0;
    background-color: $principal;
    .section-title {
        color: $branco;
    }
    .section-subtitle {
        color: $texto-branco-secundario;
        font-size: 1.2rem;
    }
}

// --- Seção CTA Final ---
.final-cta-section {
    padding: 5rem 0;
    .large-cta {
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        margin-top: 1rem;
    }
}

// --- Rodapé ---
.site-footer {
    background-color: $complemento;
    color: $texto-branco-secundario;
    padding: 4rem 0;
    font-size: 0.95rem;

    .footer-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr;
        gap: 3rem;
    }
    .footer-col h4 {
        color: $branco;
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .footer-col p { line-height: 1.7; }
    .footer-col ul { list-style: none; padding: 0; }
    .footer-col li { margin-bottom: 0.5rem; }
    .footer-col a {
        color: $texto-branco-secundario;
        text-decoration: none;
        &:hover { color: $destaque; text-decoration: underline; }
    }
}

// --- Animações e Responsividade ---
@keyframes morph {
  0% { transform: scale(1); }
  50% { transform: scale(1.1) rotate(10deg); }
  100% { transform: scale(1); }
}

@media (max-width: 992px) {
  .intro-section .grid-2-cols {
    grid-template-columns: 1fr;
    .intro-visual { display: none; }
  }
}

@media (max-width: 768px) {
  .site-header {
    .main-nav { display: none; }
  }
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>