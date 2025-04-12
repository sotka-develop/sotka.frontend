<template>
  <div class="auth-layout">
    <div class="auth-layout__header">
      <Header />
    </div>

    <div class="auth-layout__content">
      <router-view />
    </div>

    <div class="auth-layout__footer"></div>
  </div>
</template>

<script setup>
  import Header from '@/components/Header/Header.vue';
</script>
