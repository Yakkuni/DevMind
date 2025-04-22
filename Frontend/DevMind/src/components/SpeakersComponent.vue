<template>
    <div class="carousel-container">
      <!-- Prev -->
      <button class="nav-button prev" @click="prevSlide">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
  
      <!-- Track -->
      <div
        class="carousel-track"
        :style="{
          transform: `translateX(${trackPosition}%)`,
          transition: isAnimating ? 'transform 0.5s ease' : 'none'
        }"
        @transitionend="onTransitionEnd"
      >
        <div
          v-for="(sp, idx) in speakers"
          :key="idx"
          class="carousel-item"
        >
          <div class="speaker-card">
            <div class="label">palestrante confirmado</div>
            <img :src="sp.photo" :alt="sp.name" class="photo" />
            <div class="name">{{ sp.name }}</div>
          </div>
        </div>
      </div>
  
      <!-- Next -->
      <button class="nav-button next" @click="nextSlide">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
        </svg>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
  
  interface Speaker { name: string; photo: string; }
  const initial: Speaker[] = [
    { name: 'Marie Curie',   photo: '/src/assets/Speakers/Marie.jpg' },
    { name: 'Alan Turing',   photo: '/src/assets/Speakers/Alan.jpg' },
    { name: 'H.P Lovecraft', photo: '/src/assets/Speakers/Hp.jpg' },
    { name: 'H.P Lovecraft', photo: '/src/assets/Speakers/Hp.jpg' },
    { name: 'H.P Lovecraft', photo: '/src/assets/Speakers/Hp.jpg' },
    { name: 'H.P Lovecraft', photo: '/src/assets/Speakers/Hp.jpg' },
    // …
  ];
  
  const speakers = ref<Speaker[]>([...initial]);
  
  // Detecta mobile
  const isMobile = ref(window.matchMedia('(max-width: 768px)').matches);
  let mql: MediaQueryList;
  function onMq(e: MediaQueryListEvent) {
    isMobile.value = e.matches;
    resetCarousel();
  }
  onMounted(() => {
    mql = window.matchMedia('(max-width: 768px)');
    mql.addEventListener('change', onMq);
  });
  onBeforeUnmount(() => {
    mql.removeEventListener('change', onMq);
  });
  
  // Estado de animação e posição do track
  const isAnimating = ref(false);
  const trackPosition = ref(0); // percent
  
  // Cada slide ocupa 100% (mobile) ou 33.333% (desktop)
  const slidePct = computed(() => isMobile.value ? 100 : 100 / 3);
  
  // Autoplay
  const interval = ref<number>();
  const autoTime = computed(() => isMobile.value ? 3000 : 5500);
  function startAuto() {
    clearInterval(interval.value);
    interval.value = window.setInterval(nextSlide, autoTime.value);
  }
  function resetCarousel() {
    clearInterval(interval.value);
    // volta à posição central
    trackPosition.value = 0;
    isAnimating.value = false;
    startAuto();
  }
  onMounted(startAuto);
  onBeforeUnmount(() => clearInterval(interval.value));
  
  // Avança um slide
  function nextSlide() {
    if (isAnimating.value) return;
    isAnimating.value = true;
    // anima de 0% → -slidePct
    trackPosition.value = -slidePct.value;
  }
  
  // Volta um slide
  function prevSlide() {
    if (isAnimating.value) return;
    // antes de animar, rodamos o último elemento para a frente
    clearInterval(interval.value);
    speakers.value.unshift(speakers.value.pop()!);
    // reposiciona sem animação em -n
    isAnimating.value = false;
    trackPosition.value = -slidePct.value;
    // força reflow
    void (document.querySelector('.carousel-track') as HTMLElement).offsetWidth;
    // agora anima para 0%
    isAnimating.value = true;
    trackPosition.value = 0;
    startAuto();
  }
  
  // Quando a transição termina no nextSlide
  function onTransitionEnd() {
    if (!isAnimating.value) return;
    // move o primeiro elemento ao fim
    speakers.value.push(speakers.value.shift()!);
    // reset sem animação para 0%
    isAnimating.value = false;
    trackPosition.value = 0;
    // forçar reflow e retomar animação
    void (document.querySelector('.carousel-track') as HTMLElement).offsetWidth;
    startAuto();
  }
  
  // Ajusta quando muda breakpoint
  watch(slidePct, () => {
    resetCarousel();
  });
  </script>
  
  <style scoped lang="scss">
  .carousel-container {
    position: relative;
    overflow: hidden;
    max-width: 950px;
    width: 80%;
    margin: 0 auto;
    padding: 2rem 0;
  }
  
  .carousel-track {
    display: flex;
  }
  
  .carousel-item {
    /* mobile: ocupa 100% do container */
    flex: 0 0 100%;
    max-width: 250px;
    margin: 0 auto;
    padding: 0 0.5rem;
    box-sizing: border-box;
  
    @media (min-width: 769px) {
      /* desktop: 3 por linha */
      flex: 0 0 33.333%;
      max-width: none;
      padding: 0 1rem;
    }
  }
  
  .speaker-card {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: box-shadow 0.3s, transform 0.3s;
    aspect-ratio: 3 / 4;
  
    .photo {
      width: 175px;
      height: 175px;
      object-fit: cover;
      border-radius: 50%;
      margin: 0.7rem auto;
      display: block;
    }
  
    /* label abaixo da foto */
    .label {
      display: block;
      margin: 0.5rem auto;
      font-size: 0.75rem;
      color: #666;
    }
  
    .name {
      margin-top: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }
  
    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      transform: translateY(-4px);
    }
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 50%;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s;
  
    svg {
      color: #333;
      display: block;
    }
  
    &:hover {
      background: #333;
    }
  
    &.prev {
      left: 0.5rem;
    }
    &.next {
      right: 0.5rem;
    }
  }
  </style>
  