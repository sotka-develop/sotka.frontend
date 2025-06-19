<template>
  <div class="cookie" :class="{ 'is-active': isVisible }" v-if="shouldRender">
    <p v-if="TEXT" class="cookie__text" v-html="TEXT" />

    <Button text="Ок" @click="handleButton" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import Button from '@/components/button/Button.vue';

  const props = defineProps({
    duration: { type: [Number, String], default: 365 },
    delay: { type: Number, default: 2000 },
  });

  const COOKIE_NAME = 'has_cookie_consent';
  const TEXT =
    'На сайте используются cookies. Продолжая использовать сайт, вы принимаете <a href="https://s0tka.ru/privacy" target="_blank">условия</a>';

  const isVisible = ref(false);
  const shouldRender = ref(true);

  function getCookie(name) {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  function setCookie(name, value, days) {
    try {
      const date = new Date();
      date.setTime(date.getTime() + days * 864e5); // 864e5 = 24*60*60*1000
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
    } catch (err) {
      console.warn('Не удалось установить cookie:', err);
    }
  }

  onMounted(() => {
    if (!getCookie(COOKIE_NAME)) {
      setTimeout(() => {
        isVisible.value = true;
      }, props.delay);
    } else {
      shouldRender.value = false;
    }
  });

  function handleButton(evt) {
    evt.preventDefault();
    setCookie(COOKIE_NAME, 'true', +props.duration);
    isVisible.value = false;

    setTimeout(() => {
      shouldRender.value = false;
    }, 500);
  }
</script>

<style lang="scss">
  @import 'Cookie';
</style>
