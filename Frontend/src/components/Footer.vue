<template>
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3 class="footer-title">DevMind</h3>
          <p class="footer-text">
            Conectando desenvolvedores e ideias inovadoras em um só lugar.
          </p>
        </div>
  
        <div class="footer-section">
          <h4 class="footer-subtitle">Links Rápidos</h4>
          <ul class="footer-links">
            <li><router-link to="/">Início</router-link></li>
            <li><router-link to="/programacao">Programação</router-link></li>
            <li><a href="#">Patrocinadores</a></li>
          </ul>
        </div>
  
        <div class="footer-section">
          <h4 class="footer-subtitle">Contato</h4>
          <p class="footer-text">Email: contato@devmind.com</p>
          <p class="footer-text">Instagram: @devmind.evento</p>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; {{ new Date().getFullYear() }} DevMind. Todos os direitos reservados.
      </div>
    </footer>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped lang="scss">
  .footer {
    background-color: #111;
    color: #fff;
    width: 100%;
    padding: 2rem 1rem 1rem;
    flex-shrink: 0; // ← Evita ser espremido em layouts flex
    box-sizing: border-box; // ← Garante que padding não ultrapasse 100%
  }
  
  .footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-section {
    flex: 1 1 250px;
  }
  
  .footer-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .footer-subtitle {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .footer-text {
    font-size: 1rem;
    color: #ccc;
    margin-bottom: 0.3rem;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  
    li {
      margin-bottom: 0.4rem;
    }
  
    a {
      text-decoration: none;
      color: #ccc;
      transition: color 0.3s;
  
      &:hover {
        color: #fff;
      }
    }
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.9rem;
    color: #aaa;
    border-top: 1px solid #333;
    padding-top: 1rem;
  }
  
  /* Responsivo */
  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
  
    .footer-section {
      width: 100%;
    }
  }
  </style>
  