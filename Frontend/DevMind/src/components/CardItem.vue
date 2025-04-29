<template>
    <div
      class="card"
      :style="{ backgroundColor: bgColor, borderColor: borderColor }"
    >
      <img
        class="fade-in"
        :src="image"
        alt=""
        width="100%"
      />
      <div class="content">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string;
    description: string;
    image: string;
    bgColor: string;
    borderColor: string;
  }>();
  </script>
  
  <style scoped lang="scss">
  .card {
    width: 300px;
    border: 1px solid;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s, box-shadow 0.3s;
    img {
      opacity: 0;
      animation: fadeIn 1s forwards;
    }
    .content {
      padding: 1.5rem;
      height: 194px;
      h2 {
        color: #fff;
        margin: 0 0 0.75rem;
      }
      p {
        color: #fff;
        margin: 0;
      }
    }
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
  }
  
  @keyframes fadeIn {
    to { opacity: 1; }
  }
  </style>
  