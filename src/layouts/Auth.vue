<template>
  <div class="auth-layout">
    <div class="auth-layout__content">
      <router-view />
    </div>

    <Cookie />
  </div>
</template>

<script setup>
  import Cookie from '@/components/cookie/Cookie.vue';
</script>
