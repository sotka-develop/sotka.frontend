<template>
  <div class="auth-layout">
    <div class="auth-layout__header">
      <Header auth />
    </div>

    <div class="auth-layout__content">
      <router-view />
    </div>

    <Cookie />
  </div>
</template>

<script setup>
  import Cookie from '@/components/cookie/Cookie.vue';
  import Header from '@/components/header/Header.vue';
</script>
