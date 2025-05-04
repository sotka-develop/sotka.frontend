<template>
  <div class="not-found">
    <div class="not-found__container container">
      <div class="not-found__content">
        <div class="not-found__image">
          <div class="not-found__frame">
            <Image v-bind="imageData" />
          </div>
        </div>

        <div class="not-found__info">
          <h3 class="not-found__title">
            {{ title }}
          </h3>

          <p class="not-found__text">
            {{ text }}
          </p>

          <div class="not-found__action">
            <Button v-bind="action" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Image from '@/components/image/Image.vue';
  import Button from '@/components/button/Button.vue';

  const title = 'Страница не найдена';
  const text = 'Проверьте запрос и попробуйте еще раз';
  const action = {
    href: '/main',
    text: 'На главную',
  };

  const imageData = {
    src: 'images/404/404.png',
    alt: '',
  };
</script>

<style lang="scss" scoped>
  @import 'NotFound';
</style>
