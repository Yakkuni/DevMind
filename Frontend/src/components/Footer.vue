<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section about-devmind">
        <h3 class="footer-title">DevMind</h3>
        <p class="footer-text">
          Conectando desenvolvedores e ideias inovadoras em um só lugar. O maior evento de tecnologia de Tabuleiro do Norte.
        </p>
      </div>

      <div class="footer-section quick-links">
        <h4 class="footer-subtitle">Links Rápidos</h4>
        <ul class="footer-links">
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/programacao">Programação</router-link></li>
          <li><router-link to="/patrocinadores">Patrocinadores</router-link></li>
          </ul>
      </div>

      <div class="footer-section contact-info">
        <h4 class="footer-subtitle">Contato & Redes</h4>
        <p class="footer-text">
          <i class="icon-mail"></i> Email: <a href="mailto:contato@devmind.com">contato@devmind.com</a>
        </p>
        <p class="footer-text">
          <i class="icon-instagram"></i> Instagram: <a href="https://instagram.com/devmind.evento" target="_blank" rel="noopener noreferrer">@devmind.evento</a>
        </p>
        </div>
    </div>
    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }} DevMind. Todos os direitos reservados.
    </div>
  </footer>
</template>

<script setup lang="ts">
// Nenhuma lógica de script específica necessária para este rodapé no momento.
</script>

<style scoped lang="scss">
// Suas variáveis globais (assumindo que estão disponíveis ou importe-as)
// Ex: @import '@/styles/variables.scss';
$principal: #2C2966;
$complemento: #131047;
$complementoCLaro: #6C6C94;
$destaque: #FFA051;
$branco: #ffffff;
$preto: #000000;

.footer {
  background-color: $complemento; // Cor de fundo mais escura do tema
  color: $complementoCLaro; // Cor de texto padrão mais suave
  width: 100%;
  padding: 3rem 1.5rem 1.5rem; // Padding ajustado (mais no topo)
  flex-shrink: 0; // Para layouts flex, evita que o footer seja espremido
  box-sizing: border-box;
  border-top: 3px solid $destaque; 
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; // Ou space-around para mais respiro
  gap: 2.5rem; // Gap ajustado
  max-width: 1200px;
  margin: 0 auto; // Centraliza o container
  padding-bottom: 2rem; // Espaço antes do footer-bottom
}

.footer-section {
  flex: 1 1 280px; // Permite que cresçam, mas com base de 280px antes de quebrar

  &.about-devmind {
    // flex-basis: 350px; // Pode dar um pouco mais de espaço se o texto for maior
  }
}

.footer-logo {
  width: 50px;
  height: auto;
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.footer-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: $branco;
  margin-top: 0;
  margin-bottom: 1rem;
}

.footer-subtitle {
  font-size: 1.15rem;
  font-weight: 600;
  color: $branco;
  margin-top: 0;
  margin-bottom: 1rem; // Aumentada a margem para espaçar dos links/texto
  position: relative;
  padding-bottom: 0.5rem; // Espaço para a linha abaixo

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0; // Alinha à esquerda do subtítulo
    width: 40px; // Largura da linha decorativa
    height: 3px; // Espessura da linha
    background-color: $destaque;
    border-radius: 2px;
  }
}

.footer-text {
  font-size: 0.95rem;
  line-height: 1.65; // Melhor legibilidade
  color: $complementoCLaro;
  margin-bottom: 0.6rem; // Espaçamento entre parágrafos

  a {
    color: $complementoCLaro;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: $destaque;
      text-decoration: underline;
    }
  }

  i[class^="icon-"] { // Se você usar classes para ícones como <i class="icon-mail"></i>
    margin-right: 0.6rem; // Espaço após o ícone
    color: $destaque;
    font-size: 1.1em; // Para o ícone ser um pouco maior que o texto
    vertical-align: middle; // Alinha melhor o ícone com o texto
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.7rem; // Espaçamento entre itens da lista
  }

  a { // Aplica-se a router-link também
    text-decoration: none;
    color: $complementoCLaro;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.3s ease, padding-left 0.3s ease;
    position: relative;
    display: inline-block; // Para o padding-left no hover funcionar bem

    &:hover {
      color: $destaque;
      padding-left: 8px; // Pequeno deslocamento no hover
    }
  }
}

.footer-bottom {
  text-align: center;
  margin-top: 2.5rem;
  font-size: 0.85rem;
  color: rgba($branco, 0.65); // Cor mais sutil para o copyright
  border-top: 1px solid rgba($branco, 0.1); // Borda sutil com cor do tema
  padding-top: 1.5rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .footer {
    padding: 2.5rem 1rem 1.5rem; // Ajusta padding geral em mobile
  }
  .footer-container {
    flex-direction: column;
    align-items: center; // Centraliza seções quando empilhadas
    text-align: center; // Centraliza texto dentro das seções
    gap: 2.2rem; // Ajusta gap quando empilhado
  }

  .footer-section {
    width: 100%;
    max-width: 400px; // Limita a largura das seções em mobile para melhor leitura
  }
  .footer-subtitle::after { // Centraliza a linha abaixo do subtítulo em mobile
    left: 50%;
    transform: translateX(-50%);
  }
  .footer-links li {
    // text-align: center; // Se os links precisarem ser centralizados também, já é herdado
  }
  .footer-text {
    // text-align: center; // Já é herdado
    i[class^="icon-"] {
        display: block; // Ícone em linha separada em mobile, se desejado
        margin-bottom: 0.3rem;
    }
  }
}

@media (max-width: 480px) {
    .footer-title { font-size: 1.5rem; }
    .footer-subtitle { font-size: 1.1rem; }
    .footer-text, .footer-links a { font-size: 0.9rem; }
}
</style>