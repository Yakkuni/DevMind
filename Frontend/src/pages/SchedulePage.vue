<template>
  <div class="schedule-page">
    <section
      class="schedule-header"
      :style="{ backgroundImage: `url('${headerBackgroundImage}')` }"
    >
      <div class="header-overlay" :style="{ backgroundColor: headerOverlayColor }"></div>
      <div class="header-content">
        <h1>{{ pageTitle }}</h1>
      </div>
    </section>

    <section class="date-selector-section" v-if="!isLoading && availableDates.length > 0">
      <div class="date-buttons-container">
        <button
          v-for="dateDisplay in availableDates"
          :key="dateDisplay"
          class="date-button"
          :class="{ active: selectedDateKey === getCanonicalDateKey(dateDisplay) }"
          @click="selectDate(getCanonicalDateKey(dateDisplay))"
        >
          {{ dateDisplay }}
        </button>
      </div>
    </section>

    <section v-if="isLoading" class="feedback-section loading-state">
      <div class="spinner"></div>
      <p>Carregando programação...</p>
    </section>
    <section v-else-if="errorLoading" class="feedback-section error-state">
      <p>{{ errorLoading }}</p>
      <button @click="fetchSchedule" class="btn btn-retry">Tentar Novamente</button>
    </section>
    <section v-else-if="availableDates.length === 0" class="feedback-section empty-state">
      <p>Nenhuma programação disponível no momento.</p>
    </section>

    <section class="activities-list-section" v-else-if="selectedDateKey && activitiesForSelectedDate.length > 0">
      <div class="activities-container">
        <div
          v-for="activity in activitiesForSelectedDate"
          :key="activity.id"
          class="activity-card"
        >
          <div class="activity-time-slot">
            <span class="time">{{ formatTime(activity.horario) }}
              <template v-if="activity.horaFim"> - {{ activity.horaFim }}</template>
            </span>
            <span class="type" v-if="activity.tipo">{{ activity.tipo }}</span>
          </div>
          <div class="activity-details">
            <h2 class="activity-title">{{ activity.nome }}</h2>
            <p class="activity-description" v-if="activity.descricao">{{ activity.descricao }}</p>
            <div class="activity-meta">
              <div class="meta-item location" v-if="activity.local">
                <i class="mdi mdi-map-marker"></i> <span>{{ activity.local }}</span>
              </div>
              <div class="meta-item speaker" v-if="activity.conduzidoPor">
                <i class="mdi mdi-account-voice"></i> <span>{{ activity.conduzidoPor }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section v-else-if="selectedDateKey && activitiesForSelectedDate.length === 0" class="feedback-section empty-state">
      <p>Nenhuma atividade programada para {{ getDisplayDate(selectedDateKey) || 'este dia' }}.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const headerBackgroundImage = ref('/img/banners/schedule_banner.jpg');
const headerOverlayColor = ref('rgba(19, 16, 71, 0.75)'); // $complemento com opacidade
const pageTitle = ref('Programação Oficial');

// --- Tipagem ---
// Interface reflete os campos vindos da API/banco de dados
interface CronogramaItemAPI {
  id: string;
  nome: string; // Título da atividade
  descricao?: string | null;
  horario: string; // Data e hora completas (ISO string), representa o INÍCIO
  local?: string | null;
  tipo: string; // Ex: Palestra, Workshop
  conduzidoPor?: string | null; // Nome do palestrante/responsável

  // Opcional: Se sua API for modificada para enviar horaFim separadamente
  horaFim?: string | null; // Formato "HH:mm"
}

const allActivities = ref<CronogramaItemAPI[]>([]);
const availableDates = ref<string[]>([]);
const selectedDateKey = ref<string | null>(null);

const isLoading = ref(true);
const errorLoading = ref<string | null>(null);

// --- Funções de Data e Hora ---
const formatDateForDisplay = (isoDateString: string): string => {
  if (!isoDateString) return "Data inválida";
  const date = new Date(isoDateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() + userTimezoneOffset);
  if (isNaN(localDate.getTime())) return "Data inválida";
  const day = localDate.getDate().toString().padStart(2, '0');
  const month = (localDate.getMonth() + 1).toString().padStart(2, '0');
  const weekday = localDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  return `${day}/${month} - ${weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('-feira', '')}`;
};

const getCanonicalDateKey = (dateInput: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;
  const displayMatch = dateInput.match(/^(\d{2})\/(\d{2})/);
  if (displayMatch) {
    const eventYear = new Date(allActivities.value.length > 0 ? allActivities.value[0].horario : Date.now()).getFullYear();
    return `${eventYear}-${displayMatch[2]}-${displayMatch[1]}`;
  }
  const dateObj = new Date(dateInput);
  if (!isNaN(dateObj.getTime())) {
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const localDate = new Date(dateObj.getTime() + userTimezoneOffset);
    return `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;
  }
  console.warn("Não foi possível converter a data para chave canônica:", dateInput);
  return dateInput;
};

const getDisplayDate = (canonicalKey: string | null): string | null => {
    if (!canonicalKey) return null;
    const foundDate = availableDates.value.find(d => getCanonicalDateKey(d) === canonicalKey);
    return foundDate || canonicalKey;
};

// Nova função para formatar apenas a hora de início a partir do campo 'horario'
const formatTime = (isoDateString: string): string => {
  if (!isoDateString) return "HH:MM";
  const date = new Date(isoDateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() + userTimezoneOffset);
  if (isNaN(localDate.getTime())) return "HH:MM";
  const hours = localDate.getHours().toString().padStart(2, '0');
  const minutes = localDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// --- Processamento e Agrupamento de Dados ---
const groupedActivities = computed(() => {
  const groups: Record<string, CronogramaItemAPI[]> = {};
  if (!Array.isArray(allActivities.value)) return groups;

  allActivities.value.forEach(activity => {
    // CORREÇÃO: Usar activity.horario para obter a data
    if (activity && activity.horario) {
      const dateKey = getCanonicalDateKey(activity.horario);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    }
  });

  for (const dateKey in groups) {
    // CORREÇÃO: Usar activity.horario para obter a hora de início para ordenação
    groups[dateKey].sort((a, b) => {
        const timeA = formatTime(a.horario); // Formata para HH:mm para comparação consistente
        const timeB = formatTime(b.horario);
        return timeA.localeCompare(timeB);
    });
  }
  return groups;
});

const activitiesForSelectedDate = computed(() => {
  if (!selectedDateKey.value || !groupedActivities.value[selectedDateKey.value]) {
    return [];
  }
  return groupedActivities.value[selectedDateKey.value];
});

// --- Busca de Dados ---
async function fetchSchedule() {
  isLoading.value = true;
  errorLoading.value = null;
  try {
    const response = await axios.get<CronogramaItemAPI[]>('http://localhost:3000/cronograma'); // Usando URL completa por enquanto

    if (Array.isArray(response.data)) {
      allActivities.value = response.data;
    } else {
      console.warn("A API /cronograma não retornou um array. Recebido:", response.data, "Tratando como array vazio.");
      allActivities.value = [];
    }

    const uniqueDisplayDates = new Set<string>();
    if (Array.isArray(allActivities.value)) {
      allActivities.value.forEach(activity => {
        // CORREÇÃO: Usar activity.horario para formatar a data de display
        if (activity && activity.horario) {
          uniqueDisplayDates.add(formatDateForDisplay(activity.horario));
        } else {
          console.warn("Atividade inválida ou sem campo 'horario' no backend:", activity);
        }
      });
    }

    availableDates.value = Array.from(uniqueDisplayDates).sort((dateA, dateB) => {
        const keyA = getCanonicalDateKey(dateA);
        const keyB = getCanonicalDateKey(dateB);
        try {
            return new Date(keyA).getTime() - new Date(keyB).getTime();
        } catch (e) {
            console.error("Erro ao converter datas para ordenação:", keyA, keyB, e);
            return 0;
        }
    });

    if (availableDates.value.length > 0) {
      selectedDateKey.value = getCanonicalDateKey(availableDates.value[0]);
    } else {
      selectedDateKey.value = null;
    }

  } catch (err: any) {
    console.error("---------------------------------------");
    console.error("Erro no bloco catch de fetchSchedule:", err);
    let errorMessage = 'Falha ao carregar a programação. Verifique sua conexão ou tente mais tarde.';
    if (err.response) {
      console.error("Detalhes do erro da API - Data:", err.response.data);
      console.error("Detalhes do erro da API - Status:", err.response.status);
      if(err.response.status === 404) errorMessage = "Endpoint da programação não encontrado.";
      else if (err.response.status >= 500) errorMessage = "Ocorreu um erro no servidor ao buscar a programação.";
    } else if (err.request) {
      console.error("Detalhes do erro da API - Sem resposta recebida:", err.request);
      errorMessage = "Não foi possível conectar ao servidor da programação.";
    } else {
      console.error('Erro ao configurar a requisição:', err.message);
    }
    errorLoading.value = errorMessage;
    console.error("---------------------------------------");
    allActivities.value = [];
    availableDates.value = [];
    selectedDateKey.value = null;
  } finally {
    isLoading.value = false;
  }
}

const selectDate = (dateKey: string) => {
  selectedDateKey.value = dateKey;
};

onMounted(() => {
  fetchSchedule();
});

</script>

<style scoped lang="scss">
// SEU SCSS EXISTENTE (SEM MUDANÇAS SIGNIFICATIVAS AQUI, POIS O PROBLEMA ERA DE LÓGICA)
// ... (cole seu SCSS aqui) ...
// Suas variáveis globais (assumindo que estão disponíveis)
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;
$cinza-borda: #d1d5db;
$cinza-fundo-claro: #f9fafb; // Alterado para um tom ligeiramente diferente do anterior

.schedule-page {
  display: flex;
  flex-direction: column;
  background-color: $cinza-fundo-claro;
  min-height: 100vh;
}

/* Header da Página */
.schedule-header {
  position: relative;
  width: 100%;
  min-height: 300px; // Reduzido um pouco
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $branco;
  background-color: $complemento; // Fallback e cor base

  @media (max-width: 768px) {
    min-height: 220px; // Reduzido para mobile
  }
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // A cor é definida via style binding, ex: rgba($complemento, 0.75)
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 1.5rem; // Padding reduzido

  h1 {
    font-size: clamp(2rem, 5vw, 3rem); // Tamanho ajustado
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 6px rgba($preto, 0.6); // Sombra mais pronunciada
    color: $branco;
  }
}

/* Seletor de Datas */
.date-selector-section {
  padding: 1.5rem 1rem; // Padding ajustado
  background-color: $branco;
  box-shadow: 0 4px 12px rgba($preto, 0.06); // Sombra mais suave
  position: sticky;
  top: 0; // Ajuste para a altura da sua Navbar se ela for fixa
  z-index: 900;
  border-bottom: 1px solid $cinza-borda;
}

.date-buttons-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem; // Gap reduzido
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.date-button {
  padding: 0.6rem 1.25rem; // Padding ajustado
  border: 1px solid $cinza-borda; // Borda mais suave
  background-color: $branco;
  color: $complementoCLaro;
  border-radius: 20px;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem); // Tamanho ajustado
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease-out;
  min-width: 160px;
  text-align: center;
  box-shadow: 0 1px 3px rgba($preto, 0.05);

  &:hover {
    border-color: darken($destaque, 10%);
    color: darken($destaque, 10%);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba($preto, 0.07);
  }

  &.active {
    background-color: $principal;
    color: $branco;
    border-color: $principal;
    box-shadow: 0 4px 10px rgba($principal, 0.25);
    transform: translateY(0); // Remove o translateY do hover para o ativo
  }
}

/* Feedback (Carregamento, Erro, Vazio) */
.feedback-section {
  text-align: center;
  padding: 3rem 1rem; // Padding ajustado
  color: $complementoCLaro;
  font-size: 1.05rem; // Tamanho ajustado

  p {
    margin-bottom: 1.25rem; // Margem ajustada
  }
  .btn-retry {
    padding: 0.7rem 1.8rem;
    background-color: $destaque;
    color: $principal;
    border: 2px solid $destaque;
    font-weight: 600;
    font-size: clamp(0.85rem, 1.8vw, 1rem);
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba($complemento, 0.2);

    &:hover {
      background-color: darken($destaque, 10%);
      border-color: darken($destaque, 10%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($complemento, 0.3);
    }
  }
}
.loading-state .spinner {
  border: 4px solid rgba($principal, 0.15); // Cor do rastro mais clara
  border-top-color: $destaque;
  border-radius: 50%;
  width: 45px; // Tamanho ajustado
  height: 45px;
  animation: spin 0.7s linear infinite; // Velocidade ajustada
  margin: 0 auto 1.25rem auto;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Lista de Atividades */
.activities-list-section {
  padding: 1.5rem 1rem 3rem 1rem; // Padding ajustado
  max-width: 900px;
  margin: 0 auto;
}

.activity-card {
  background-color: $branco;
  border-radius: 10px; // Raio de borda ajustado
  margin-bottom: 1.25rem; // Margem ajustada
  box-shadow: 0 4px 15px rgba($preto, 0.06); // Sombra ajustada
  display: flex;
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: translateY(-3px); // Efeito hover sutil
    box-shadow: 0 8px 25px rgba($preto, 0.08);
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.activity-time-slot {
  background-color: $principal;
  color: $branco;
  padding: 1.25rem 1rem; // Padding ajustado
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-shrink: 0;
  min-width: 130px; // Largura ajustada

  .time {
    font-size: 1.1rem; // Tamanho ajustado
    font-weight: 700;
    line-height: 1.2;
  }
  .type {
    font-size: 0.75rem; // Tamanho ajustado
    text-transform: uppercase;
    background-color: $destaque; // Usando $destaque diretamente
    color: $principal;
    padding: 0.3rem 0.7rem; // Padding ajustado
    border-radius: 12px; // Raio ajustado
    margin-top: 0.6rem; // Margem ajustada
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    padding: 0.9rem; // Padding ajustado
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 3px solid $destaque; // Borda de destaque mais grossa
    .time { font-size: 1rem; }
    .type { margin-top: 0; }
  }
}

.activity-details {
  padding: 1.25rem 1.5rem; // Padding ajustado
  flex-grow: 1;

  .activity-title {
    font-size: 1.35rem; // Tamanho ajustado
    font-weight: 700;
    color: $complemento;
    margin: 0 0 0.6rem 0; // Margem ajustada
  }

  .activity-description {
    font-size: 0.9rem; // Tamanho ajustado
    color: $complementoCLaro;
    line-height: 1.6;
    margin-bottom: 0.9rem; // Margem ajustada
  }

  .activity-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.25rem; // Gap ajustado
    font-size: 0.85rem; // Tamanho ajustado
    color: $complementoCLaro;

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.4rem; // Gap ajustado

      i.mdi {
        font-size: 1.1rem; // Tamanho ajustado
        color: $destaque;
      }
      &.speaker span {
        font-weight: 500;
        color: darken($complementoCLaro, 15%); // Cor ajustada
      }
    }
  }
  @media (max-width: 768px) {
    padding: 1rem 1.25rem; // Padding ajustado
    .activity-title { font-size: 1.2rem; }
    .activity-description { font-size: 0.85rem; }
  }
}

/* Ajustes Gerais de Responsividade */
@media (max-width: 768px) {
  .date-selector-section {
    padding: 1.25rem 0.5rem; // Padding ajustado
  }
  .date-buttons-container {
    gap: 0.6rem;
    button.date-button {
      width: calc(50% - 0.4rem); // Ajustado para novo gap
      padding: 0.6rem 0.4rem; // Padding ajustado
      font-size: 0.8rem; // Tamanho ajustado
    }
  }
}
</style>