<template>
  <div class="auth-layout">
    <div class="auth-layout__header">
      <Header />
    </div>

    <router-view />

    <div class="auth-layout__footer">auth-layout footer</div>
  </div>
</template>

<script setup>
  import Header from '@/components/Header/Header.vue';
</script>
