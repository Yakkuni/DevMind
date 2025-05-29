<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled, 'navbar-hidden': !isNavbarVisible }">
    <div class="navbar-brand">
      <router-link to="/" class="brand-link">
        <img class="logo" src="@/assets/DevMindIcon.png" alt="Logo DevMind" />
        <span class="title">DevMind</span>
      </router-link>
    </div>

    <div class="navbar-menu">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Início</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/programacao" class="nav-link">Cronograma</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/patrocinadores" class="nav-link">Patrocinadores</router-link>
        </li>
      </ul>
      <button class="event-btn cta-button" @click="handleParticiparClick">Participar do Evento</button>
    </div>

    <button class="menu-toggle-btn" @click="toggleSidebar" aria-label="Abrir menu" :class="{'is-active': isSidebarActive}">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>

    <aside class="sidebar" :class="{ 'sidebar-active': isSidebarActive }">
      <div class="sidebar-header">
        <span class="sidebar-title">DevMind</span>
        <button class="close-btn" @click="toggleSidebar" aria-label="Fechar menu">&times;</button>
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-item">
          <router-link to="/" class="sidebar-link" @click="closeSidebarAndNavigate('/')">Início</router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/programacao" class="sidebar-link" @click="closeSidebarAndNavigate('/programacao')">Programação</router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/patrocinadores" class="sidebar-link" @click="closeSidebarAndNavigate('/patrocinadores')">Patrocinadores</router-link>
        </li>
        <li class="sidebar-item">
          <a href="#outras-edicoes" class="sidebar-link" @click="closeSidebarAndHandleLink('#outras-edicoes')">Outras Edições</a>
        </li>
        <li class="sidebar-item sidebar-cta-item">
          <button class="cta-button sidebar-cta-button" @click="handleParticiparClickSidebar">Participar do Evento</button>
        </li>
      </ul>
    </aside>

    <div class="overlay" :class="{ 'overlay-active': isSidebarActive }" @click="toggleSidebar"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isSidebarActive = ref(false);
const isNavbarVisible = ref(true);
const isScrolled = ref(false);
const lastScrollPosition = ref(0);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
  if (isSidebarActive.value) {
    document.body.style.overflow = 'hidden'; // Impede scroll do body quando sidebar está aberta
  } else {
    document.body.style.overflow = '';
  }
};

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset;

  if (currentScrollPosition > 50) { // Adiciona classe 'navbar-scrolled' após rolar um pouco
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }

  // Lógica para esconder/mostrar navbar
  if (currentScrollPosition <= 50) { // Sempre visível no topo
    isNavbarVisible.value = true;
  } else if (currentScrollPosition > lastScrollPosition.value) { // Rolando para baixo
    isNavbarVisible.value = false;
  } else { // Rolando para cima
    isNavbarVisible.value = true;
  }
  lastScrollPosition.value = currentScrollPosition < 0 ? 0 : currentScrollPosition; // Garante que não seja negativo (iOS bounce)
};

// Para <router-link> na sidebar
const closeSidebarAndNavigate = (path: string) => {
  // A navegação é feita pelo router-link, aqui apenas fechamos a sidebar
  if (isSidebarActive.value) {
    // Adiciona um pequeno delay para permitir que a navegação comece antes do overflow ser restaurado
    // Isso pode ajudar a evitar "pulos" visuais em algumas transições de rota
    setTimeout(() => {
        toggleSidebar();
    }, 50);
  }
};

