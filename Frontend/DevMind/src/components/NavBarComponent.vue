<template>
  <nav class="navbar" :class="{ 'navbar-hidden': !isNavbarVisible }">
    <!-- Logo e título -->
    <div class="navbar-left">
      <img class="logo" src="@/assets/DevMindIcon.png" alt="Logo do Evento" />
      <span class="title">DevMind</span>
    </div>

    <!-- Links desktop -->
    <div class="navbar-right">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Início</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/programacao" class="nav-link">Programação</router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Patrocinadores</a>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link">Outras Edições</a>
        </li>
      </ul>
      <button class="event-btn">Participar do Evento</button>
    </div>

    <!-- Botão hambúrguer -->
    <button class="menu-btn" @click="toggleSidebar">☰</button>

    <!-- Sidebar mobile -->
    <div class="sidebar" :class="{ 'sidebar-active': isSidebarActive }">
      <button class="close-btn" @click="toggleSidebar">×</button>
      <ul class="sidebar-nav">
        <li class="sidebar-item" @click="toggleSidebar">
          <router-link to="/" class="sidebar-link">Início</router-link>
        </li>
        <li class="sidebar-item" @click="toggleSidebar">
          <router-link to="/programacao" class="sidebar-link">Programação</router-link>
        </li>
        <li class="sidebar-item" @click="toggleSidebar">
          <a href="#" class="sidebar-link">Patrocinadores</a>
        </li>
        <li class="sidebar-item" @click="toggleSidebar">
          <a href="#" class="sidebar-link">Outras Edições</a>
        </li>
        <li class="sidebar-item" @click="toggleSidebar">
          <a href="#" class="participar-link">Participar do Evento</a>
        </li>
      </ul>
    </div>

    <!-- Overlay -->
    <div class="overlay" :class="{ 'overlay-active': isSidebarActive }" @click="toggleSidebar"></div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isSidebarActive = ref(false);
const isNavbarVisible = ref(true);
const previousScroll = ref(window.pageYOffset);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};

const handleScroll = () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > previousScroll.value && currentScroll > 100) {
    isNavbarVisible.value = false;
  } else if (currentScroll < previousScroll.value) {
    isNavbarVisible.value = true;
  }
  previousScroll.value = currentScroll;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="scss">
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  background-color: rgba(0, 0, 0, 0.8);
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 1100;
}

.navbar-hidden {
  transform: translateY(-100%);
  opacity: 0;
}

.navbar-left {
  display: flex;
  align-items: center;
}
.logo {
  width: 60px;
  margin-right: 1rem;
}
.title {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

.navbar-right {
  display: flex;
  align-items: center;
}
.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
}
.nav-link {
  text-decoration: none;
  font-weight: 500;
  color: #fff;
  transition: 0.3s;
  &.router-link-exact-active {
    border-bottom: 2px solid #fff;
  }
}

.event-btn {
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #fff;
  font-weight: bold;
  color: #fff;
  transition: background 0.3s ease;
  &:hover {
    background: #fff;
    color: #000;
  }
}

/* Menu hambúrguer */
.menu-btn {
  display: none;
  border: none;
  background: #ffffff00;
  font-size: 2rem;
  cursor: pointer;
  color: #fff;
}

/* Sidebar mobile */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  background-color: #fff;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1200;
  display: flex;
  flex-direction: column;
  padding: 1rem;

  &.sidebar-active {
    transform: translateX(0);
  }
}

.close-btn {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 4rem;
  cursor: pointer;
}

.sidebar-nav {
  list-style: none;
  margin-top: 0rem;
  padding: 0;
}

.sidebar-item {
  margin-bottom: 1.5rem;
}

.sidebar-link {
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  display: block;
}

.participar-link {
  background-color: black;
  color: #fff;
  padding: 0.75rem 1rem;
  text-align: center;
  border-radius: 4px;
  font-weight: bold;
  display: block;
  text-decoration: none;
}

/* Overlay */
.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1100;

  &.overlay-active {
    display: block;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-list,
  .event-btn {
    display: none;
  }
  .menu-btn {
    display: block;
  }
}
</style>
