<template>
  <div class="error-layout">
    <div class="error-layout__header">
      <Header />
    </div>

    <div class="error-layout__content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
  import Header from '@/components/header/Header.vue';
</script>
