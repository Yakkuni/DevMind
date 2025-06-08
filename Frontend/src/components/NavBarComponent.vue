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
          <router-link to="/" class="nav-link" exact>Início</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/programacao" class="nav-link">Programação</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/patrocinadores" class="nav-link">Patrocinadores</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/sobreNos" class="nav-link">Sobre Nós</router-link>
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
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-item">
          <router-link to="/" class="sidebar-link" @click="closeSidebarAndNavigate('/')" exact>Início</router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/programacao" class="sidebar-link" @click="closeSidebarAndNavigate('/programacao')">Programação</router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/patrocinadores" class="sidebar-link" @click="closeSidebarAndNavigate('/patrocinadores')">Patrocinadores</router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/sobreNos" class="sidebar-link" @click="closeSidebarAndNavigate('/sobreNos')">Sobre Nós</router-link>
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
  document.body.style.overflow = isSidebarActive.value ? 'hidden' : '';
};

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset;
  isScrolled.value = currentScrollPosition > 50;
  if (currentScrollPosition <= 50) {
    isNavbarVisible.value = true;
  } else if (currentScrollPosition > lastScrollPosition.value) {
    isNavbarVisible.value = false;
  } else {
    isNavbarVisible.value = true;
  }
  lastScrollPosition.value = currentScrollPosition <= 0 ? 0 : currentScrollPosition;
};

const closeSidebarAndNavigate = () => {
  if (isSidebarActive.value) {
    toggleSidebar();
  }
};

// A função `closeSidebarAndHandleLink` foi REMOVIDA daqui por não ser mais necessária

const handleParticiparClick = () => {
  window.open("https://www.even3.com.br/devmind-571467/", "_blank");
};
const handleParticiparClickSidebar = () => {
  handleParticiparClick();
  if (isSidebarActive.value) {
    toggleSidebar();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  document.body.style.overflow = '';
});

watch(() => route.path, () => {
  if (isSidebarActive.value) {
    toggleSidebar();
  }
});
</script>

<style scoped lang="scss">
// Suas variáveis
$principal: #2C2966;
$complemento: #131047;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$breakpoint-tablet: 850px;

.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1.5rem; background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: background-color 0.3s ease, transform 0.3s ease-in-out, box-shadow 0.3s ease;
  z-index: 1000;
}
.navbar-scrolled {
  background-color: rgba($principal, 0.95);
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 10px rgba($preto, 0.15);
  border-bottom-color: rgba($branco, 0.1);
}
.navbar-hidden {
  transform: translateY(-100%);
}
.navbar-brand {
  .brand-link {
    display: flex; align-items: center; text-decoration: none;
    &:hover .title { color: $destaque; }
  }
  .logo {
    height: 50px; width: auto; margin-right: 0.9rem; transition: transform 0.3s ease;
    &:hover { transform: rotate(-10deg) scale(1.1); }
  }
  .title {
    font-size: 2rem; font-weight: 700; color: $branco;
    letter-spacing: -0.5px; transition: color 0.3s ease;
  }
}
.navbar-menu {
  display: flex; align-items: center;
  @media (max-width: $breakpoint-tablet) {
    display: none;
  }
}
.nav-list {
  display: flex; gap: 2.2rem; list-style: none;
  margin: 0; padding: 0;
}
.nav-link {
  text-decoration: none; font-weight: 500; font-size: 1rem;
  color: $branco; padding: 0.5rem 0.25rem; position: relative;
  transition: color 0.3s ease;
  &::after {
    content: ''; position: absolute; width: 0; height: 2px;
    bottom: -2px; left: 50%; transform: translateX(-50%);
    background-color: $destaque; transition: width 0.3s ease;
  }
  &:hover { color: $destaque; &::after { width: 100%; }}
  &.router-link-exact-active {
    color: $destaque; font-weight: 700;
    &::after { width: 100%; }
  }
}
.cta-button {
  padding: 0.6rem 1.25rem; background-color: $destaque;
  border: 2px solid $destaque; color: $principal;
  font-weight: 600; font-size: 0.95rem; border-radius: 25px;
  cursor: pointer; transition: all 0.3s ease;
  text-decoration: none; display: inline-block; text-align: center; white-space: nowrap;
  &:hover {
    background-color: darken($destaque, 8%);
    border-color: darken($destaque, 8%);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba($destaque, 0.35);
  }
}
.event-btn {
  margin-left: 2.2rem;
}

