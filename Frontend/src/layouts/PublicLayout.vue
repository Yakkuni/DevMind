<template>
  <div>
    <NavBarComponent />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import NavBarComponent from '../components/NavBarComponent.vue';
import Footer from '../components/Footer.vue';
</script>
