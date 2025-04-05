<template>
  <div class="default-layout">
    <div class="default-layout__header">default-layout header</div>
    <router-view />
    <div class="default-layout__footer">default-layout footer</div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue';
</script>
