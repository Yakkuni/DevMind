<template>
    <section class="sponsors-header">
        <div class="header-background"
        :style="{backgroundImage: `url('${backgroundImage}')` }"
        ></div>

        <div 
        class="header-overlay"
        :style="{backgroundImage: `url('${backgroundImage}')` }"
        ></div>

        <div class="header-content">
            <h1>{{ title }}</h1>
        </div>
    </section>
</template>

<style scoped lang="scss">
  @media (max-width: 768px) {
    .header-content h1 {
      font-size: 2.5rem;
    }
    
    .header-icon {
      width: 150px;
    }
  }
  </style>