/* --- INÍCIO DA CORREÇÃO DO ÍCONE DO MENU --- */
.menu-toggle-btn {
  display: none;
  background: transparent; border: none; padding: 0.5rem;
  cursor: pointer; z-index: 1250; position: relative;
  width: 40px;
  height: 40px;

  .hamburger-box {
    width: 30px; height: 24px; display: inline-block; position: relative;
  }
  .hamburger-inner,
  .hamburger-inner::before,
  .hamburger-inner::after {
    content: '';
    width: 30px; height: 3px; background-color: $branco;
    border-radius: 3px; position: absolute; left: 0;
    transition: transform 0.3s ease-in-out, top 0.3s ease-in-out, bottom 0.3s ease-in-out, background-color 0.3s ease-in-out;
  }
  
  // Posição inicial das 3 linhas
  .hamburger-inner {
    top: 50%;
    transform: translateY(-50%);
  }
  .hamburger-inner::before {
    top: 0;
  }
  .hamburger-inner::after {
    bottom: 0;
  }
  
  // --- NOVA ANIMAÇÃO QUANDO O MENU ESTÁ ATIVO ---
  &.is-active {
    .hamburger-inner {
      // A linha do meio se torna invisível
      background-color: transparent;
    }
    .hamburger-inner::before {
      // A linha de cima desce para o meio e rotaciona 45 graus
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      background-color: $principal; 
    }
    .hamburger-inner::after {
      // A linha de baixo sobe para o meio e rotaciona -45 graus
      bottom: 50%;
      transform: translateY(50%) rotate(-45deg);
      background-color: $principal;
    }
  }
  
  @media (max-width: $breakpoint-tablet) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
/* --- FIM DA CORREÇÃO --- */

.sidebar {
  position: fixed; top: 0; right: -100%; width: min(85vw, 320px);
  height: 100dvh; background-color: $branco;
  transition: right 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1200; display: flex; flex-direction: column;
  box-shadow: -5px 0 15px rgba($preto, 0.1);
  &.sidebar-active { right: 0; }
}
.sidebar-header {
  display: flex; justify-content: center; align-items: center;
  padding: 1.2rem 1.5rem; border-bottom: 1px solid #eaeaea;
  .sidebar-title { font-size: 1.6rem; font-weight: 700; color: $principal; }
}
.sidebar-nav {
  list-style: none; padding: 1rem 1.5rem; margin: 0;
  flex-grow: 1; overflow-y: auto;
}
.sidebar-item {
  margin-bottom: 0.35rem;
  &:last-child { margin-bottom: 0; }
}
.sidebar-link {
  text-decoration: none; font-size: 1.15rem; font-weight: 500;
  color: #333333; padding: 0.9rem 0.5rem; display: block;
  border-radius: 4px; transition: background-color 0.2s ease, color 0.2s ease;
  &:hover { background-color: lighten($principal, 70%); color: $principal; }
  &.router-link-exact-active {
    background-color: $principal; color: $branco; font-weight: 600;
  }
}
.sidebar-cta-item {
  margin-top: auto; padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-top: 1px solid #eaeaea; background-color: $branco;
}
.sidebar-cta-button {
  @extend .cta-button; width: 100%; font-size: 1rem;
}
.overlay {
  display: block; position: fixed; top: 0; left: 0; width: 100%;
  height: 100%; background: rgba($complemento, 0.6);
  z-index: 1100; opacity: 0; pointer-events: none;
  transition: opacity 0.35s ease;
  &.overlay-active { opacity: 1; pointer-events: auto; }
}
</style>