// Para links <a> ou ações específicas na sidebar
const closeSidebarAndHandleLink = (target: string, isExternal: boolean = false) => {
  if (isExternal) {
    window.open(target, '_blank');
  } else {
    // Exemplo para âncora:
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Elemento âncora não encontrado: ${target}`);
      // Se for um placeholder ou link para outra página não SPA, trate aqui
      // router.push(target); // Se 'target' for um path de rota
    }
  }
  if (isSidebarActive.value) {
    toggleSidebar();
  }
};


const handleParticiparClick = () => {
  console.log("Botão 'Participar do Evento' (Hero) clicado");
  window.open("https://www.even3.com.br/devmind-571467/", "_blank");
};

const handleParticiparClickSidebar = () => {
  console.log("Botão 'Participar do Evento' (Hero) clicado");
  window.open("https://www.even3.com.br/devmind-571467/", "_blank");
};


onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  lastScrollPosition.value = window.pageYOffset;
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = ''; // Restaura o scroll do body
});

// Observa mudanças de rota para fechar a sidebar, caso ela esteja aberta (ex: usando botões de voltar/avançar do navegador)
watch(() => route.path, () => {
  if (isSidebarActive.value) {
    // Apenas fecha a sidebar, a navegação já ocorreu
    toggleSidebar();
  }
});

</script>

<style scoped lang="scss">
// Suas variáveis globais (assumindo que estão disponíveis globalmente ou importe-as)
// Se não estiverem globais, descomente e use estas ou importe seu arquivo de variáveis:
// @import '@/styles/variables.scss'; // Exemplo de importação
/*
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-texto: #333333;
$breakpoint-tablet: 768px;
*/

// Usando as variáveis diretamente para este exemplo funcionar isoladamente
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-texto: #333333;
$breakpoint-tablet: 768px; // Ponto de quebra para o menu mobile

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem; // Padding ajustado
  background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s ease, transform 0.3s ease-in-out, box-shadow 0.3s ease;
  z-index: 1000;

  &.navbar-scrolled {
    background-color: rgba($principal, 0.97); // Fundo mais sólido ao rolar
    box-shadow: 0 2px 10px rgba($preto, 0.15);
  }

  &.navbar-hidden {
    transform: translateY(-100%);
  }
}

.navbar-brand {
  .brand-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    &:hover .title {
      color: $destaque;
    }
  }
  .logo {
    height: 40px; // Tamanho do logo
    width: auto;
    margin-right: 0.75rem;
    transition: transform 0.3s ease;
    &:hover {
      transform: rotate(-10deg) scale(1.1);
    }
  }
  .title {
    font-size: 1.6rem; // Tamanho do título
    font-weight: 700;
    color: $branco;
    letter-spacing: -0.5px;
    transition: color 0.3s ease;
  }
}

.navbar-menu {
  display: flex;
  align-items: center;
  @media (max-width: $breakpoint-tablet) {
    display: none;
  }
}

.nav-list {
  display: flex;
  gap: 1.8rem; // Espaçamento entre itens
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  color: $branco;
  padding: 0.5rem 0.25rem;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -2px; // Posição da linha
    left: 50%;
    transform: translateX(-50%);
    background-color: $destaque;
    transition: width 0.3s ease;
  }

  &:hover,
  &.router-link-exact-active { // router-link-exact-active para o link exato da home
    color: $destaque;
    &::after {
      width: 100%;
    }
  }
  // Para 'Programação' e 'Patrocinadores' ficarem ativos mesmo em sub-rotas (se houver)
  &.router-link-active:not(.router-link-exact-active) {
    color: lighten($destaque, 10%); // Um pouco diferente para rotas filhas ativas
     &::after {
      width: 70%; // Linha um pouco menor para rotas filhas
    }
  }
}

.cta-button {
  padding: 0.6rem 1.25rem;
  background-color: $destaque;
  border: 2px solid $destaque;
  color: $principal;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: darken($destaque, 8%);
    border-color: darken($destaque, 8%);
    color: $complemento;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba($destaque, 0.35);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba($destaque, 0.25);
  }
}

.event-btn {
  @extend .cta-button;
  margin-left: 2rem;
}

.menu-toggle-btn {
  display: none;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1250; // Garante que esteja acima da navbar mas abaixo da sidebar aberta
  position: relative; 

  .hamburger-box {
    width: 28px; // Tamanho do container do hambúrguer
    height: 22px; // Altura do container
    display: inline-block;
    position: relative;
  }

  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    width: 28px;
    height: 3px; // Espessura das barras
    background-color: $branco;
    border-radius: 3px;
    position: absolute;
    transition: transform 0.25s ease-in-out, background-color 0.25s ease-in-out;
  }

  .hamburger-inner {
    top: 50%;
    transform: translateY(-50%);
    // Cor da barra do meio quando o X está ativo (sidebar clara)
    &.is-active { background-color: $principal; }
  }

  .hamburger-inner::before,
  .hamburger-inner::after {
    content: '';
    display: block;
  }

  .hamburger-inner::before {
    top: -8px; // Espaçamento entre barras
  }

  .hamburger-inner::after {
    bottom: -8px; // Espaçamento
  }

  // Animação para 'X'
  &.is-active .hamburger-inner {
    transform: rotate(45deg);
    background-color: $principal; // Cor do X (se sidebar for clara)
  }
  &.is-active .hamburger-inner::before {
    top: 0;
    transform: rotate(-90deg);
    background-color: $principal;
  }
  &.is-active .hamburger-inner::after {
    bottom: 0;
    transform: rotate(90deg); // Esconde fazendo rotacionar para o mesmo lugar da barra do meio
    opacity: 0; // Ou simplesmente opacidade 0
  }

  @media (max-width: $breakpoint-tablet) {
    display: block;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  right: -100%; // Começa fora da tela
  width: min(85vw, 320px); // Usa vw para ser mais responsivo, com um máximo
  height: 100dvh; // Usa dvh para altura em mobile browsers
  background-color: $branco;
  transition: right 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba($preto, 0.1);

  &.sidebar-active {
    right: 0;
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem; // Padding ajustado
  border-bottom: 1px solid #eaeaea;

  .sidebar-title {
    font-size: 1.4rem; // Tamanho ajustado
    font-weight: 600;
    color: $principal;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 2.2rem; // Tamanho do X
  color: $complementoCLaro;
  padding: 0.5rem;
  line-height: 1;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
  &:hover {
    color: $principal;
    transform: rotate(90deg);
  }
}

.sidebar-nav {
  list-style: none;
  padding: 1rem 1.5rem; // Padding ajustado
  margin: 0;
  flex-grow: 1;
  overflow-y: auto; // Para caso de muitos itens
}

.sidebar-item {
  margin-bottom: 0.25rem; // Menor margem
  &:last-child {
    margin-bottom: 0;
  }
}

.sidebar-link {
  text-decoration: none;
  font-size: 1.05rem; // Tamanho ajustado
  font-weight: 500;
  color: $cinza-texto;
  padding: 0.8rem 0.5rem; // Melhor área de toque
  display: block;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: lighten($principal, 70%); // Fundo bem claro do principal
    color: $principal;
  }

  &.router-link-exact-active,
  &.router-link-active { // Pega links ativos e exatos
    background-color: $principal;
    color: $branco;
    font-weight: 600;
  }
}

.sidebar-cta-item {
  margin-top: auto; // Empurra o CTA para o final
  padding: 1.5rem 1.5rem 1rem 1.5rem; // Padding ajustado
  border-top: 1px solid #eaeaea; // Separador
  background-color: $branco; // Garante que o fundo não seja transparente se a lista tiver scroll
}
.sidebar-cta-button {
  @extend .cta-button;
  width: 100%;
}

.overlay {
  display: block; // Deixa sempre como block e controla com opacidade e pointer-events
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($complemento, 0.6); // Opacidade ajustada
  z-index: 1100;
  opacity: 0;
  pointer-events: none; // Não interage quando invisível
  transition: opacity 0.35s ease;

  &.overlay-active {
    opacity: 1;
    pointer-events: auto; // Permite clique quando ativo
  }
}
</style>