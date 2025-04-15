<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <Header />
    </div>

    <div class="default-layout__content">
      <router-view />
    </div>

    <div class="default-layout__footer"></div>
  </div>
</template>

<script setup>
  import Header from '@/components/header/Header.vue';
</script>
