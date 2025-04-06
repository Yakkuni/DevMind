<template>
  <nav class="navbar">
    <!-- Logo e título -->
    <div class="navbar-left">
      <img class="logo" src="@/assets/DevMindIcon.png" alt="Logo do Evento" />
      <span class="title">DevMind</span>
    </div>

    <!-- Links de navegação -->
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

    <!-- Menu hambúrguer -->
    <button class="menu-btn" @click="toggleSidebar">☰</button>

    <!-- Sidebar -->
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
          <a href="#" class="sidebar-link">Participar do Evento</a>
        </li>
      </ul>
    </div>

    <!-- Overlay -->
    <div class="overlay" :class="{ 'overlay-active': isSidebarActive }" @click="toggleSidebar"></div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isSidebarActive = ref(false);

const toggleSidebar = () => {
  isSidebarActive.value = !isSidebarActive.value;
};
</script>

<style scoped lang="scss">
/* Estilos gerais da navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 60px;
  height: auto;
  margin-right: 1rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.nav-list {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  cursor: pointer;
  
  .nav-link {
    text-decoration: none;
    font-weight: 500;
    color: #fff;
    transition: all 0.3s ease;
    
    &.router-link-exact-active {
      border-bottom: 2px solid #fff;
    }
  }
}

.event-btn {
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #333;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #333;
    color: #fff;
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0,0,0,0.2);
  transition: right 0.3s ease;
  z-index: 1000;

  &.sidebar-active {
    right: 0;
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  display: block;
  margin: 1rem;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.sidebar-item {
  margin-bottom: 1rem;
  cursor: pointer;
  
  .sidebar-link {
    text-decoration: none;
    font-weight: 500;
    color: #333;
    display: block;
    padding: 0.5rem 1rem;
    
    &.router-link-exact-active {
      color: #4361ee;
      font-weight: bold;
    }
  }
}

/* Restante dos estilos permanece igual */
.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 999;

  &.overlay-active {
    display: block;
  }
}

@media (max-width: 768px) {
  .nav-list, .event-btn {
    display: none;
  }
  .menu-btn {
    display: block;
  }
}
</style>