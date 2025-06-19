<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <Header />
    </div>

    <div class="default-layout__content">
      <router-view />
    </div>

    <div class="default-layout__footer"></div>

    <Cookie />
  </div>
</template>

<script setup>
  import Cookie from '@/components/cookie/Cookie.vue';
  import Header from '@/components/header/Header.vue';
</script>
