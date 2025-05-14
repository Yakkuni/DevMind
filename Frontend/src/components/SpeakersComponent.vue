<template>
  <div class="carousel-container">
    <button class="nav-button prev" @click="prevSlide" aria-label="Slide anterior">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>

    <div
      ref="carouselTrack"
      class="carousel-track"
      :style="{
        transform: `translate3d(${trackPosition}%, 0, 0)`,
        transition: isAnimating ? 'transform 0.3s ease-in-out' : 'none'
      }"
      @transitionend="onTransitionEnd"
    >
      <div
        v-for="sp in speakers"
        :key="sp.id"
        class="carousel-item"
      >
        <div class="speaker-card">
          <div class="label">palestrante confirmado</div>
          <img :src="sp.foto" :alt="sp.nome" class="photo" />
          <div class="name">{{ sp.nome }}</div>
          <div class="description">{{ sp.descricao }}</div>
        </div>
      </div>
    </div>

    <button class="nav-button next" @click="nextSlide" aria-label="Próximo slide">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';

interface SocialLinks {
  instagram?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
  site?: string | null;
}

interface Speaker {
  id: string;
  nome: string;
  descricao: string;
  foto: string;
  redes: SocialLinks;
}

const speakers = ref<Speaker[]>([]);
const carouselTrack = ref<HTMLElement>();
const direction = ref<'next'|'prev'>('next');
const isAnimating = ref(false);
const trackPosition = ref(0);
const isMobile = ref(window.matchMedia('(max-width: 768px)').matches);
const slidePct = computed(() => isMobile.value ? 100 : 100/3);
const interval = ref<number>();

const autoTime = computed(() => isMobile.value ? 3000 : 5500);

async function fetchSpeakers() {
  try {
    const res = await axios.get('/palestrante');
    speakers.value = res.data;
  } catch (err) {
    console.error('Erro ao carregar palestrantes:', err);
  }
}

function startAuto() {
  clearInterval(interval.value);
  interval.value = window.setInterval(nextSlide, autoTime.value);
}

function resetCarousel() {
  clearInterval(interval.value);
  trackPosition.value = 0;
  isAnimating.value = false;
  startAuto();
}

function nextSlide() {
  if (isAnimating.value) return;
  direction.value = 'next';
  isAnimating.value = true;
  trackPosition.value = -slidePct.value;
}

function prevSlide() {
  if (isAnimating.value) return;
  direction.value = 'prev';
  isAnimating.value = true;
  trackPosition.value = slidePct.value;
}

function onTransitionEnd() {
  if (!isAnimating.value) return;
  
  if (direction.value === 'next') {
    speakers.value.push(speakers.value.shift()!);
  } else {
    speakers.value.unshift(speakers.value.pop()!);
  }

  isAnimating.value = false;
  trackPosition.value = 0;
  void carouselTrack.value?.offsetWidth;
  startAuto();
}

let mql: MediaQueryList;
function onMq(e: MediaQueryListEvent) {
  isMobile.value = e.matches;
  resetCarousel();
}

onMounted(() => {
  mql = window.matchMedia('(max-width: 768px)');
  mql.addEventListener('change', onMq);
  fetchSpeakers();
  startAuto();
});

onBeforeUnmount(() => {
  mql.removeEventListener('change', onMq);
  clearInterval(interval.value);
});
</script>

<style scoped lang="scss">
.carousel-container {
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  width: 90%;
  margin: 2rem auto;
  padding: 1rem 0;

  @media (min-width: 769px) {
    padding: 2rem 0;
  }
}

.carousel-track {
  display: flex;
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  padding: 0 60px;
  margin: 0 -60px;
}

.carousel-item {
  flex: 0 0 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 0 1rem;
  box-sizing: border-box;

  @media (min-width: 769px) {
    flex: 0 0 33.333%;
    max-width: none;
  }
}

.speaker-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 350px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  }

  .label {
    font-size: 0.95rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 1.5rem;
  }

  .photo {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    margin: 1rem auto;
    border: 3px solid #fff;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  .name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0.5rem 0;
  }

  .description {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.4;
    flex-grow: 1;
    margin: 0.5rem 0;
    max-height: 120px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;

  &:hover {
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev { left: 20px; }
  &.next { right: 20px; }

  @media (max-width: 768px) {
    &.prev { left: 10px; }
    &.next { right: 10px; }
  }
}
</style>
