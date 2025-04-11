<script setup lang="ts">
import Footer from './components/Footer.vue';


</script>

<template>
  <div class="app-wrapper">
    <main class="main-content">
      <router-view />
    </main>
    
    <Footer />
  </div>
</template>

<style scoped lang="scss" >

</style>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  overflow-x: hidden;
}
</style>