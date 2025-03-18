<template>
    <!-- Barra de navegação principal -->
    <v-app-bar
      height="64"
      color="primary"
      dark
      app
    >
      <!-- Ícone de menu (exibido apenas em dispositivos mobile) -->
      <v-app-bar-nav-icon 
        variant="text"
        icon="mdi-dots-horizontal-circle"
        @click="drawer = !drawer" 
        :ripple="false" 
        class="d-lg-none"
      />
  
      <!-- Logo / Título do evento -->
      <v-toolbar-title class="text-h6 text-uppercase">
        Dev<span style="font-weight: 300;">Mind</span>
      </v-toolbar-title>
  
      <!-- Espaço flexível para empurrar o restante dos itens para a direita -->
      <v-spacer />
  
      <!-- Menu desktop (exibido em telas grandes) -->
      <div class="d-none d-lg-flex">
        <v-btn variant="plain" :ripple="false" to="/">Início</v-btn>
        <v-btn variant="plain" :ripple="false" to="/programacao">Programação</v-btn>
        <v-btn variant="plain" :ripple="false" to="/manual">Manual</v-btn>
        <v-btn variant="plain" :ripple="false" to="/palestrantes">Palestrantes</v-btn>
        <v-btn variant="plain" :ripple="false" to="/edicoes-anteriores">Edições Anteriores</v-btn>
  
        <!-- Botão de chamada para ação (CTA) -->
        <v-btn
          variant="contained"
          color="secondary"
          class="ms-4"
          to="/inscricao"
          :ripple="false"
        >
          Participar do Evento
        </v-btn>
      </div>
    </v-app-bar>
  
    <!-- Drawer para mobile -->
    <v-navigation-drawer
      v-model="drawer"
      :scrim="false"
      temporary
      disableResizeWatcher
    >
      <v-list nav dense>
        <v-list-item
          v-for="(item, index) in navItems"
          :key="index"
          :to="item.to"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
  
      <div class="p-4">
        <v-btn
          variant="contained"
          color="secondary"
          class="w-100"
          to="/inscricao"
          @click="drawer = false"
          :ripple="false"
        >
          Participar do Evento
        </v-btn>
      </div>
    </v-navigation-drawer>
  
    <!-- Conteúdo principal -->
    <v-main>
      <router-view />
    </v-main>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface NavItem {
    title: string
    to: string
  }
  
  const drawer = ref(false)
  
  // Rotas para o menu lateral (mobile)
  const navItems: NavItem[] = [
    { title: 'Início', to: '/' },
    { title: 'Programação', to: '/programacao' },
    { title: 'Manual', to: '/manual' },
    { title: 'Palestrantes', to: '/palestrantes' },
    { title: 'Edições Anteriores', to: '/edicoes-anteriores' }
  ]
  </script>
  
  <style scoped>
  /* Ajustes de estilo (se necessário) */
  </style>
  