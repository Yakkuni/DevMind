<template>
  <div class="programming-page">
    <!-- Header -->
    <section
      class="programming-header"
      :style="{ backgroundImage: `url('${backgroundImage}')` }"
    >
      <div class="header-overlay" :style="{ backgroundColor: overlayColor }"></div>
      <div class="header-content">
        <h1>{{ title }}</h1>
      </div>
    </section>

    <!-- Seletor de Datas -->
    <section class="date-selector">
      <div class="date-buttons">
        <button 
          v-for="(date, index) in dates" 
          :key="index" 
          :class="{ active: selectedDate === date }" 
          @click="selectedDate = date">
          {{ date }}
        </button>
      </div>
    </section>

    <!-- Lista de Atividades -->
    <section class="schedule">
      <div 
        v-for="(event, index) in schedules[selectedDate]" 
        :key="index" 
        class="activity-card"
      >
        <div class="activity-header">
          <h2 class="activity-title">{{ event.title }}</h2>
        </div>
        <div class="activity-info">
          <div class="activity-time">
            <i class="mdi mdi-alarm"></i>
            <span>{{ event.time }}</span>
          </div>
          <div class="activity-location">
            <i class="mdi mdi-map-marker"></i>
            <span>{{ event.location }}</span>
          </div>
        </div>
        <p class="activity-description">{{ event.description }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const backgroundImage = '/path/to/your/placeholder-background.jpg'; // Substitua pelo caminho da imagem desejada.
const overlayColor = 'rgba(72, 12, 168, 0.7)'; // Cor principal do evento com opacidade.
const title = 'Programação';

// Datas de exemplo com rótulo mais descritivo
const dates = ref([
  '11/11 - Segunda-feira',
  '12/11 - Terça-feira',
  '13/11 - Quarta-feira'
]);

// Seleciona a primeira data por padrão.
const selectedDate = ref(dates.value[0]);

interface EventItem {
  title: string;
  time: string;
  location: string;
  description: string;
}

// Exemplo de agenda para cada data (atividades ordenadas por horário)
const schedules: Record<string, EventItem[]> = {
  '11/11 - Segunda-feira': [
    {
      title: 'Credenciamento',
      time: '08:00 às 09:00',
      location: 'Entrada do IFCE',
      description: 'Recepção dos participantes e distribuição de credenciais.'
    },
    {
      title: 'Falas das Diretorias',
      time: '09:00 às 09:30',
      location: 'Auditório Principal',
      description: 'Discurso inicial das diretorias do evento.'
    }
  ],
  '12/11 - Terça-feira': [
    {
      title: 'Credenciamento',
      time: '13:30 às 14:30',
      location: 'Entrada do IFCE',
      description: 'Recepção e credenciamento com entrega de materiais.'
    },
    {
      title: 'Abertura Oficial',
      time: '14:30 às 16:00',
      location: 'Auditório Central',
      description: 'Discurso de abertura do evento com painel de debates.'
    }
  ],
  '13/11 - Quarta-feira': [
    {
      title: 'Workshop de Desenvolvimento',
      time: '10:00 às 11:30',
      location: 'Sala de Workshop',
      description: 'Sessão prática sobre novas tecnologias e frameworks.'
    },
    {
      title: 'Painel de Discussão',
      time: '11:30 às 12:30',
      location: 'Auditório Central',
      description: 'Debate com especialistas sobre o futuro da tecnologia.'
    }
  ]
};
</script>

<style scoped lang="scss">
.programming-page {
  display: flex;
  flex-direction: column;
}

/* HEADER */
.programming-header {
  position: relative;
  width: 100%;
  height: 300px; /* Ajuste conforme necessário */
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  padding: 20px;

  h1 {
    font-size: 3rem;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

/* DATE SELECTOR */
.date-selector {
  margin: 2rem 0;
  display: flex;
  justify-content: center;

  .date-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    button {
      padding: 0.75rem 1.5rem;
      border: 1px solid #ccc;
      background-color: #f0f0f0;
      color: #333;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s, color 0.3s;
      min-width: 180px;

      &.active,
      &:hover {
        background-color: #333;
        color: #fff;
      }
    }
  }
}

/* SCHEDULE / AGENDA */
.schedule {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto 2rem;
  padding: 0 1rem;

  .activity-card {
    background-color: #fff;
    border: 1px solid #480ca8; /* Borda roxa escuro */
    border-radius: 4px;
    padding: 1.5rem; /* Aumento do padding para maior altura */
    min-height: 150px; /* Define uma altura mínima */
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .activity-title {
      font-size: 1.6rem;
      margin: 0;
      color: #333;
      font-weight: 600;
    }
  }

  .activity-info {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    align-items: center;

    .activity-time,
    .activity-location {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 1rem;
      color: #555;

      i {
        font-size: 1.2rem;
        color: #333;
      }
    }
  }

  .activity-description {
    font-size: 1rem;
    color: #555;
    margin: 0;
  }
}

/* RESPONSIVO */
@media (max-width: 768px) {
  .header-content h1 {
    font-size: 2rem;
  }
  
  .date-selector .date-buttons {
    flex-direction: column;
    align-items: center;
    
    button {
      width: 100%;
      max-width: 250px;
      text-align: center;
    }
  }
  
  .schedule .activity-card {
    .activity-info {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>