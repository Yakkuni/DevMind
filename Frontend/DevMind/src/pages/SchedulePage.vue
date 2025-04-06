<template>
    <NavBarComponent/>
    <section class="programming-header">
      <div 
        class="header-background" 
        :style="{ backgroundImage: `url('${backgroundImage}')` }"
      ></div>
      <div 
        class="header-overlay" 
        :style="{ backgroundColor: overlayColor }"
      ></div>
      
      <div class="header-content">
        <h1>{{ title }}</h1>
        <img 
          class="header-icon" 
          :src="svgIcon" 
          :alt="iconAlt"
        >
      </div>
    </section>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  
  const props = defineProps({
    backgroundImage: {
      type: String,
      default: '/2024/assets/headerBackground-DNBneTLJ.png'
    },
    overlayColor: {
      type: String,
      default: 'rgb(72, 12, 168)' // #480ca8
    },
    title: {
      type: String,
      default: 'Programação'
    },
    iconAlt: {
      type: String,
      default: 'Ícone de programação'
    }
  });
  
  // SVG como string codificada (pode ser importado como componente separado se preferir)
  import NavBarComponent from '../components/NavBarComponent.vue';
  const svgIcon = computed(() => `data:image/svg+xml,%3csvg%20width='481'%20height='196'%20viewBox='0%200%20481%20196'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M474.347%2061.042L0.797445%2040.9758L45.9911%20160.349L460.869%20132.213L474.347%2061.042Z'%20fill='%234361EE'/%3e%3cpath%20d='M45%2066.1096L459%2027L392.028%20162L61.1719%20131.427L45%2066.1096Z'%20fill='%23F72585'/%3e%3cg%20clip-path='url(%23clip0_1591_1501)'%3e%3cpath%20d='M398.575%20192.614C394.769%20184.444%20390.964%20176.275%20387.158%20168.105L385.352%20170.013C393.55%20172.526%20401.749%20175.039%20409.948%20177.552L410.242%20174.814C407.914%20175.201%20405.588%20175.597%20403.263%20176.001C401.214%20176.357%20398.662%20176.55%20398.01%20178.937C397.731%20179.959%20397.724%20181.063%20397.629%20182.114C397.519%20183.339%20397.408%20184.565%20397.298%20185.791C397.085%20188.148%20396.872%20190.505%20396.659%20192.862C396.494%20194.69%20399.321%20195.006%20399.486%20193.178C399.869%20188.935%20400.224%20184.689%20400.635%20180.449C400.698%20179.798%20400.687%20179.444%20401.359%20179.245C402.283%20178.97%20403.299%20178.887%20404.248%20178.722C406.387%20178.352%20408.528%20177.988%20410.67%20177.632C411.997%20177.411%20412.377%20175.326%20410.964%20174.893C402.766%20172.38%20394.567%20169.867%20386.368%20167.354C385.24%20167.008%20384.011%20168.079%20384.562%20169.261C388.367%20177.431%20392.173%20185.601%20395.979%20193.77C396.752%20195.431%20399.351%20194.28%20398.575%20192.614Z'%20fill='%23F72585'/%3e%3c/g%3e%3cg%20clip-path='url(%23clip1_1591_1501)'%3e%3cpath%20d='M56.2735%2030.9653C62.0494%2032.6203%2067.8254%2034.2753%2073.6014%2035.9303L72.5338%2037.3194C70.0239%2032.1801%2067.5139%2027.0408%2065.004%2021.9015L66.7763%2021.4217C66.764%2022.9959%2066.7463%2024.57%2066.7228%2026.144C66.702%2027.5311%2066.841%2029.2326%2065.3377%2029.9107C64.6937%2030.2013%2063.9678%2030.3207%2063.2857%2030.4929C62.4902%2030.6936%2061.6947%2030.8943%2060.8992%2031.0951C59.3694%2031.4811%2057.8396%2031.8672%2056.3098%2032.2532C55.1236%2032.5526%2054.6207%2030.7231%2055.807%2030.4237C58.5605%2029.7289%2061.3194%2029.0524%2064.0681%2028.3391C64.4905%2028.2294%2064.7241%2028.1998%2064.7854%2027.7368C64.8699%2027.099%2064.819%2026.4212%2064.8282%2025.7788C64.8491%2024.3306%2064.8649%2022.8824%2064.8762%2021.4342C64.8832%2020.5366%2066.2162%2020.0691%2066.6485%2020.9544C69.1585%2026.0937%2071.6685%2031.233%2074.1784%2036.3723C74.5239%2037.0798%2073.9468%2038.001%2073.1109%2037.7615C67.3349%2036.1065%2061.5589%2034.4515%2055.7829%2032.7965C54.6087%2032.4601%2055.0955%2030.6278%2056.2735%2030.9653Z'%20fill='%234361EE'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1591_1501'%3e%3crect%20width='22.2726'%20height='30'%20fill='white'%20transform='matrix(0.913498%20-0.406842%200.406631%200.913592%20384%20168)'/%3e%3c/clipPath%3e%3cclipPath%20id='clip1_1591_1501'%3e%3crect%20width='14.8555'%20height='20'%20fill='white'%20transform='matrix(0.258744%20-0.965946%20-0.965906%20-0.258894%2074%2038)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e`);
  </script>
  
  <style scoped>
  .programming-header {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
  }
  
  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }
  
  .header-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.9;
  }
  
  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: white;
    text-align: center;
    padding: 20px;
  }
  
  .header-content h1 {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .header-icon {
    width: 200px;
    height: auto;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
  }
  
  @media (max-width: 768px) {
    .header-content h1 {
      font-size: 2.5rem;
    }
    
    .header-icon {
      width: 150px;
    }
  }
  </style>